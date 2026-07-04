import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { RoleType } from '@prisma/client';

// Simple cookie parser helper
function getCookie(req: Request, name: string): string | null {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(';').reduce((acc, c) => {
    const parts = c.trim().split('=');
    const key = parts[0];
    const val = parts.slice(1).join('=');
    acc[key] = val;
    return acc;
  }, {} as Record<string, string>);
  return cookies[name] || null;
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, name, role, phone, address } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ message: 'Email, password, name, and role are required.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const passwordHash = await hashPassword(password);
    const userRole = role as RoleType;

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: userRole,
        phone,
        address,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        address: true,
        profileImage: true,
        isActive: true,
        createdAt: true,
      },
    });

    const accessToken = generateAccessToken({ userId: user.id, email: user.email, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email, role: user.role });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json({
      message: 'User registered successfully.',
      user,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Invalid credentials or inactive account.' });
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const accessToken = generateAccessToken({ userId: user.id, email: user.email, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email, role: user.role });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Check if user has profiles and include profile references
    let studentId: string | null = null;
    let teacherId: string | null = null;
    let parentId: string | null = null;

    if (user.role === RoleType.STUDENT) {
      const student = await prisma.student.findUnique({ where: { userId: user.id } });
      studentId = student ? student.id : null;
    } else if (user.role === RoleType.TEACHER) {
      const teacher = await prisma.teacher.findUnique({ where: { userId: user.id } });
      teacherId = teacher ? teacher.id : null;
    } else if (user.role === RoleType.PARENT) {
      const parent = await prisma.parent.findUnique({ where: { userId: user.id } });
      parentId = parent ? parent.id : null;
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        profileImage: user.profileImage,
        phone: user.phone,
        address: user.address,
        studentId,
        teacherId,
        parentId,
      },
      accessToken,
      token: accessToken, // compatibility fallback
      refreshToken,      // compatibility fallback
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'An unexpected error occurred during login.'
    });
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const refreshToken = getCookie(req, 'refreshToken');
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'Refresh token not found.' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'User is inactive or does not exist.' });
    }

    const newAccessToken = generateAccessToken({ userId: user.id, email: user.email, role: user.role });
    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      token: newAccessToken, // compatibility fallback
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Invalid or expired refresh token.'
    });
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    res.clearCookie('refreshToken');
    return res.status(200).json({ message: 'Logged out successfully.' });
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Avoid enumerating emails for security, return 200
      return res.status(200).json({ message: 'If the email exists, a reset link will be sent.' });
    }

    // In a real application, send an email. We will return a mock reset token.
    return res.status(200).json({
      message: 'Password reset instructions have been generated.',
      resetToken: `MOCK_RESET_TOKEN_${user.id}_${Date.now()}`,
    });
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required.' });
    }

    // Parse the mock token (e.g. MOCK_RESET_TOKEN_<userId>_<timestamp>)
    const parts = token.split('_');
    if (parts.length < 4 || parts[0] !== 'MOCK' || parts[1] !== 'RESET') {
      return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }

    const userId = parts[2];
    const timestamp = parseInt(parts[3], 10);

    // Validate token expiry (e.g., 1 hour)
    if (Date.now() - timestamp > 60 * 60 * 1000) {
      return res.status(400).json({ message: 'Reset token has expired.' });
    }

    const passwordHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    next(error);
  }
}
