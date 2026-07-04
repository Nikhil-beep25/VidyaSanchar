import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';

export async function createExam(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, type, date, maxMarks, passingMarks, subjectId } = req.body;
    if (!name || !type || !date || !maxMarks || !passingMarks || !subjectId) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const exam = await prisma.exam.create({
      data: {
        name,
        type,
        date: new Date(date),
        maxMarks: parseFloat(maxMarks),
        passingMarks: parseFloat(passingMarks),
        subjectId,
      }
    });

    return res.status(201).json(exam);
  } catch (error) {
    next(error);
  }
}

export async function getAllExams(req: Request, res: Response, next: NextFunction) {
  try {
    const exams = await prisma.exam.findMany({
      include: {
        subject: {
          select: {
            name: true,
            code: true,
            subjectClass: { select: { name: true, section: true } }
          }
        }
      },
      orderBy: { date: 'desc' }
    });
    return res.status(200).json(exams);
  } catch (error) {
    next(error);
  }
}

export async function enterMarks(req: Request, res: Response, next: NextFunction) {
  try {
    const { examId, records } = req.body; // records: [{ studentId, marksObtained, remarks }]
    if (!examId || !records || !Array.isArray(records)) {
      return res.status(400).json({ message: 'ExamId and records array are required.' });
    }

    const results = [];
    for (const rec of records) {
      const { studentId, marksObtained, remarks } = rec;
      if (!studentId || marksObtained === undefined) continue;

      const existing = await prisma.mark.findFirst({
        where: { studentId, examId }
      });

      let markRecord;
      if (existing) {
        markRecord = await prisma.mark.update({
          where: { id: existing.id },
          data: {
            marksObtained: parseFloat(marksObtained),
            remarks: remarks || null
          }
        });
      } else {
        markRecord = await prisma.mark.create({
          data: {
            studentId,
            examId,
            marksObtained: parseFloat(marksObtained),
            remarks: remarks || null
          }
        });
      }
      results.push(markRecord);
    }

    return res.status(200).json({
      message: 'Marks recorded successfully.',
      count: results.length,
      records: results
    });
  } catch (error) {
    next(error);
  }
}

export async function getStudentReportCard(req: Request, res: Response, next: NextFunction) {
  try {
    const { studentId } = req.params;

    const marks = await prisma.mark.findMany({
      where: { studentId },
      include: {
        exam: {
          include: {
            subject: true
          }
        }
      },
      orderBy: { exam: { date: 'desc' } }
    });

    return res.status(200).json(marks);
  } catch (error) {
    next(error);
  }
}

export async function getExamPerformanceReport(req: Request, res: Response, next: NextFunction) {
  try {
    const { examId } = req.params;

    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: { subject: true }
    });

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found.' });
    }

    const marks = await prisma.mark.findMany({
      where: { examId },
      include: {
        student: {
          include: {
            user: { select: { name: true } }
          }
        }
      }
    });

    if (marks.length === 0) {
      return res.status(200).json({ exam, stats: { count: 0, average: 0, highest: 0, lowest: 0 }, records: [] });
    }

    const scores = marks.map(m => m.marksObtained);
    const count = scores.length;
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);
    const sum = scores.reduce((a, b) => a + b, 0);
    const average = sum / count;

    const passedCount = marks.filter(m => m.marksObtained >= exam.passingMarks).length;
    const failedCount = count - passedCount;

    return res.status(200).json({
      exam,
      stats: {
        count,
        highest,
        lowest,
        average: Math.round(average * 100) / 100,
        passedCount,
        failedCount,
        passPercentage: Math.round((passedCount / count) * 10000) / 100
      },
      records: marks
    });
  } catch (error) {
    next(error);
  }
}
