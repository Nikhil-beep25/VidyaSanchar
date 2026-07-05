import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { RoleType } from '@prisma/client';

/**
 * 1. Send chat message
 */
export async function sendMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const { recipientId, content } = req.body;
    const senderId = req.user?.userId;

    if (!senderId) {
      return res.status(401).json({ message: 'Unauthorized. Logged-in context required.' });
    }
    if (!recipientId || !content) {
      return res.status(400).json({ message: 'recipientId and content are required.' });
    }

    const message = await prisma.message.create({
      data: {
        senderId,
        recipientId,
        content,
      },
      include: {
        sender: { select: { name: true, role: true, profileImage: true } },
        recipient: { select: { name: true, role: true, profileImage: true } },
      }
    });

    return res.status(201).json(message);
  } catch (error) {
    next(error);
  }
}

/**
 * 2. Get chat history between two users
 */
export async function getMessages(req: Request, res: Response, next: NextFunction) {
  try {
    const { otherUserId } = req.params;
    const currentUserId = req.user?.userId;

    if (!currentUserId) {
      return res.status(401).json({ message: 'Unauthorized. Logged-in context required.' });
    }

    // 1. Fetch conversations
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: currentUserId, recipientId: otherUserId },
          { senderId: otherUserId, recipientId: currentUserId },
        ]
      },
      orderBy: { createdAt: 'asc' },
    });

    // 2. Mark incoming unread messages as read
    await prisma.message.updateMany({
      where: {
        senderId: otherUserId,
        recipientId: currentUserId,
        isRead: false,
      },
      data: { isRead: true },
    });

    return res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
}

/**
 * 3. List recent chat participants (threads list)
 */
export async function getChatParticipants(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUserId = req.user?.userId;

    if (!currentUserId) {
      return res.status(401).json({ message: 'Unauthorized. Logged-in context required.' });
    }

    // Fetch messages involving current user
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: currentUserId }, { recipientId: currentUserId }]
      },
      select: {
        senderId: true,
        recipientId: true,
      },
    });

    // Get unique user IDs
    const participantIds = new Set<string>();
    messages.forEach(m => {
      if (m.senderId !== currentUserId) participantIds.add(m.senderId);
      if (m.recipientId !== currentUserId) participantIds.add(m.recipientId);
    });

    // Fetch participant profiles
    const participants = await prisma.user.findMany({
      where: {
        id: { in: Array.from(participantIds) }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profileImage: true,
      }
    });

    return res.status(200).json(participants);
  } catch (error) {
    next(error);
  }
}

/**
 * 4. Create Notice/Announcement
 */
export async function createNotice(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, message, recipientRole } = req.body;
    const senderId = req.user?.userId;

    if (!title || !message || !recipientRole) {
      return res.status(400).json({ message: 'title, message, and recipientRole are required.' });
    }

    const notice = await prisma.notification.create({
      data: {
        title,
        message,
        recipientRole: recipientRole as RoleType,
        isAnnouncement: true,
        senderId,
        schoolId: req.schoolId || undefined,
      }
    });

    return res.status(201).json(notice);
  } catch (error) {
    next(error);
  }
}

/**
 * 5. Get Notices matching role context
 */
export async function getNotices(req: Request, res: Response, next: NextFunction) {
  try {
    const userRole = req.user?.role;
    
    // Fetch announcements matching role type or broadcast 'All'
    const notices = await prisma.notification.findMany({
      where: {
        isAnnouncement: true,
        OR: [
          { recipientRole: userRole },
          { recipientRole: RoleType.SUPER_ADMIN }, // or fallback broadcast roles
        ],
        schoolId: req.schoolId || undefined,
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json(notices);
  } catch (error) {
    next(error);
  }
}
