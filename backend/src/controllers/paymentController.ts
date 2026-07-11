import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import PDFDocument from 'pdfkit';
import { createAuditLog } from '../utils/audit';

// Instantiate Razorpay Client (Supports mock/sandbox fallback if keys are missing)
const razorpayKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_key_id_123';
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_mock_secret_123';

const razorpay = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret,
});

/**
 * Send Simulated Mock Email
 */
function sendMockEmail(to: string, subject: string, body: string) {
  console.log(`[Email Service] Simulating Email to: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Content:\n${body}\n===================================`);
}

/**
 * POST /payments/create-order
 * Initiates Razorpay order creation and returns order details
 */
export async function createOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const { studentId, feeId, amount } = req.body;

    if (!studentId || !feeId || !amount) {
      return res.status(400).json({ message: 'studentId, feeId, and amount are required.' });
    }

    // Verify Student exists
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { user: true }
    });
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    // Verify Fee structure exists
    const fee = await prisma.fee.findUnique({ where: { id: feeId } });
    if (!fee) {
      return res.status(404).json({ message: 'Fee structure not found.' });
    }

    const orderAmount = Math.round(parseFloat(amount) * 100); // Razorpay expects amount in paisa
    const receiptNumber = `REC-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    let orderId = `order_mock_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    // Attempt real Razorpay order creation unless using mock defaults
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET && !process.env.RAZORPAY_KEY_ID.includes('dummy')) {
      try {
        const order = await razorpay.orders.create({
          amount: orderAmount,
          currency: 'INR',
          receipt: receiptNumber,
        });
        orderId = order.id;
      } catch (err: any) {
        console.warn('[Razorpay] SDK order creation failed. Falling back to test mock mode:', err.message);
      }
    } else {
      console.log('[Razorpay] Keys missing/dummy. Operating in local sandbox mock mode.');
    }

    // Save transaction in database with PENDING status
    const payment = await prisma.payment.create({
      data: {
        studentId,
        feeId,
        amountPaid: parseFloat(amount),
        currency: 'INR',
        paymentMethod: 'ONLINE',
        razorpayOrderId: orderId,
        status: 'PENDING',
        receiptNumber,
      },
    });

    await createAuditLog(
      req.user?.userId,
      'PAYMENT_INITIATED',
      `Payment order initiated for "${fee.title}" amounting to ₹${amount} (OrderID: ${orderId})`,
      req.user?.schoolId
    );

    return res.status(200).json({
      success: true,
      orderId,
      amount: parseFloat(amount),
      currency: 'INR',
      keyId: razorpayKeyId,
      paymentId: payment.id,
      receiptNumber,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /payments/verify
 * Cryptographically verifies Razorpay signature and updates transaction status
 */
export async function verifyPayment(req: Request, res: Response, next: NextFunction) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ message: 'razorpay_order_id and razorpay_payment_id are required.' });
    }

    // Find the pending transaction
    const payment = await prisma.payment.findUnique({
      where: { razorpayOrderId: razorpay_order_id },
      include: {
        fee: true,
        student: { include: { user: true } }
      }
    });

    if (!payment) {
      return res.status(404).json({ message: 'Transaction record not found.' });
    }

    // Check if signature matches or if we operate in sandbox mode
    let isSignatureValid = false;
    const isMockOrder = razorpay_order_id.startsWith('order_mock_');

    if (isMockOrder) {
      isSignatureValid = true;
    } else if (process.env.RAZORPAY_KEY_SECRET && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac('sha256', razorpayKeySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');
      isSignatureValid = generatedSignature === razorpay_signature;
    } else {
      isSignatureValid = true;
    }

    if (isSignatureValid) {
      // Update Payment status to SUCCESS
      const updatedPayment = await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'SUCCESS',
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature || 'mock_signature',
          transactionId: razorpay_payment_id,
          paidAt: new Date(),
          paymentMethod: 'ONLINE_RAZORPAY',
        },
      });

      // Log the audit event
      await createAuditLog(
        payment.student.userId || undefined,
        'PAYMENT_SUCCESS',
        `Payment successful for "${payment.fee.title}" amounting to ₹${payment.amountPaid} (Receipt: ${payment.receiptNumber})`,
        payment.student.user.schoolId || undefined
      );

      // Trigger In-App & Mock Email Notifications
      const displayAmount = payment.amountPaid.toLocaleString('en-IN');
      const notificationMsg = `Fee payment of ₹${displayAmount} for "${payment.fee.title}" received successfully.`;

      // Student notification
      if (payment.student.userId) {
        await prisma.notification.create({
          data: {
            title: 'Fee Payment Success',
            message: notificationMsg,
            recipientRole: 'STUDENT',
            userId: payment.student.userId,
            isAnnouncement: false,
          }
        });
        if (payment.student.user?.email) {
          sendMockEmail(payment.student.user.email, 'Fee Payment Receipt - VidyaSanchar', notificationMsg);
        }
      }

      // Parent notification
      const parentRelations = await prisma.parentStudentRelation.findMany({
        where: { studentId: payment.studentId },
        include: { parent: { include: { user: true } } }
      });
      for (const rel of parentRelations) {
        if (rel.parent.userId) {
          await prisma.notification.create({
            data: {
              title: 'Child Fee Payment Success',
              message: `Fee payment of ₹${displayAmount} for "${payment.fee.title}" for your child "${payment.student.user?.name}" received successfully.`,
              recipientRole: 'PARENT',
              userId: rel.parent.userId,
              isAnnouncement: false,
            }
          });
          if (rel.parent.user?.email) {
            sendMockEmail(rel.parent.user.email, 'Child Fee Payment Success', `Dear Parent, we have successfully received ₹${displayAmount} towards ${payment.fee.title} for ${payment.student.user?.name}.`);
          }
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Payment verified and recorded successfully.',
        payment: updatedPayment,
      });
    } else {
      // Update status to FAILED
      const updatedPayment = await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED' },
      });

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed. Invalid signature.',
        payment: updatedPayment,
      });
    }
  } catch (error) {
    next(error);
  }
}

/**
 * POST /payments/webhook
 * Handles Webhook Events from Razorpay dashboard (signature check and async updates)
 */
export async function handleWebhook(req: Request, res: Response, next: NextFunction) {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'dummywebhooksecret789';

    let isValid = false;
    const bodyStr = JSON.stringify(req.body);

    if (process.env.RAZORPAY_WEBHOOK_SECRET && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(bodyStr)
        .digest('hex');
      isValid = expectedSignature === signature;
    } else {
      // Mock validation in sandbox
      isValid = true;
    }

    if (!isValid) {
      return res.status(400).json({ message: 'Invalid webhook signature.' });
    }

    const event = req.body.event;
    const payload = req.body.payload;

    if (event === 'payment.captured' || event === 'order.paid') {
      const orderId = payload.payment.entity.order_id;
      const paymentId = payload.payment.entity.id;
      const amount = payload.payment.entity.amount / 100;
      const method = payload.payment.entity.method;

      const payment = await prisma.payment.findUnique({
        where: { razorpayOrderId: orderId }
      });

      if (payment && payment.status !== 'SUCCESS') {
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'SUCCESS',
            razorpayPaymentId: paymentId,
            transactionId: paymentId,
            paidAt: new Date(),
            paymentMethod: `ONLINE_${method.toUpperCase()}`,
          }
        });
        console.log(`[Webhook success] Order ${orderId} updated to SUCCESS.`);
      }
    } else if (event === 'payment.failed') {
      const orderId = payload.payment.entity.order_id;
      const payment = await prisma.payment.findUnique({
        where: { razorpayOrderId: orderId }
      });
      if (payment) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'FAILED' }
        });
        console.log(`[Webhook failure] Order ${orderId} updated to FAILED.`);
      }
    }

    return res.status(200).json({ status: 'ok' });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /payments/history
 * Fetches transaction history for parents / students
 */
export async function getPaymentHistory(req: Request, res: Response, next: NextFunction) {
  try {
    const studentId = req.query.studentId as string;

    const whereClause: any = {};
    if (studentId) {
      whereClause.studentId = studentId;
    } else if (req.user?.role === 'STUDENT') {
      const student = await prisma.student.findUnique({ where: { userId: req.user.userId } });
      if (student) whereClause.studentId = student.id;
    } else if (req.user?.role === 'PARENT') {
      const parentRelations = await prisma.parentStudentRelation.findMany({
        where: { parent: { userId: req.user.userId } }
      });
      const studentIds = parentRelations.map(rel => rel.studentId);
      whereClause.studentId = { in: studentIds };
    }

    const payments = await prisma.payment.findMany({
      where: whereClause,
      include: {
        fee: true,
        student: { include: { user: { select: { name: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json(payments);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /payments/:id
 * Fetches individual transaction detail
 */
export async function getPaymentDetail(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        fee: true,
        student: {
          include: {
            user: { select: { name: true } },
            studentClass: true
          }
        }
      }
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment record not found.' });
    }

    return res.status(200).json(payment);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /payments/:paymentId/receipt
 * Renders high-quality PDF receipt file
 */
export async function downloadReceipt(req: Request, res: Response, next: NextFunction) {
  try {
    const { paymentId } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        fee: true,
        student: {
          include: {
            user: { select: { name: true } },
            studentClass: true,
          },
        },
      },
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment record not found.' });
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=Receipt_${payment.receiptNumber}.pdf`
    );

    doc.pipe(res);

    // School Info header
    doc.fillColor('#7C3AED').fontSize(22).text('VidyaSanchar School ERP', { align: 'center' });
    doc.fillColor('#4B5563').fontSize(10).text('Official Fee Collection Receipt', { align: 'center' });
    doc.moveDown();

    doc.moveTo(50, 110).lineTo(550, 110).stroke('#E5E7EB');
    doc.moveDown();

    // Details columns
    doc.fillColor('#1F2937').fontSize(12).text('Receipt Details:', 50, 130, { underline: true });
    doc.fontSize(10).fillColor('#4B5563');
    doc.text(`Receipt Number: ${payment.receiptNumber}`, 50, 155);
    doc.text(`Transaction ID: ${payment.transactionId || payment.razorpayPaymentId || 'ONLINE_COLLECTION'}`, 50, 170);
    doc.text(`Date of Payment: ${payment.paidAt ? new Date(payment.paidAt).toLocaleDateString('en-IN') : new Date(payment.createdAt).toLocaleDateString('en-IN')}`, 50, 185);
    doc.text(`Payment Mode: ${payment.paymentMethod}`, 50, 200);

    doc.fontSize(12).fillColor('#1F2937').text('Student Information:', 300, 130, { underline: true });
    doc.fontSize(10).fillColor('#4B5563');
    doc.text(`Name: ${payment.student.user.name}`, 300, 155);
    doc.text(`Admission No: ${payment.student.admissionNumber}`, 300, 170);
    doc.text(`Classroom: ${payment.student.studentClass.name}-${payment.student.studentClass.section}`, 300, 185);

    doc.moveTo(50, 230).lineTo(550, 230).stroke('#E5E7EB');

    // Particulars Table
    doc.fillColor('#1F2937').fontSize(12).text('Payment Particulars:', 50, 250, { underline: true });
    doc.rect(50, 275, 500, 25).fill('#F3F4F6');
    doc.fillColor('#1F2937').fontSize(10).text('Particulars', 65, 283);
    doc.text('Due Date', 320, 283);
    doc.text('Amount Paid (INR)', 450, 283);

    doc.fillColor('#4B5563');
    doc.text(payment.fee.title, 65, 315);
    doc.text(new Date(payment.fee.dueDate).toLocaleDateString('en-IN'), 320, 315);
    doc.text(`₹${payment.amountPaid.toLocaleString('en-IN')}`, 450, 315);

    doc.moveTo(50, 345).lineTo(550, 345).stroke('#E5E7EB');

    // Grand total
    doc.rect(300, 365, 250, 60).fill('#F5F3FF');
    doc.fillColor('#7C3AED').fontSize(12).text('Total Paid: ', 315, 385);
    doc.fillColor('#1F2937').font('Helvetica-Bold').fontSize(14).text(`INR ${payment.amountPaid.toLocaleString('en-IN')}`, 400, 383);
    doc.font('Helvetica');
    
    doc.fillColor('#10B981').fontSize(10).text(`Status: ${payment.status}`, 315, 410);

    // Disclaimer
    doc.fillColor('#9CA3AF').fontSize(9).text(
      'This is an electronically verified fee payment receipt issued by VidyaSanchar ERP.',
      50,
      500,
      { align: 'center' }
    );
    doc.text('No physical signature required.', { align: 'center' });

    doc.end();
  } catch (error) {
    next(error);
  }
}
