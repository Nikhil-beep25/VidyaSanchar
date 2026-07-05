import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';

/**
 * 1. Create Assignment (Teacher / Admin)
 */
export async function createAssignment(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, description, dueDate, classId, subjectId } = req.body;

    if (!title || !dueDate || !classId || !subjectId) {
      return res.status(400).json({ message: 'title, dueDate, classId, and subjectId are required.' });
    }

    const assignment = await prisma.assignment.create({
      data: {
        title,
        description: description || '',
        dueDate: new Date(dueDate),
        classId,
        subjectId,
      }
    });

    return res.status(201).json(assignment);
  } catch (error) {
    next(error);
  }
}

/**
 * 2. Submit Assignment (Student)
 */
export async function submitAssignment(req: Request, res: Response, next: NextFunction) {
  try {
    const { assignmentId } = req.params;
    const { filePath } = req.body;
    const studentId = req.user?.userId; // Wait: is the userId mapped to studentId? We should check the profile!

    if (!studentId) {
      return res.status(401).json({ message: 'Unauthorized. Logged-in student context required.' });
    }

    // Resolve Student ID from User ID
    const student = await prisma.student.findUnique({ where: { userId: studentId } });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found.' });
    }

    const submission = await prisma.assignmentSubmission.create({
      data: {
        assignmentId,
        studentId: student.id,
        filePath: filePath || 'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=120', // standard uploaded file placeholder
        status: 'SUBMITTED',
      }
    });

    return res.status(201).json({
      message: 'Assignment submitted successfully.',
      submission
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 3. Grade Submission (Teacher)
 */
export async function gradeAssignment(req: Request, res: Response, next: NextFunction) {
  try {
    const { submissionId } = req.params;
    const { marksObtained, feedback } = req.body;

    if (marksObtained === undefined) {
      return res.status(400).json({ message: 'marksObtained is required.' });
    }

    const submission = await prisma.assignmentSubmission.update({
      where: { id: submissionId },
      data: {
        marksObtained: parseFloat(marksObtained),
        feedback: feedback || '',
        status: 'GRADED',
      }
    });

    return res.status(200).json({
      message: 'Submission graded successfully.',
      submission
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 4. Get Student Submissions
 */
export async function getStudentSubmissions(req: Request, res: Response, next: NextFunction) {
  try {
    const { studentId } = req.params;

    const submissions = await prisma.assignmentSubmission.findMany({
      where: { studentId },
      include: {
        assignment: {
          include: {
            subject: true
          }
        }
      },
      orderBy: { submissionDate: 'desc' }
    });

    return res.status(200).json(submissions);
  } catch (error) {
    next(error);
  }
}

/**
 * 5. Get Submissions for an Assignment (Teacher / Admin)
 */
export async function getAssignmentSubmissions(req: Request, res: Response, next: NextFunction) {
  try {
    const { assignmentId } = req.params;

    const submissions = await prisma.assignmentSubmission.findMany({
      where: { assignmentId },
      include: {
        student: {
          include: {
            user: { select: { name: true } }
          }
        }
      },
      orderBy: { submissionDate: 'desc' }
    });

    return res.status(200).json(submissions);
  } catch (error) {
    next(error);
  }
}
