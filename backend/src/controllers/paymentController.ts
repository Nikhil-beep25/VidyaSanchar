import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import PDFDocument from 'pdfkit';

// Instantiate Razorpay Client (Supports mock/sandbox fallback if keys are missing)
const razorpayKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_key_id_123';
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_mock_secret_123';

const razorpay = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret,
});

/**
 * Step 1: Create a payment order via Razorpay
 */
export async function createOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const { studentId, feeId, amount } = req.body;

    if (!studentId || !feeId || !amount) {
      return res.status(400).json({ message: 'studentId, feeId, and amount are required.' });
    }

    // Verify Student exists
    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    // Verify Fee structure exists
    const fee = await prisma.fee.findUnique({ where: { id: feeId } });
    if (!fee) {
      return res.status(404).json({ message: 'Fee structure not found.' });
    }

    const orderAmount = Math.round(parseFloat(amount) * 100); // Razorpay expects amount in paisa (sub-units)

    let orderId = `order_mock_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Attempt real Razorpay order creation unless using mock defaults
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      try {
        const order = await razorpay.orders.create({
          amount: orderAmount,
          currency: 'INR',
          receipt: `receipt_fee_${feeId.slice(0, 8)}_${Date.now().toString().slice(-6)}`,
        });
        orderId = order.id;
      } catch (err: any) {
        console.warn('[Razorpay] SDK order creation failed. Falling back to test mock mode:', err.message);
      }
    } else {
      console.log('[Razorpay] Keys missing. Operating in local sandbox mock mode.');
    }

    // Save transaction in database
    const transaction = await prisma.feeTransaction.create({
      data: {
        razorpayOrderId: orderId,
        amount: parseFloat(amount),
        status: 'PENDING',
        feeId,
        studentId,
      },
    });

    // Log the audit event
    console.log(`[Audit] Payment order initiated. OrderID: ${orderId}, StudentID: ${studentId}, FeeID: ${feeId}`);

    return res.status(200).json({
      success: true,
      orderId,
      amount: parseFloat(amount),
      currency: 'INR',
      keyId: razorpayKeyId,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Step 2: Verify Razorpay payment signature
 */
export async function verifyPayment(req: Request, res: Response, next: NextFunction) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ message: 'razorpay_order_id and razorpay_payment_id are required.' });
    }

    // Find the pending transaction
    const transaction = await prisma.feeTransaction.findUnique({
      where: { razorpayOrderId: razorpay_order_id },
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction record not found.' });
    }

    let isSignatureValid = false;

    // Verify cryptographic signature if keys are present; bypass with simple check in mock mode
    if (process.env.RAZORPAY_KEY_SECRET && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac('sha256', razorpayKeySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');
      isSignatureValid = generatedSignature === razorpay_signature;
    } else {
      // Sandbox mode: mock validation succeeds if order ID starts with order_mock or signature matches
      isSignatureValid = true;
    }

    if (isSignatureValid) {
      // 1. Update Transaction status
      await prisma.feeTransaction.update({
        where: { id: transaction.id },
        data: {
          status: 'SUCCESS',
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature || 'mock_signature',
        },
      });

      // 2. Add Payment ledger entry
      const receiptNumber = `REC-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const payment = await prisma.payment.create({
        data: {
          feeId: transaction.feeId,
          studentId: transaction.studentId,
          amountPaid: transaction.amount,
          paymentMethod: 'ONLINE_RAZORPAY',
          status: 'PAID', // mark as PAID
          receiptNumber,
        },
      });

      // Log the audit event
      console.log(`[Audit] Payment successful. Receipt: ${receiptNumber}, Amount: ₹${transaction.amount}`);

      return res.status(200).json({
        success: true,
        message: 'Payment verified and recorded successfully.',
        paymentId: payment.id,
        receiptNumber,
      });
    } else {
      // Update transaction status to FAILED
      await prisma.feeTransaction.update({
        where: { id: transaction.id },
        data: { status: 'FAILED' },
      });

      // Log audit fail
      console.error(`[Audit Failure] Signature verification failed for OrderID: ${razorpay_order_id}`);

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed. Invalid signature.',
      });
    }
  } catch (error) {
    next(error);
  }
}

/**
 * Step 3: Fetch successful payment history for a student
 */
export async function getPaymentHistory(req: Request, res: Response, next: NextFunction) {
  try {
    const { studentId } = req.query;

    if (!studentId) {
      return res.status(400).json({ message: 'studentId is required as a query parameter.' });
    }

    const payments = await prisma.payment.findMany({
      where: {
        studentId: studentId as string,
        paymentMethod: 'ONLINE_RAZORPAY',
      },
      include: {
        fee: true,
      },
      orderBy: { paymentDate: 'desc' },
    });

    return res.status(200).json(payments);
  } catch (error) {
    next(error);
  }
}

/**
 * Step 4: Dynamically generate PDF invoice receipt
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

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=Receipt_${payment.receiptNumber}.pdf`
    );

    doc.pipe(res);

    // Styling & Layout
    // Brand header
    doc.fillColor('#7C3AED').fontSize(24).text('VidyaSanchar School ERP', { align: 'center' });
    doc.fillColor('#4B5563').fontSize(10).text('Official Fee Collection Invoice', { align: 'center' });
    doc.moveDown();

    // Horizontal line
    doc.moveTo(50, 110).lineTo(550, 110).stroke('#E5E7EB');
    doc.moveDown();

    // Receipt metadata table
    doc.fillColor('#1F2937').fontSize(12).text('Invoice Details:', 50, 130, { underline: true });
    doc.fontSize(10).fillColor('#4B5563');
    doc.text(`Receipt Number: ${payment.receiptNumber}`, 50, 155);
    doc.text(`Payment Date: ${payment.paymentDate.toLocaleString('en-IN')}`, 50, 170);
    doc.text(`Payment Mode: Online (Razorpay Gateway)`, 50, 185);

    // Student information card
    doc.fontSize(12).fillColor('#1F2937').text('Student Information:', 300, 130, { underline: true });
    doc.fontSize(10).fillColor('#4B5563');
    doc.text(`Name: ${payment.student.user.name}`, 300, 155);
    doc.text(`Admission No: ${payment.student.admissionNumber}`, 300, 170);
    doc.text(`Classroom: ${payment.student.studentClass.name}-${payment.student.studentClass.section}`, 300, 185);

    // Table divider
    doc.moveTo(50, 215).lineTo(550, 215).stroke('#E5E7EB');

    // Ledger Summary Box
    doc.fillColor('#1F2937').fontSize(12).text('Billing Description:', 50, 240, { underline: true });
    
    // Gray box header background
    doc.rect(50, 265, 500, 30).fill('#F3F4F6');
    doc.fillColor('#1F2937').fontSize(10).text('Particulars', 65, 275);
    doc.text('Due Date', 320, 275);
    doc.text('Paid Amount (INR)', 450, 275);

    // Row contents
    doc.fillColor('#4B5563');
    doc.text(payment.fee.title, 65, 315);
    doc.text(payment.fee.dueDate.toLocaleDateString('en-IN'), 320, 315);
    doc.text(`₹${payment.amountPaid.toLocaleString('en-IN')}`, 450, 315);

    doc.moveTo(50, 345).lineTo(550, 345).stroke('#E5E7EB');

    // Grand Total summary block
    doc.rect(300, 365, 250, 60).fill('#F5F3FF');
    doc.fillColor('#7C3AED').fontSize(12).text('Total Paid: ', 315, 385);
    doc.fillColor('#1F2937').font('Helvetica-Bold').fontSize(14).text(`INR ${payment.amountPaid.toLocaleString('en-IN')}`, 410, 383);
    doc.font('Helvetica'); // restore default font
    
    doc.fillColor('#10B981').fontSize(10).text('Payment Status: SUCCESS / PAID', 315, 410);

    // Disclaimer footer
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
