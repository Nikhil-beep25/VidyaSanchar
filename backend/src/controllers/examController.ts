import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { createAuditLog } from '../utils/audit';

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
      },
      include: {
        subject: true
      }
    });

    await createAuditLog(
      req.user?.userId,
      'EXAM_CREATED',
      `Created new exam assessment: "${exam.name}" for subject "${exam.subject.name}"`,
      req.user?.schoolId
    );

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

    // Query exam name for readability
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: { subject: true }
    });

    await createAuditLog(
      req.user?.userId,
      'MARKS_RECORDED',
      `Recorded marks for ${results.length} students in exam "${exam?.name || 'Exam'}" (${exam?.subject.name || 'Subject'})`,
      req.user?.schoolId
    );

    return res.status(200).json({
      message: 'Marks recorded successfully.',
      count: results.length,
      records: results
    });
  } catch (error) {
    next(error);
  }
}

function getGradeFromPercentage(percentage: number): string {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  if (percentage >= 33) return 'E';
  return 'F';
}

export async function getStudentReportCard(req: Request, res: Response, next: NextFunction) {
  try {
    const { studentId } = req.params;
    const userRole = req.user?.role;

    const whereClause: any = { studentId };
    
    // Students/parents can only see results for published exams
    if (userRole === 'STUDENT' || userRole === 'PARENT') {
      whereClause.exam = { isPublished: true };
    }

    const marks = await prisma.mark.findMany({
      where: whereClause,
      include: {
        exam: {
          include: {
            subject: true
          }
        }
      },
      orderBy: { exam: { date: 'desc' } }
    });

    // Enrich marks with percentages, grades, and ranks
    const enrichedMarks = await Promise.all(marks.map(async (m) => {
      const percentage = m.exam.maxMarks > 0 ? (m.marksObtained / m.exam.maxMarks) * 100 : 0;
      const grade = getGradeFromPercentage(percentage);
      
      // Calculate rank for this specific exam
      const allExamMarks = await prisma.mark.findMany({
        where: { examId: m.examId },
        orderBy: { marksObtained: 'desc' }
      });
      const rankIndex = allExamMarks.findIndex(x => x.studentId === studentId);
      const rank = rankIndex !== -1 ? rankIndex + 1 : 1;
      
      return {
        ...m,
        percentage: Math.round(percentage * 100) / 100,
        grade,
        rank
      };
    }));

    return res.status(200).json(enrichedMarks);
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

export async function updateExam(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { name, type, date, maxMarks, passingMarks, subjectId, isPublished } = req.body;

    const existing = await prisma.exam.findUnique({
      where: { id },
      include: { subject: true }
    });

    if (!existing) {
      return res.status(404).json({ message: 'Exam not found.' });
    }

    const updatedExam = await prisma.exam.update({
      where: { id },
      data: {
        name,
        type,
        date: date ? new Date(date) : undefined,
        maxMarks: maxMarks !== undefined ? parseFloat(maxMarks) : undefined,
        passingMarks: passingMarks !== undefined ? parseFloat(passingMarks) : undefined,
        subjectId,
        isPublished: isPublished !== undefined ? !!isPublished : undefined
      },
      include: {
        subject: true
      }
    });

    await createAuditLog(
      req.user?.userId,
      'EXAM_UPDATED',
      `Updated exam details: "${updatedExam.name}" (${updatedExam.subject.name})`,
      req.user?.schoolId
    );

    return res.status(200).json(updatedExam);
  } catch (error) {
    next(error);
  }
}

export async function deleteExam(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const exam = await prisma.exam.findUnique({
      where: { id },
      include: { subject: true }
    });

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found.' });
    }

    await prisma.exam.delete({
      where: { id }
    });

    await createAuditLog(
      req.user?.userId,
      'EXAM_DELETED',
      `Deleted exam: "${exam.name}" for subject "${exam.subject.name}"`,
      req.user?.schoolId
    );

    return res.status(200).json({ message: 'Exam deleted successfully.' });
  } catch (error) {
    next(error);
  }
}

export async function publishExamResults(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { isPublished } = req.body;

    const exam = await prisma.exam.findUnique({
      where: { id },
      include: { subject: true }
    });

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found.' });
    }

    const updatedExam = await prisma.exam.update({
      where: { id },
      data: {
        isPublished: isPublished !== undefined ? !!isPublished : true
      },
      include: {
        subject: true
      }
    });

    const actionText = updatedExam.isPublished ? 'Published' : 'Unpublished';
    await createAuditLog(
      req.user?.userId,
      'RESULTS_PUBLISHED',
      `${actionText} results for exam: "${exam.name}" (${exam.subject.name})`,
      req.user?.schoolId
    );

    return res.status(200).json(updatedExam);
  } catch (error) {
    next(error);
  }
}
