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
    const userId = req.user?.userId;

    if (!userRole || !userId) {
      return res.status(401).json({ message: 'Role or user not authenticated.' });
    }

    // Return notifications targeting this user's role OR direct targeted notifications for this userId
    const notifications = await prisma.notification.findMany({
      where: {
        OR: [
          { userId },
          {
            AND: [
              { userId: null },
              {
                OR: [
                  { recipientRole: userRole },
                  { isAnnouncement: true }
                ]
              }
            ]
          }
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

export async function markNotificationAsRead(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const notification = await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read successfully.',
      notification
    });
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
