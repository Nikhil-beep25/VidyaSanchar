import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { RoleType } from '@prisma/client';

export async function createNotification(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, message, recipientRole, isAnnouncement } = req.body;
    const senderId = req.user?.userId;

    if (!title || !message || !recipientRole) {
      return res.status(400).json({ message: 'Title, message, and recipientRole are required.' });
    }

    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        recipientRole: recipientRole as RoleType,
        isAnnouncement: isAnnouncement === undefined ? true : isAnnouncement,
        senderId: senderId || null,
      }
    });

    return res.status(201).json(notification);
  } catch (error) {
    next(error);
  }
}

export async function getNotifications(req: Request, res: Response, next: NextFunction) {
  try {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(401).json({ message: 'Role not authenticated.' });
    }

    // Return notifications targetting this user's role OR targetting all roles
    const notifications = await prisma.notification.findMany({
      where: {
        OR: [
          { recipientRole: userRole },
          { recipientRole: 'STUDENT' } // fallback or general public announcements
        ]
      },
      include: {
        sender: {
          select: { name: true, role: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
}

export async function submitContactForm(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Name, email, subject, and message are required.' });
    }

    const submission = await prisma.contactSubmission.create({
      data: { name, email, phone, subject, message }
    });

    return res.status(201).json({
      message: 'Inquiry submitted successfully.',
      submission
    });
  } catch (error) {
    next(error);
  }
}

export async function getContactSubmissions(req: Request, res: Response, next: NextFunction) {
  try {
    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json(submissions);
  } catch (error) {
    next(error);
  }
}
