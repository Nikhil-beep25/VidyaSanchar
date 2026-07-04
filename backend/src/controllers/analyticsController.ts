import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';

export async function getDashboardSummary(req: Request, res: Response, next: NextFunction) {
  try {
    const userRole = req.user?.role;
    const userId = req.user?.userId;

    if (!userRole || !userId) {
      return res.status(401).json({ message: 'Unauthorized. Missing token context.' });
    }

    if (userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') {
      const studentCount = await prisma.student.count();
      const teacherCount = await prisma.teacher.count();
      const parentCount = await prisma.parent.count();
      const classCount = await prisma.class.count();
      const bookCount = await prisma.libraryBook.count();
      
      const payments = await prisma.payment.findMany({ select: { amountPaid: true } });
      const totalFeesCollected = payments.reduce((sum, p) => sum + p.amountPaid, 0);

      const recentAnnouncements = await prisma.notification.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
      });

      return res.status(200).json({
        role: userRole,
        stats: {
          studentCount,
          teacherCount,
          parentCount,
          classCount,
          bookCount,
          totalFeesCollected,
        },
        recentAnnouncements
      });
    }

    if (userRole === 'TEACHER') {
      const teacher = await prisma.teacher.findUnique({ where: { userId } });
      if (!teacher) {
        return res.status(404).json({ message: 'Teacher profile not found.' });
      }

      const assignedClasses = await prisma.class.findMany({
        where: { classTeacherId: teacher.id },
        select: { id: true, name: true, section: true }
      });

      const subjectsTaught = await prisma.subject.findMany({
        where: { teacherId: teacher.id },
        select: { id: true, name: true, classId: true }
      });

      const examCount = await prisma.exam.count({
        where: {
          subject: { teacherId: teacher.id }
        }
      });

      return res.status(200).json({
        role: userRole,
        stats: {
          assignedClassesCount: assignedClasses.length,
          subjectsCount: subjectsTaught.length,
          examsCreated: examCount,
        },
        assignedClasses,
        subjectsTaught
      });
    }

    if (userRole === 'STUDENT') {
      const student = await prisma.student.findUnique({
        where: { userId },
        include: {
          attendance: true,
          studentClass: true
        }
      });

      if (!student) {
        return res.status(404).json({ message: 'Student profile not found.' });
      }

      const attendanceCount = student.attendance.length;
      const presentCount = student.attendance.filter(a => a.status === 'PRESENT').length;
      const attendancePercentage = attendanceCount > 0 ? (presentCount / attendanceCount) * 100 : 100;

      // Fees due vs paid
      const classFees = await prisma.fee.findMany({ where: { classId: student.classId } });
      const studentPayments = await prisma.payment.findMany({ where: { studentId: student.id } });

      const totalFeeAmount = classFees.reduce((sum, f) => sum + f.amount, 0);
      const paidAmount = studentPayments.reduce((sum, p) => sum + p.amountPaid, 0);
      const outstandingBalance = totalFeeAmount - paidAmount;

      const marks = await prisma.mark.findMany({
        where: { studentId: student.id },
        select: { marksObtained: true }
      });
      const avgGrade = marks.length > 0 ? marks.reduce((sum, m) => sum + m.marksObtained, 0) / marks.length : 0;

      return res.status(200).json({
        role: userRole,
        stats: {
          attendancePercentage: Math.round(attendancePercentage * 10) / 10,
          outstandingBalance,
          paidAmount,
          averageScore: Math.round(avgGrade * 10) / 10
        },
        studentClass: student.studentClass
      });
    }

    if (userRole === 'PARENT') {
      const parent = await prisma.parent.findUnique({
        where: { userId },
        include: {
          students: {
            include: {
              user: { select: { name: true } },
              studentClass: true
            }
          }
        }
      });

      if (!parent) {
        return res.status(404).json({ message: 'Parent profile not found.' });
      }

      return res.status(200).json({
        role: userRole,
        children: parent.students
      });
    }

    return res.status(400).json({ message: 'Dashboard summary not available for this role.' });
  } catch (error) {
    next(error);
  }
}
