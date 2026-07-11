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
      
      const payments = await prisma.payment.findMany({
        where: { status: 'SUCCESS' },
        select: { amountPaid: true }
      });
      const totalFeesCollected = payments.reduce((sum, p) => sum + p.amountPaid, 0);

      // Calculate monthly revenue
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      const monthlyPayments = await prisma.payment.findMany({
        where: {
          status: 'SUCCESS',
          createdAt: { gte: startOfMonth }
        },
        select: { amountPaid: true }
      });
      const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + p.amountPaid, 0);

      // Count failed payment records
      const failedPaymentCount = await prisma.payment.count({
        where: { status: 'FAILED' }
      });

      // Fetch 5 most recent payments
      const recentPayments = await prisma.payment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          student: {
            include: {
              user: { select: { name: true } }
            }
          },
          fee: true
        }
      });

      // Calculate school-wide attendance percentage
      const totalAttendanceCount = await prisma.attendance.count();
      const presentAttendanceCount = await prisma.attendance.count({
        where: {
          status: { in: ['PRESENT', 'LATE', 'EXCUSED'] }
        }
      });
      const totalAttendancePercentage = totalAttendanceCount > 0 
        ? Math.round((presentAttendanceCount / totalAttendanceCount) * 10000) / 100 
        : 100;

      // Calculate total pending fees across all student enrollments
      const classesWithStudentsAndFees = await prisma.class.findMany({
        include: {
          _count: { select: { students: true } },
          fees: { select: { amount: true } }
        }
      });
      let totalAssignedFees = 0;
      classesWithStudentsAndFees.forEach(c => {
        const studentCount = c._count.students;
        const feeSum = c.fees.reduce((sum, f) => sum + f.amount, 0);
        totalAssignedFees += feeSum * studentCount;
      });
      const pendingFees = Math.max(0, totalAssignedFees - totalFeesCollected);

      // Count upcoming exams
      const upcomingExams = await prisma.exam.count({
        where: { date: { gte: new Date() } }
      });

      // Get recent activity logs
      const recentActivities = await prisma.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              role: true
            }
          }
        }
      });

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
          monthlyRevenue,
          failedPaymentCount,
          totalAttendancePercentage,
          pendingFees,
          upcomingExams
        },
        recentPayments,
        recentActivities,
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

/**
 * Advanced analytics aggregators for trends graphs
 */
export async function getAdvancedAnalytics(req: Request, res: Response, next: NextFunction) {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    // 1. Fee collection trends (Last 6 months)
    const payments = await prisma.payment.findMany({
      where: {
        createdAt: { gte: sixMonthsAgo },
        status: 'SUCCESS'
      },
      select: { amountPaid: true, createdAt: true }
    });

    const feeTrends: Record<string, number> = {};
    // Pre-populate last 6 months keys
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      const mLabel = d.toLocaleString('en-US', { month: 'short' });
      feeTrends[mLabel] = 0;
    }

    payments.forEach(p => {
      const monthStr = p.createdAt.toLocaleString('en-US', { month: 'short' });
      if (feeTrends[monthStr] !== undefined) {
        feeTrends[monthStr] += p.amountPaid;
      }
    });

    // 2. Attendance trends (Last 6 months)
    const attendances = await prisma.attendance.findMany({
      where: {
        date: { gte: sixMonthsAgo }
      },
      select: { status: true, date: true }
    });

    const attendanceRate: Record<string, { present: number, total: number }> = {};
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      const mLabel = d.toLocaleString('en-US', { month: 'short' });
      attendanceRate[mLabel] = { present: 0, total: 0 };
    }

    attendances.forEach(a => {
      const monthStr = a.date.toLocaleString('en-US', { month: 'short' });
      if (attendanceRate[monthStr] !== undefined) {
        attendanceRate[monthStr].total += 1;
        if (a.status === 'PRESENT' || a.status === 'LATE' || a.status === 'EXCUSED') {
          attendanceRate[monthStr].present += 1;
        }
      }
    });

    const attendanceTrends = Object.keys(attendanceRate).map(month => {
      const { present, total } = attendanceRate[month];
      return {
        month,
        rate: total > 0 ? Math.round((present / total) * 100) : 100
      };
    });

    const feeCollectionTrends = Object.keys(feeTrends).map(month => ({
      month,
      amount: feeTrends[month]
    }));

    // 3. Student cumulative growth trends (Last 6 months)
    const baseStudentCount = await prisma.student.count({
      where: {
        user: {
          createdAt: { lt: sixMonthsAgo }
        }
      }
    });

    const newStudents = await prisma.student.findMany({
      where: {
        user: {
          createdAt: { gte: sixMonthsAgo }
        }
      },
      select: {
        user: { select: { createdAt: true } }
      },
      orderBy: {
        user: { createdAt: 'asc' }
      }
    });

    const monthlyAdmissions: Record<string, number> = {};
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      const mLabel = d.toLocaleString('en-US', { month: 'short' });
      monthlyAdmissions[mLabel] = 0;
    }

    newStudents.forEach(s => {
      const mLabel = s.user.createdAt.toLocaleString('en-US', { month: 'short' });
      if (monthlyAdmissions[mLabel] !== undefined) {
        monthlyAdmissions[mLabel]++;
      }
    });

    let cumulative = baseStudentCount;
    const studentGrowthTrends = Object.keys(monthlyAdmissions).map(month => {
      cumulative += monthlyAdmissions[month];
      return {
        month,
        count: cumulative
      };
    });

    return res.status(200).json({
      feeCollectionTrends,
      attendanceTrends,
      studentGrowthTrends
    });
  } catch (error) {
    next(error);
  }
}
