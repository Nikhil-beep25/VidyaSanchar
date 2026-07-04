import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { RoleType } from '@prisma/client';

export async function getUserProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        address: true,
        profileImage: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    let studentId: string | null = null;
    let teacherId: string | null = null;
    let parentId: string | null = null;

    if (user.role === RoleType.STUDENT) {
      const student = await prisma.student.findUnique({ where: { userId } });
      studentId = student ? student.id : null;
    } else if (user.role === RoleType.TEACHER) {
      const teacher = await prisma.teacher.findUnique({ where: { userId } });
      teacherId = teacher ? teacher.id : null;
    } else if (user.role === RoleType.PARENT) {
      const parent = await prisma.parent.findUnique({ where: { userId } });
      parentId = parent ? parent.id : null;
    }

    return res.status(200).json({
      ...user,
      studentId,
      teacherId,
      parentId,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUserProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    const { name, phone, address, profileImage } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phone,
        address,
        profileImage,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        address: true,
        profileImage: true,
        isActive: true,
      },
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
}
