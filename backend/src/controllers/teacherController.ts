import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { hashPassword } from '../utils/hash';
import { createAuditLog } from '../utils/audit';

export async function getAllTeachers(req: Request, res: Response, next: NextFunction) {
  try {
    const { search } = req.query;

    const whereClause: any = {};
    if (search) {
      whereClause.OR = [
        { employeeId: { contains: search as string, mode: 'insensitive' } },
        { specialization: { contains: search as string, mode: 'insensitive' } },
        {
          user: {
            OR: [
              { name: { contains: search as string, mode: 'insensitive' } },
              { email: { contains: search as string, mode: 'insensitive' } }
            ]
          }
        }
      ];
    }

    const teachers = await prisma.teacher.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
            address: true,
            profileImage: true,
            isActive: true,
          }
        },
        subjects: {
          select: { id: true, name: true, code: true }
        }
      },
      orderBy: { employeeId: 'asc' }
    });

    return res.status(200).json(teachers);
  } catch (error) {
    next(error);
  }
}

export async function getTeacherById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
            address: true,
            profileImage: true,
            isActive: true,
          }
        },
        subjects: true,
        classesLed: true
      }
    });

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found.' });
    }

    return res.status(200).json(teacher);
  } catch (error) {
    next(error);
  }
}

export async function createTeacher(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      email,
      password,
      name,
      phone,
      address,
      profileImage,
      employeeId,
      qualification,
      specialization,
      joiningDate
    } = req.body;

    if (!email || !name || !employeeId || !qualification || !specialization || !joiningDate) {
      return res.status(400).json({ message: 'Required fields missing for teacher creation.' });
    }

    // Check unique constraints
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    const existingEmp = await prisma.teacher.findUnique({ where: { employeeId } });
    if (existingEmp) {
      return res.status(400).json({ message: 'Employee ID already exists.' });
    }

    const passwordHash = await hashPassword(password || 'Teacher@123');

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          name,
          role: 'TEACHER',
          phone,
          address,
          profileImage: profileImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
        }
      });

      const teacher = await tx.teacher.create({
        data: {
          userId: user.id,
          employeeId,
          qualification,
          specialization,
          joiningDate: new Date(joiningDate),
        },
        include: {
          user: true
        }
      });

      return teacher;
    });

    await createAuditLog(
      req.user?.userId,
      'TEACHER_CREATED',
      `Registered new teacher: ${result.user.name} (ID: ${result.employeeId})`,
      req.user?.schoolId
    );

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function updateTeacher(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      address,
      profileImage,
      employeeId,
      qualification,
      specialization,
      joiningDate,
      isActive,
      subjectId,
      classId
    } = req.body;

    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: { user: true }
    });
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found.' });
    }

    const result = await prisma.$transaction(async (tx) => {
      if (email && email !== teacher.user.email) {
        const existingEmail = await tx.user.findUnique({ where: { email } });
        if (existingEmail) {
          throw new Error('Email address is already in use by another user.');
        }
      }

      await tx.user.update({
        where: { id: teacher.userId },
        data: {
          name,
          email,
          phone,
          address,
          profileImage,
          isActive: isActive !== undefined ? isActive : undefined,
        }
      });

      const updatedTeacher = await tx.teacher.update({
        where: { id },
        data: {
          employeeId,
          qualification,
          specialization,
          joiningDate: joiningDate ? new Date(joiningDate) : undefined,
        },
        include: {
          user: true
        }
      });

      if (classId !== undefined) {
        await tx.class.updateMany({
          where: { classTeacherId: id },
          data: { classTeacherId: null }
        });
        if (classId) {
          await tx.class.update({
            where: { id: classId },
            data: { classTeacherId: id }
          });
        }
      }

      if (subjectId !== undefined) {
        await tx.subject.updateMany({
          where: { teacherId: id },
          data: { teacherId: null }
        });
        if (subjectId) {
          await tx.subject.update({
            where: { id: subjectId },
            data: { teacherId: id }
          });
        }
      }

      return updatedTeacher;
    });

    await createAuditLog(
      req.user?.userId,
      'TEACHER_UPDATED',
      `Updated teacher profile: ${result.user.name} (ID: ${result.employeeId})`,
      req.user?.schoolId
    );

    return res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to update teacher.' });
  }
}

export async function deleteTeacher(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const teacher = await prisma.teacher.findUnique({ where: { id } });
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found.' });
    }

    const teacherUser = await prisma.user.findUnique({
      where: { id: teacher.userId },
      select: { name: true }
    });

    await prisma.user.delete({ where: { id: teacher.userId } });

    await createAuditLog(
      req.user?.userId,
      'TEACHER_DELETED',
      `Deleted teacher profile: ${teacherUser?.name || 'Unknown'} (ID: ${teacher.employeeId})`,
      req.user?.schoolId
    );

    return res.status(200).json({ message: 'Teacher deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
