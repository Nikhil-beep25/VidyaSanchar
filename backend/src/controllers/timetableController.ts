import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';

export async function createTimetableSlot(req: Request, res: Response, next: NextFunction) {
  try {
    const { dayOfWeek, startTime, endTime, roomNumber, classId, subjectId, teacherId } = req.body;

    if (!dayOfWeek || !startTime || !endTime || !classId || !subjectId || !teacherId) {
      return res.status(400).json({ message: 'Required timetable slot fields are missing.' });
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
      where: { classId },
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
      where: { teacherId },
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

export async function deleteTimetableSlot(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await prisma.timetable.delete({ where: { id } });
    return res.status(200).json({ message: 'Slot deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
