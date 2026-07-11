import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';

/**
 * List homework assignments (filtered by class/student/teacher context)
 */
export async function getHomework(req: Request, res: Response, next: NextFunction) {
  try {
    const userRole = req.user?.role;
    const userId = req.user?.userId;

    if (!userRole || !userId) {
      return res.status(401).json({ message: 'User context missing.' });
    }

    if (userRole === 'TEACHER') {
      const teacher = await prisma.teacher.findUnique({ where: { userId } });
      if (!teacher) {
        return res.status(404).json({ message: 'Teacher profile not found.' });
      }
      const homework = await prisma.homework.findMany({
        where: { teacherId: teacher.id, isDeleted: false },
        include: {
          homeworkClass: true,
          subject: true,
        },
        orderBy: { createdAt: 'desc' }
      });
      return res.status(200).json(homework);
    }

    if (userRole === 'STUDENT') {
      const student = await prisma.student.findUnique({ where: { userId } });
      if (!student) {
        return res.status(404).json({ message: 'Student profile not found.' });
      }
      const homework = await prisma.homework.findMany({
        where: { classId: student.classId, isDeleted: false },
        include: {
          subject: true,
          teacher: { include: { user: { select: { name: true } } } },
          submissions: { where: { studentId: student.id } }
        },
        orderBy: { dueDate: 'asc' }
      });
      return res.status(200).json(homework);
    }

    if (userRole === 'PARENT') {
      const parent = await prisma.parent.findUnique({
        where: { userId },
        include: {
          students: { select: { classId: true, id: true, user: { select: { name: true } } } },
          relations: { include: { student: { select: { classId: true, id: true, user: { select: { name: true } } } } } }
        }
      });

      if (!parent) {
        return res.status(404).json({ message: 'Parent profile not found.' });
      }

      // Collect all child class IDs and student IDs
      const childData = new Map<string, string>(); // studentId -> studentName
      const classIds = new Set<string>();

      parent.students.forEach(s => {
        childData.set(s.id, s.user.name);
        classIds.add(s.classId);
      });
      parent.relations.forEach(r => {
        childData.set(r.student.id, r.student.user.name);
        classIds.add(r.student.classId);
      });

      const homework = await prisma.homework.findMany({
        where: { classId: { in: Array.from(classIds) }, isDeleted: false },
        include: {
          homeworkClass: true,
          subject: true,
          teacher: { include: { user: { select: { name: true } } } },
          submissions: { where: { studentId: { in: Array.from(childData.keys()) } } }
        },
        orderBy: { dueDate: 'asc' }
      });

      // Map homework to denote which child it targets
      const mapped = homework.map(h => {
        // Find which student belongs to this homework's class
        // In a real database, we look up classId mappings.
        return {
          ...h,
          childSubmissions: h.submissions.map(sub => ({
            ...sub,
            childName: childData.get(sub.studentId) || 'Child'
          }))
        };
      });

      return res.status(200).json(mapped);
    }

    // Admins see all homework
    const homework = await prisma.homework.findMany({
      where: { isDeleted: false },
      include: {
        homeworkClass: true,
        subject: true,
        teacher: { include: { user: { select: { name: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json(homework);
  } catch (error) {
    next(error);
  }
}

/**
 * Create Homework (Teacher only)
 */
export async function createHomework(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    const { title, description, dueDate, classId, subjectId, attachment } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'User context missing.' });
    }
    if (!title || !description || !dueDate || !classId || !subjectId) {
      return res.status(400).json({ message: 'Title, description, dueDate, classId, and subjectId are required.' });
    }

    const teacher = await prisma.teacher.findUnique({ where: { userId } });
    if (!teacher) {
      return res.status(403).json({ message: 'Only teachers can create homework assignments.' });
    }

    const homework = await prisma.homework.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        classId,
        subjectId,
        teacherId: teacher.id,
        attachment: attachment || null
      }
    });

    return res.status(201).json(homework);
  } catch (error) {
    next(error);
  }
}

/**
 * Submit Homework (Student only)
 */
export async function submitHomework(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    const { homeworkId } = req.params;
    const { filePath } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'User context missing.' });
    }
    if (!filePath) {
      return res.status(400).json({ message: 'Submission attachment file path is required.' });
    }

    const student = await prisma.student.findUnique({ where: { userId } });
    if (!student) {
      return res.status(403).json({ message: 'Only students can submit homework.' });
    }

    const homework = await prisma.homework.findUnique({ where: { id: homeworkId } });
    if (!homework) {
      return res.status(404).json({ message: 'Homework assignment not found.' });
    }

    // Determine late submission status
    const status = new Date() > new Date(homework.dueDate) ? 'LATE' : 'SUBMITTED';

    const submission = await prisma.homeworkSubmission.upsert({
      where: {
        homeworkId_studentId: { homeworkId, studentId: student.id }
      },
      update: {
        filePath,
        submissionDate: new Date(),
        status
      },
      create: {
        homeworkId,
        studentId: student.id,
        filePath,
        status
      }
    });

    return res.status(200).json(submission);
  } catch (error) {
    next(error);
  }
}

/**
 * Fetch all submissions for a homework assignment (Teacher only)
 */
export async function getHomeworkSubmissions(req: Request, res: Response, next: NextFunction) {
  try {
    const { homeworkId } = req.params;
    const submissions = await prisma.homeworkSubmission.findMany({
      where: { homeworkId, isDeleted: false },
      include: {
        student: { include: { user: { select: { name: true } } } }
      },
      orderBy: { submissionDate: 'desc' }
    });
    return res.status(200).json(submissions);
  } catch (error) {
    next(error);
  }
}

/**
 * Grade a homework submission (Teacher only)
 */
export async function gradeHomeworkSubmission(req: Request, res: Response, next: NextFunction) {
  try {
    const { submissionId } = req.params;
    const { marksObtained, feedback } = req.body;

    if (marksObtained === undefined) {
      return res.status(400).json({ message: 'marksObtained is required.' });
    }

    const submission = await prisma.homeworkSubmission.update({
      where: { id: submissionId },
      data: {
        marksObtained: parseFloat(marksObtained),
        feedback: feedback || null,
        status: 'GRADED'
      }
    });

    return res.status(200).json(submission);
  } catch (error) {
    next(error);
  }
}
