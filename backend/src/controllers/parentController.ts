import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { hashPassword } from '../utils/hash';

export async function getAllParents(req: Request, res: Response, next: NextFunction) {
  try {
    const { search } = req.query;

    const whereClause: any = {};
    if (search) {
      whereClause.OR = [
        { relation: { contains: search as string, mode: 'insensitive' } },
        { occupation: { contains: search as string, mode: 'insensitive' } },
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

    const parents = await prisma.parent.findMany({
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
        students: {
          select: {
            id: true,
            rollNumber: true,
            user: {
              select: { name: true }
            }
          }
        }
      },
      orderBy: { id: 'asc' }
    });

    return res.status(200).json(parents);
  } catch (error) {
    next(error);
  }
}

export async function getParentById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const parent = await prisma.parent.findUnique({
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
        students: {
          include: {
            user: {
              select: { name: true }
            },
            studentClass: true
          }
        }
      }
    });

    if (!parent) {
      return res.status(404).json({ message: 'Parent not found.' });
    }

    return res.status(200).json(parent);
  } catch (error) {
    next(error);
  }
}

export async function createParent(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      email,
      password,
      name,
      phone,
      address,
      profileImage,
      occupation,
      relation
    } = req.body;

    if (!email || !name || !relation) {
      return res.status(400).json({ message: 'Email, name, and relation are required.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    const passwordHash = await hashPassword(password || 'Parent@123');

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          name,
          role: 'PARENT',
          phone,
          address,
          profileImage: profileImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120',
        }
      });

      const parent = await tx.parent.create({
        data: {
          userId: user.id,
          occupation,
          relation,
        },
        include: {
          user: true
        }
      });

      return parent;
    });

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function updateParent(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      address,
      profileImage,
      occupation,
      relation,
      isActive
    } = req.body;

    const parent = await prisma.parent.findUnique({
      where: { id },
      include: { user: true }
    });
    if (!parent) {
      return res.status(404).json({ message: 'Parent not found.' });
    }

    const result = await prisma.$transaction(async (tx) => {
      if (email && email !== parent.user.email) {
        const existingEmail = await tx.user.findUnique({ where: { email } });
        if (existingEmail) {
          throw new Error('Email address is already in use by another user.');
        }
      }

      await tx.user.update({
        where: { id: parent.userId },
        data: {
          name,
          email,
          phone,
          address,
          profileImage,
          isActive: isActive !== undefined ? isActive : undefined,
        }
      });

      const updatedParent = await tx.parent.update({
        where: { id },
        data: {
          occupation,
          relation,
        },
        include: {
          user: true
        }
      });

      return updatedParent;
    });

    return res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to update parent.' });
  }
}

export async function deleteParent(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const parent = await prisma.parent.findUnique({ where: { id } });
    if (!parent) {
      return res.status(404).json({ message: 'Parent not found.' });
    }

    await prisma.user.delete({ where: { id: parent.userId } });

    return res.status(200).json({ message: 'Parent deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
