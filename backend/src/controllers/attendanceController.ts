import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { AttendanceStatus } from '@prisma/client';
import { createAuditLog } from '../utils/audit';

export async function recordAttendance(req: Request, res: Response, next: NextFunction) {
  try {
    const { classId, date, records } = req.body; // records: [{ studentId, status: PRESENT/ABSENT/..., remarks }]

    if (!classId || !date || !records || !Array.isArray(records)) {
      return res.status(400).json({ message: 'ClassId, date, and records array are required.' });
    }

    const attendanceDate = new Date(date);
    // Standardize to midnight for exact date comparisons
    attendanceDate.setUTCHours(0, 0, 0, 0);

    const results = [];
    for (const rec of records) {
      const { studentId, status, remarks } = rec;
      if (!studentId || !status) continue;

      // Upsert: check if attendance for this student on this date already exists
      const existing = await prisma.attendance.findFirst({
        where: {
          studentId,
          classId,
          date: attendanceDate,
        }
      });

      let record;
      if (existing) {
        record = await prisma.attendance.update({
          where: { id: existing.id },
          data: {
            status: status as AttendanceStatus,
            remarks: remarks || null
          }
        });
      } else {
        record = await prisma.attendance.create({
          data: {
            studentId,
            classId,
            date: attendanceDate,
            status: status as AttendanceStatus,
            remarks: remarks || null
          }
        });
      }
      results.push(record);
    }

    // Query class name for better audit log readability
    const classroom = await prisma.class.findUnique({
      where: { id: classId },
      select: { name: true, section: true }
    });

    await createAuditLog(
      req.user?.userId,
      'ATTENDANCE_RECORDED',
      `Marked attendance for ${results.length} students in ${classroom?.name || 'Class'}-${classroom?.section || ''} on ${date}`,
      req.user?.schoolId
    );

    return res.status(200).json({
      message: 'Attendance recorded successfully.',
      count: results.length,
      records: results
    });
  } catch (error) {
    next(error);
  }
}

export async function getClassAttendance(req: Request, res: Response, next: NextFunction) {
  try {
    const { classId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Date query parameter is required.' });
    }

    const attendanceDate = new Date(date as string);
    attendanceDate.setUTCHours(0, 0, 0, 0);

    const records = await prisma.attendance.findMany({
      where: {
        classId,
        date: attendanceDate
      },
      include: {
        student: {
          include: {
            user: {
              select: { name: true }
            }
          }
        }
      }
    });

    return res.status(200).json(records);
  } catch (error) {
    next(error);
  }
}

export async function getStudentAttendance(req: Request, res: Response, next: NextFunction) {
  try {
    const { studentId } = req.params;

    const records = await prisma.attendance.findMany({
      where: { studentId },
      orderBy: { date: 'desc' }
    });

    const totalDays = records.length;
    const presentDays = records.filter(r => r.status === AttendanceStatus.PRESENT).length;
    const absentDays = records.filter(r => r.status === AttendanceStatus.ABSENT).length;
    const lateDays = records.filter(r => r.status === AttendanceStatus.LATE).length;
    const excusedDays = records.filter(r => r.status === AttendanceStatus.EXCUSED).length;

    const attendancePercentage = totalDays > 0 ? ((presentDays + lateDays + excusedDays) / totalDays) * 100 : 100;

    return res.status(200).json({
      summary: {
        totalDays,
        presentDays,
        absentDays,
        lateDays,
        excusedDays,
        percentage: Math.round(attendancePercentage * 100) / 100
      },
      records
    });
  } catch (error) {
    next(error);
  }
}
