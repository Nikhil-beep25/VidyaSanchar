import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';

export async function createTimetableSlot(req: Request, res: Response, next: NextFunction) {
  try {
    const { dayOfWeek, startTime, endTime, roomNumber, classId, subjectId, teacherId } = req.body;

    if (!dayOfWeek || !startTime || !endTime || !classId || !subjectId || !teacherId) {
      return res.status(400).json({ message: 'Required timetable slot fields are missing.' });
    }

    // 1. Conflict Check: Teacher Double Booking
    const teacherConflict = await prisma.timetable.findFirst({
      where: {
        teacherId,
        dayOfWeek,
        isDeleted: false,
        OR: [
          {
            startTime: { lte: startTime },
            endTime: { gt: startTime }
          },
          {
            startTime: { lt: endTime },
            endTime: { gte: endTime }
          },
          {
            startTime: { gte: startTime },
            endTime: { lte: endTime }
          }
        ]
      }
    });

    if (teacherConflict) {
      return res.status(400).json({
        message: `Conflict: Teacher is already booked on ${dayOfWeek} from ${teacherConflict.startTime} to ${teacherConflict.endTime}.`
      });
    }

    // 2. Conflict Check: Classroom/Room Double Booking
    if (roomNumber) {
      const roomConflict = await prisma.timetable.findFirst({
        where: {
          roomNumber,
          dayOfWeek,
          isDeleted: false,
          OR: [
            {
              startTime: { lte: startTime },
              endTime: { gt: startTime }
            },
            {
              startTime: { lt: endTime },
              endTime: { gte: endTime }
            },
            {
              startTime: { gte: startTime },
              endTime: { lte: endTime }
            }
          ]
        }
      });

      if (roomConflict) {
        return res.status(400).json({
          message: `Conflict: Room ${roomNumber} is already occupied on ${dayOfWeek} from ${roomConflict.startTime} to ${roomConflict.endTime}.`
        });
      }
    }

    const slot = await prisma.timetable.create({
      data: {
        dayOfWeek,
        startTime,
        endTime,
        roomNumber,
        classId,
        subjectId,
        teacherId,
      }
    });

    return res.status(201).json(slot);
  } catch (error) {
    next(error);
  }
}

export async function getClassTimetable(req: Request, res: Response, next: NextFunction) {
  try {
    const { classId } = req.params;
    const slots = await prisma.timetable.findMany({
      where: { classId, isDeleted: false },
      include: {
        subject: true,
        teacher: {
          include: {
            user: { select: { name: true } }
          }
        }
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    });
    return res.status(200).json(slots);
  } catch (error) {
    next(error);
  }
}

export async function getTeacherTimetable(req: Request, res: Response, next: NextFunction) {
  try {
    const { teacherId } = req.params;
    const slots = await prisma.timetable.findMany({
      where: { teacherId, isDeleted: false },
      include: {
        subject: true,
        timetableClass: true
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    });
    return res.status(200).json(slots);
  } catch (error) {
    next(error);
  }
}

/**
 * Resolve dynamic user timetable based on authenticated role context
 */
export async function getMyTimetable(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    if (!userId || !userRole) {
      return res.status(401).json({ message: 'User context missing.' });
    }

    if (userRole === 'STUDENT') {
      const student = await prisma.student.findUnique({ where: { userId } });
      if (!student) return res.status(404).json({ message: 'Student profile not found.' });

      const slots = await prisma.timetable.findMany({
        where: { classId: student.classId, isDeleted: false },
        include: {
          subject: true,
          teacher: { include: { user: { select: { name: true } } } }
        },
        orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }]
      });
      return res.status(200).json(slots);
    }

    if (userRole === 'TEACHER') {
      const teacher = await prisma.teacher.findUnique({ where: { userId } });
      if (!teacher) return res.status(404).json({ message: 'Teacher profile not found.' });

      const slots = await prisma.timetable.findMany({
        where: { teacherId: teacher.id, isDeleted: false },
        include: {
          subject: true,
          timetableClass: true
        },
        orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }]
      });
      return res.status(200).json(slots);
    }

    if (userRole === 'PARENT') {
      const parent = await prisma.parent.findUnique({
        where: { userId },
        include: {
          students: { select: { classId: true, id: true, user: { select: { name: true } } } },
          relations: { include: { student: { select: { classId: true, id: true, user: { select: { name: true } } } } } }
        }
      });
      if (!parent) return res.status(404).json({ message: 'Parent profile not found.' });

      const childClasses = new Map<string, string>(); // classId -> childName
      parent.students.forEach(s => childClasses.set(s.classId, s.user.name));
      parent.relations.forEach(r => childClasses.set(r.student.classId, r.student.user.name));

      const classIds = Array.from(childClasses.keys());
      const slots = await prisma.timetable.findMany({
        where: { classId: { in: classIds }, isDeleted: false },
        include: {
          subject: true,
          timetableClass: true,
          teacher: { include: { user: { select: { name: true } } } }
        },
        orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }]
      });

      // Group slots by child / class
      const grouped = slots.map(slot => ({
        ...slot,
        childName: childClasses.get(slot.classId) || 'Child'
      }));

      return res.status(200).json(grouped);
    }

    return res.status(400).json({ message: 'Dynamic schedule resolve not supported for Admins. Query class or teacher directly.' });
  } catch (error) {
    next(error);
  }
}

export async function deleteTimetableSlot(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await prisma.timetable.update({
      where: { id },
      data: { isDeleted: true }
    });
    return res.status(200).json({ message: 'Slot soft-deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
