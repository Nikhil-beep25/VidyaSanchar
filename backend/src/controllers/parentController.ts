import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { hashPassword } from '../utils/hash';

/**
 * Get children linked to the parent
 */
export async function getChildren(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'User context missing.' });
    }

    const parent = await prisma.parent.findUnique({
      where: { userId },
      include: {
        students: {
          include: {
            user: { select: { name: true, profileImage: true, email: true } },
            studentClass: true,
          },
        },
        relations: {
          include: {
            student: {
              include: {
                user: { select: { name: true, profileImage: true, email: true } },
                studentClass: true,
              },
            },
          },
        },
      },
    });

    if (!parent) {
      return res.status(404).json({ message: 'Parent profile not found.' });
    }

    const childrenMap = new Map<string, any>();

    parent.students.forEach((s) => {
      childrenMap.set(s.id, {
        id: s.id,
        rollNumber: s.rollNumber,
        admissionNumber: s.admissionNumber,
        name: s.user.name,
        email: s.user.email,
        profileImage: s.user.profileImage,
        className: `${s.studentClass.name}-${s.studentClass.section}`,
        classId: s.classId,
      });
    });

    parent.relations.forEach((r) => {
      const s = r.student;
      childrenMap.set(s.id, {
        id: s.id,
        rollNumber: s.rollNumber,
        admissionNumber: s.admissionNumber,
        name: s.user.name,
        email: s.user.email,
        profileImage: s.user.profileImage,
        className: `${s.studentClass.name}-${s.studentClass.section}`,
        classId: s.classId,
        relationType: r.relation,
      });
    });

    return res.status(200).json(Array.from(childrenMap.values()));
  } catch (error) {
    next(error);
  }
}

/**
 * Get unified child dashboard details
 */
export async function getChildDashboard(req: Request, res: Response, next: NextFunction) {
  try {
    const parentUserId = req.user?.userId;
    const { studentId } = req.params;

    if (!parentUserId) {
      return res.status(401).json({ message: 'User context missing.' });
    }

    const parent = await prisma.parent.findUnique({
      where: { userId: parentUserId },
      include: {
        students: { select: { id: true } },
        relations: { select: { studentId: true } },
      },
    });

    if (!parent) {
      return res.status(404).json({ message: 'Parent profile not found.' });
    }

    const ownedStudentIds = new Set<string>([
      ...parent.students.map((s) => s.id),
      ...parent.relations.map((r) => r.studentId),
    ]);

    if (!ownedStudentIds.has(studentId)) {
      return res.status(403).json({ message: 'Access denied. Student is not linked to your parent account.' });
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: { select: { name: true, email: true, profileImage: true, phone: true } },
        studentClass: {
          include: {
            timetables: {
              where: { isDeleted: false },
              include: {
                subject: { select: { name: true, code: true } },
                teacher: { include: { user: { select: { name: true } } } },
              },
            },
          },
        },
        attendance: {
          orderBy: { date: 'desc' },
          take: 30,
        },
        marks: {
          include: {
            exam: { include: { subject: { select: { name: true } } } },
          },
        },
        payments: {
          include: { fee: true },
          orderBy: { createdAt: 'desc' },
        },
        homeworkSubmissions: {
          include: {
            homework: {
              include: {
                subject: { select: { name: true } },
                teacher: { include: { user: { select: { name: true } } } },
              },
            },
          },
        },
      },
    });

    if (!student) {
      return res.status(404).json({ message: 'Student records not found.' });
    }

    const totalAttendanceDays = await prisma.attendance.count({ where: { studentId } });
    const presentDays = await prisma.attendance.count({
      where: { studentId, status: 'PRESENT' },
    });
    const attendancePercentage = totalAttendanceDays > 0 ? Math.round((presentDays / totalAttendanceDays) * 100) : 100;

    const fees = await prisma.fee.findMany({
      where: { classId: student.classId },
      include: {
        payments: { where: { studentId } },
      },
    });

    const pendingFees = fees.filter((f) => f.payments.length === 0);

    const homeworkList = await prisma.homework.findMany({
      where: { classId: student.classId, isDeleted: false },
      include: {
        subject: { select: { name: true } },
        teacher: { include: { user: { select: { name: true } } } },
        submissions: { where: { studentId } },
      },
      orderBy: { dueDate: 'asc' },
    });

    return res.status(200).json({
      profile: {
        id: student.id,
        rollNumber: student.rollNumber,
        admissionNumber: student.admissionNumber,
        name: student.user.name,
        email: student.user.email,
        phone: student.user.phone,
        profileImage: student.user.profileImage,
        className: `${student.studentClass.name}-${student.studentClass.section}`,
        gender: student.gender,
        dateOfBirth: student.dateOfBirth,
        bloodGroup: student.bloodGroup,
      },
      attendance: {
        percentage: attendancePercentage,
        totalDays: totalAttendanceDays,
        presentDays,
        logs: student.attendance,
      },
      grades: student.marks.map((m) => ({
        id: m.id,
        examName: m.exam.name,
        subjectName: m.exam.subject.name,
        marksObtained: m.marksObtained,
        maxMarks: m.exam.maxMarks,
        remarks: m.remarks,
        date: m.exam.date,
      })),
      fees: {
        paid: student.payments,
        pending: pendingFees.map((f) => ({
          id: f.id,
          title: f.title,
          amount: f.amount,
          dueDate: f.dueDate,
        })),
      },
      timetable: student.studentClass.timetables.map((t) => ({
        id: t.id,
        dayOfWeek: t.dayOfWeek,
        startTime: t.startTime,
        endTime: t.endTime,
        roomNumber: t.roomNumber,
        subjectName: t.subject.name,
        teacherName: t.teacher.user.name,
      })),
      homework: homeworkList.map((h) => ({
        id: h.id,
        title: h.title,
        description: h.description,
        dueDate: h.dueDate,
        subjectName: h.subject.name,
        teacherName: h.teacher.user.name,
        submission: h.submissions[0] || null,
      })),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * CRUD: Get all parents
 */
export async function getAllParents(req: Request, res: Response, next: NextFunction) {
  try {
    const parents = await prisma.parent.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
            address: true,
            profileImage: true,
            isActive: true
          }
        },
        students: {
          select: {
            id: true,
            rollNumber: true,
            user: { select: { name: true } }
          }
        }
      }
    });
    return res.status(200).json(parents);
  } catch (error) {
    next(error);
  }
}

/**
 * CRUD: Get parent by ID
 */
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
            isActive: true
          }
        },
        students: {
          select: {
            id: true,
            rollNumber: true,
            user: { select: { name: true } }
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

/**
 * CRUD: Create a Parent
 */
export async function createParent(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, name, phone, address, occupation, relation, studentIds } = req.body;

    if (!email || !password || !name || !relation) {
      return res.status(400).json({ message: 'Email, password, name, and relation are required.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use.' });
    }

    const passwordHash = await hashPassword(password);
    const schoolId = req.user?.schoolId;

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          name,
          role: 'PARENT',
          phone,
          address,
          schoolId
        }
      });

      const parent = await tx.parent.create({
        data: {
          userId: user.id,
          occupation,
          relation
        }
      });

      // Link students if specified
      if (Array.isArray(studentIds) && studentIds.length > 0) {
        await Promise.all(
          studentIds.map(async (studentId) => {
            // Update Student parentId
            await tx.student.update({
              where: { id: studentId },
              data: { parentId: parent.id }
            });

            // Create junction relation record
            await tx.parentStudentRelation.create({
              data: {
                parentId: parent.id,
                studentId,
                relation
              }
            });
          })
        );
      }

      return parent;
    });

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * CRUD: Update a Parent
 */
export async function updateParent(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { name, phone, address, occupation, relation, isActive, studentIds } = req.body;

    const parent = await prisma.parent.findUnique({ where: { id } });
    if (!parent) {
      return res.status(404).json({ message: 'Parent profile not found.' });
    }

    const result = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: parent.userId },
        data: {
          name,
          phone,
          address,
          isActive: isActive !== undefined ? isActive : undefined
        }
      });

      const updatedParent = await tx.parent.update({
        where: { id },
        data: {
          occupation,
          relation
        }
      });

      // Update student relations if provided
      if (Array.isArray(studentIds)) {
        // Disconnect old students first
        await tx.student.updateMany({
          where: { parentId: id },
          data: { parentId: null }
        });
        await tx.parentStudentRelation.deleteMany({
          where: { parentId: id }
        });

        // Link new students
        await Promise.all(
          studentIds.map(async (studentId) => {
            await tx.student.update({
              where: { id: studentId },
              data: { parentId: id }
            });

            await tx.parentStudentRelation.create({
              data: {
                parentId: id,
                studentId,
                relation: relation || 'GUARDIAN'
              }
            });
          })
        );
      }

      return updatedParent;
    });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * CRUD: Delete Parent
 */
export async function deleteParent(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const parent = await prisma.parent.findUnique({ where: { id } });
    if (!parent) {
      return res.status(404).json({ message: 'Parent not found.' });
    }

    await prisma.$transaction(async (tx) => {
      // Remove relations first
      await tx.student.updateMany({
        where: { parentId: id },
        data: { parentId: null }
      });

      await tx.parent.delete({ where: { id } });
      await tx.user.delete({ where: { id: parent.userId } });
    });

    return res.status(200).json({ message: 'Parent deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
