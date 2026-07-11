import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { NoticeType } from '@prisma/client';

/**
 * Get active notices (school-wide or targeted to a specific class, pinned first)
 */
export async function getNotices(req: Request, res: Response, next: NextFunction) {
  try {
    const userRole = req.user?.role;
    const userId = req.user?.userId;
    const schoolId = req.user?.schoolId;

    if (!userRole || !userId) {
      return res.status(401).json({ message: 'User context missing.' });
    }

    let classIdFilter: string | null = null;

    if (userRole === 'STUDENT') {
      const student = await prisma.student.findUnique({
        where: { userId },
        select: { classId: true }
      });
      if (student) {
        classIdFilter = student.classId;
      }
    } else if (userRole === 'PARENT') {
      // Find classes of children
      const parent = await prisma.parent.findUnique({
        where: { userId },
        include: {
          students: { select: { classId: true } },
          relations: { include: { student: { select: { classId: true } } } }
        }
      });
      if (parent) {
        const studentClasses = new Set<string>();
        parent.students.forEach(s => studentClasses.add(s.classId));
        parent.relations.forEach(r => studentClasses.add(r.student.classId));
        
        // If parent has children in multiple classes, fetch for all of them
        const classIds = Array.from(studentClasses);
        const notices = await prisma.notice.findMany({
          where: {
            isDeleted: false,
            OR: [
              { classId: null },
              { classId: { in: classIds } }
            ]
          },
          include: {
            author: { select: { name: true, role: true } }
          },
          orderBy: [
            { isPinned: 'desc' },
            { createdAt: 'desc' }
          ]
        });
        return res.status(200).json(notices);
      }
    }

    const notices = await prisma.notice.findMany({
      where: {
        isDeleted: false,
        ...(classIdFilter ? {
          OR: [
            { classId: null },
            { classId: classIdFilter }
          ]
        } : {})
      },
      include: {
        author: { select: { name: true, role: true } }
      },
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return res.status(200).json(notices);
  } catch (error) {
    next(error);
  }
}

/**
 * Create a notice (Admin / Teacher only)
 */
export async function createNotice(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    const schoolId = req.user?.schoolId;
    const { title, content, type, classId, isPinned, attachment } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'User context missing.' });
    }
    if (!title || !content || !type) {
      return res.status(400).json({ message: 'Title, content, and notice type are required.' });
    }

    // Validate type matches NoticeType enum
    const validTypes = Object.values(NoticeType);
    if (!validTypes.includes(type as NoticeType)) {
      return res.status(400).json({ message: `Invalid notice type. Allowed: ${validTypes.join(', ')}` });
    }

    const notice = await prisma.notice.create({
      data: {
        title,
        content,
        type: type as NoticeType,
        classId: classId || null,
        isPinned: isPinned || false,
        attachment: attachment || null,
        authorId: userId,
        schoolId
      }
    });

    return res.status(201).json(notice);
  } catch (error) {
    next(error);
  }
}

/**
 * Soft delete a notice
 */
export async function deleteNotice(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const notice = await prisma.notice.update({
      where: { id },
      data: { isDeleted: true }
    });
    return res.status(200).json({ message: 'Notice soft-deleted successfully.', notice });
  } catch (error) {
    next(error);
  }
}
