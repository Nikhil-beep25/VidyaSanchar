import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';

/**
 * List contacts / conversations with last messages
 */
export async function getConversations(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    if (!userId || !userRole) {
      return res.status(401).json({ message: 'User context missing.' });
    }

    // 1. Identify contacts based on role rules:
    // - Admin: can chat with anyone
    // - Teacher: can chat with admins, parents and students in their class
    // - Student: can chat with class teachers and admins
    // - Parent: can chat with class teachers of their students and admins
    let contactUsers: any[] = [];

    if (userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') {
      contactUsers = await prisma.user.findMany({
        where: { id: { not: userId } },
        select: { id: true, name: true, role: true, profileImage: true, email: true }
      });
    } else {
      // Find all users who have sent or received messages from this user
      const messagedUserIds = await prisma.message.findMany({
        where: {
          OR: [{ senderId: userId }, { recipientId: userId }],
          isDeleted: false
        },
        select: { senderId: true, recipientId: true }
      });

      const uniqueIds = new Set<string>();
      messagedUserIds.forEach(m => {
        if (m.senderId !== userId) uniqueIds.add(m.senderId);
        if (m.recipientId !== userId) uniqueIds.add(m.recipientId);
      });

      // Also add fallback contacts (e.g. teachers/admins)
      const admins = await prisma.user.findMany({
        where: { role: { in: ['SUPER_ADMIN', 'ADMIN'] } },
        select: { id: true, name: true, role: true, profileImage: true, email: true }
      });
      admins.forEach(a => uniqueIds.add(a.id));

      if (userRole === 'PARENT') {
        // Find teachers of their children
        const parent = await prisma.parent.findUnique({
          where: { userId },
          include: {
            students: {
              include: {
                studentClass: {
                  include: {
                    classTeacher: { include: { user: { select: { id: true } } } },
                    subjects: { include: { teacher: { include: { user: { select: { id: true } } } } } }
                  }
                }
              }
            }
          }
        });
        if (parent) {
          parent.students.forEach(s => {
            if (s.studentClass.classTeacher?.user?.id) {
              uniqueIds.add(s.studentClass.classTeacher.user.id);
            }
            s.studentClass.subjects.forEach(sub => {
              if (sub.teacher?.user?.id) {
                uniqueIds.add(sub.teacher.user.id);
              }
            });
          });
        }
      } else if (userRole === 'STUDENT') {
        const student = await prisma.student.findUnique({
          where: { userId },
          include: {
            studentClass: {
              include: {
                classTeacher: { include: { user: { select: { id: true } } } },
                subjects: { include: { teacher: { include: { user: { select: { id: true } } } } } }
              }
            }
          }
        });
        if (student) {
          if (student.studentClass.classTeacher?.user?.id) {
            uniqueIds.add(student.studentClass.classTeacher.user.id);
          }
          student.studentClass.subjects.forEach(sub => {
            if (sub.teacher?.user?.id) {
              uniqueIds.add(sub.teacher.user.id);
            }
          });
        }
      }

      contactUsers = await prisma.user.findMany({
        where: { id: { in: Array.from(uniqueIds) } },
        select: { id: true, name: true, role: true, profileImage: true, email: true }
      });
    }

    // 2. Fetch last message and unread count for each contact
    const conversations = await Promise.all(
      contactUsers.map(async contact => {
        const lastMessage = await prisma.message.findFirst({
          where: {
            OR: [
              { senderId: userId, recipientId: contact.id },
              { senderId: contact.id, recipientId: userId }
            ],
            isDeleted: false
          },
          orderBy: { createdAt: 'desc' }
        });

        const unreadCount = await prisma.message.count({
          where: {
            senderId: contact.id,
            recipientId: userId,
            isRead: false,
            isDeleted: false
          }
        });

        return {
          contact,
          lastMessage: lastMessage ? {
            content: lastMessage.content,
            createdAt: lastMessage.createdAt,
            isRead: lastMessage.isRead,
            senderId: lastMessage.senderId
          } : null,
          unreadCount
        };
      })
    );

    // Sort conversations by last message timestamp (newest first)
    conversations.sort((a, b) => {
      const aTime = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
      const bTime = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
      return bTime - aTime;
    });

    return res.status(200).json(conversations);
  } catch (error) {
    next(error);
  }
}

/**
 * Fetch messages between active user and a contact
 */
export async function getMessageHistory(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    const { contactId } = req.params;
    if (!userId) {
      return res.status(401).json({ message: 'User context missing.' });
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, recipientId: contactId },
          { senderId: contactId, recipientId: userId }
        ],
        isDeleted: false
      },
      orderBy: { createdAt: 'asc' }
    });

    // Mark messages from contact to user as read
    await prisma.message.updateMany({
      where: {
        senderId: contactId,
        recipientId: userId,
        isRead: false
      },
      data: { isRead: true }
    });

    return res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
}

/**
 * Send a message
 */
export async function sendMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    const { recipientId, content } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'User context missing.' });
    }
    if (!recipientId || !content) {
      return res.status(400).json({ message: 'Recipient and message content are required.' });
    }

    const message = await prisma.message.create({
      data: {
        senderId: userId,
        recipientId,
        content
      }
    });

    return res.status(201).json(message);
  } catch (error) {
    next(error);
  }
}

/**
 * Mark a message as read
 */
export async function markMessageAsRead(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const message = await prisma.message.update({
      where: { id },
      data: { isRead: true }
    });
    return res.status(200).json(message);
  } catch (error) {
    next(error);
  }
}
