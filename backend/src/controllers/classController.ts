import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';

export async function getAllClasses(req: Request, res: Response, next: NextFunction) {
  try {
    const classes = await prisma.class.findMany({
      include: {
        classTeacher: {
          include: {
            user: {
              select: { name: true, email: true }
            }
          }
        },
        _count: {
          select: { students: true, subjects: true }
        }
      },
      orderBy: { name: 'asc' }
    });
    return res.status(200).json(classes);
  } catch (error) {
    next(error);
  }
}

export async function createClass(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, section, roomNumber, classTeacherId } = req.body;
    if (!name || !section) {
      return res.status(400).json({ message: 'Name and section are required.' });
    }

    const newClass = await prisma.class.create({
      data: {
        name,
        section,
        roomNumber,
        classTeacherId: classTeacherId || null,
      }
    });

    return res.status(201).json(newClass);
  } catch (error) {
    next(error);
  }
}

export async function updateClass(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { name, section, roomNumber, classTeacherId } = req.body;

    const updatedClass = await prisma.class.update({
      where: { id },
      data: {
        name,
        section,
        roomNumber,
        classTeacherId: classTeacherId || null,
      }
    });

    return res.status(200).json(updatedClass);
  } catch (error) {
    next(error);
  }
}

export async function deleteClass(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await prisma.class.delete({ where: { id } });
    return res.status(200).json({ message: 'Class deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
