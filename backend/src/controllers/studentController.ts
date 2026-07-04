import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { hashPassword } from '../utils/hash';

export async function getAllStudents(req: Request, res: Response, next: NextFunction) {
  try {
    const { search, classId } = req.query;

    const whereClause: any = {};
    if (classId) {
      whereClause.classId = classId as string;
    }

    if (search) {
      whereClause.OR = [
        { rollNumber: { contains: search as string, mode: 'insensitive' } },
        { admissionNumber: { contains: search as string, mode: 'insensitive' } },
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

    const students = await prisma.student.findMany({
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
        studentClass: {
          select: { name: true, section: true }
        },
        parent: {
          include: {
            user: {
              select: { name: true, phone: true }
            }
          }
        }
      },
      orderBy: { rollNumber: 'asc' }
    });

    return res.status(200).json(students);
  } catch (error) {
    next(error);
  }
}

export async function getStudentById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const student = await prisma.student.findUnique({
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
        studentClass: true,
        parent: {
          include: {
            user: {
              select: { name: true, email: true, phone: true, address: true }
            }
          }
        }
      }
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    return res.status(200).json(student);
  } catch (error) {
    next(error);
  }
}

export async function createStudent(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      email,
      password,
      name,
      phone,
      address,
      profileImage,
      rollNumber,
      admissionNumber,
      dateOfBirth,
      gender,
      bloodGroup,
      classId,
      parentId
    } = req.body;

    if (!email || !name || !rollNumber || !admissionNumber || !dateOfBirth || !gender || !classId) {
      return res.status(400).json({ message: 'Required fields missing for student creation.' });
    }

    // Check unique constraints
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    const existingRoll = await prisma.student.findUnique({ where: { rollNumber } });
    if (existingRoll) {
      return res.status(400).json({ message: 'Roll number already exists.' });
    }

    const existingAdm = await prisma.student.findUnique({ where: { admissionNumber } });
    if (existingAdm) {
      return res.status(400).json({ message: 'Admission number already exists.' });
    }

    const passwordHash = await hashPassword(password || 'Password@123');

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          name,
          role: 'STUDENT',
          phone,
          address,
          profileImage: profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
        }
      });

      const student = await tx.student.create({
        data: {
          userId: user.id,
          rollNumber,
          admissionNumber,
          dateOfBirth: new Date(dateOfBirth),
          gender,
          bloodGroup,
          classId,
          parentId: parentId || null,
        },
        include: {
          user: true,
          studentClass: true
        }
      });

      return student;
    });

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function updateStudent(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      address,
      profileImage,
      rollNumber,
      admissionNumber,
      dateOfBirth,
      gender,
      bloodGroup,
      classId,
      parentId,
      isActive
    } = req.body;

    const student = await prisma.student.findUnique({
      where: { id },
      include: { user: true }
    });
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    const result = await prisma.$transaction(async (tx) => {
      if (email && email !== student.user.email) {
        const existingEmail = await tx.user.findUnique({ where: { email } });
        if (existingEmail) {
          throw new Error('Email address is already in use by another user.');
        }
      }

      // Update User details
      await tx.user.update({
        where: { id: student.userId },
        data: {
          name,
          email,
          phone,
          address,
          profileImage,
          isActive: isActive !== undefined ? isActive : undefined,
        }
      });

      // Update Student profile
      const updatedStudent = await tx.student.update({
        where: { id },
        data: {
          rollNumber,
          admissionNumber,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
          gender,
          bloodGroup,
          classId,
          parentId: parentId !== undefined ? (parentId === '' ? null : parentId) : undefined,
        },
        include: {
          user: true,
          studentClass: true
        }
      });

      return updatedStudent;
    });

    return res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to update student.' });
  }
}

export async function deleteStudent(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const student = await prisma.student.findUnique({ where: { id } });
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    // Deleting user will cascade delete the student profile due to Schema definition
    await prisma.user.delete({ where: { id: student.userId } });

    return res.status(200).json({ message: 'Student deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
