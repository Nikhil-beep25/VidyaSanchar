import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';

export async function getAllSubjects(req: Request, res: Response, next: NextFunction) {
  try {
    const subjects = await prisma.subject.findMany({
      include: {
        subjectClass: {
          select: { name: true, section: true }
        },
        teacher: {
          include: {
            user: {
              select: { name: true }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });
    return res.status(200).json(subjects);
  } catch (error) {
    next(error);
  }
}

export async function createSubject(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, code, classId, teacherId } = req.body;
    if (!name || !code || !classId) {
      return res.status(400).json({ message: 'Name, code, and classId are required.' });
    }

    const newSubject = await prisma.subject.create({
      data: {
        name,
        code,
        classId,
        teacherId: teacherId || null,
      }
    });

    return res.status(201).json(newSubject);
  } catch (error) {
    next(error);
  }
}

export async function updateSubject(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { name, code, classId, teacherId } = req.body;

    const updatedSubject = await prisma.subject.update({
      where: { id },
      data: {
        name,
        code,
        classId,
        teacherId: teacherId || null,
      }
    });

    return res.status(200).json(updatedSubject);
  } catch (error) {
    next(error);
  }
}

export async function deleteSubject(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await prisma.subject.delete({ where: { id } });
    return res.status(200).json({ message: 'Subject deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
