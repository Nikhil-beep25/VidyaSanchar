import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { PaymentStatus } from '@prisma/client';

export async function createFee(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, amount, dueDate, classId } = req.body;
    if (!title || !amount || !dueDate || !classId) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const fee = await prisma.fee.create({
      data: {
        title,
        amount: parseFloat(amount),
        dueDate: new Date(dueDate),
        classId,
      }
    });

    return res.status(201).json(fee);
  } catch (error) {
    next(error);
  }
}

export async function getAllFees(req: Request, res: Response, next: NextFunction) {
  try {
    const fees = await prisma.fee.findMany({
      include: {
        feeClass: true
      },
      orderBy: { dueDate: 'asc' }
    });
    return res.status(200).json(fees);
  } catch (error) {
    next(error);
  }
}

export async function getStudentFeeLedger(req: Request, res: Response, next: NextFunction) {
  try {
    const { studentId } = req.params;

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { classId: true }
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    // Get all fees assigned to the student's class
    const fees = await prisma.fee.findMany({
      where: { classId: student.classId },
      include: {
        payments: {
          where: { studentId }
        }
      },
      orderBy: { dueDate: 'asc' }
    });

    // Format ledger
    const ledger = fees.map(f => {
      const paidAmount = f.payments.reduce((sum, p) => sum + p.amountPaid, 0);
      const balance = f.amount - paidAmount;
      let status: PaymentStatus = PaymentStatus.UNPAID;

      if (paidAmount >= f.amount) {
        status = PaymentStatus.PAID;
      } else if (paidAmount > 0) {
        status = PaymentStatus.PARTIAL;
      }

      return {
        id: f.id,
        title: f.title,
        totalAmount: f.amount,
        dueDate: f.dueDate,
        paidAmount,
        balance,
        status,
        payments: f.payments
      };
    });

    return res.status(200).json(ledger);
  } catch (error) {
    next(error);
  }
}

export async function recordPayment(req: Request, res: Response, next: NextFunction) {
  try {
    const { feeId, studentId, amountPaid, paymentMethod } = req.body;

    if (!feeId || !studentId || !amountPaid || !paymentMethod) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const fee = await prisma.fee.findUnique({ where: { id: feeId } });
    if (!fee) {
      return res.status(404).json({ message: 'Fee structure not found.' });
    }

    const previousPayments = await prisma.payment.findMany({
      where: { feeId, studentId }
    });
    const totalPaidBefore = previousPayments.reduce((sum, p) => sum + p.amountPaid, 0);

    const newPaymentAmount = parseFloat(amountPaid);
    const newTotalPaid = totalPaidBefore + newPaymentAmount;

    let status: PaymentStatus = PaymentStatus.PAID;
    if (newTotalPaid < fee.amount) {
      status = PaymentStatus.PARTIAL;
    }

    const receiptNumber = `REC-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const payment = await prisma.payment.create({
      data: {
        feeId,
        studentId,
        amountPaid: newPaymentAmount,
        paymentMethod,
        status,
        receiptNumber,
      },
      include: {
        fee: true,
        student: {
          include: {
            user: { select: { name: true } }
          }
        }
      }
    });

    return res.status(201).json({
      message: 'Payment recorded successfully.',
      payment
    });
  } catch (error) {
    next(error);
  }
}
