import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';

/**
 * Submit contact form from Landing Page
 */
export async function submitContactForm(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, subject, and message are required.' });
    }

    const submission = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject,
        message
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Contact message received successfully. Our team will get back to you shortly.',
      data: submission
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get all contact form submissions (Admin only)
 */
export async function getContactSubmissions(req: Request, res: Response, next: NextFunction) {
  try {
    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({
      success: true,
      data: submissions
    });
  } catch (error) {
    next(error);
  }
}
