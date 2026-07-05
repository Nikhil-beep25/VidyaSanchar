import { Request, Response, NextFunction } from 'express';

// Extend Express Request interface globally
declare global {
  namespace Express {
    interface Request {
      schoolId?: string;
    }
  }
}

export function tenantMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // 1. Resolve tenant ID from Request Header, Query Parameters, or Logged In User token context
    let schoolId: string | undefined = req.headers['x-tenant-id'] as string || req.query.schoolId as string || undefined;

    if (!schoolId && req.user) {
      // Fallback to token context if user is authenticated
      schoolId = req.user.schoolId;
    }

    // 2. Validate tenant access (Super Admins can bypass)
    if (!schoolId && req.user?.role !== 'SUPER_ADMIN') {
      // For public or unauthenticated endpoints, let it pass to allow onboarding/landing;
      // Protected tenant routes will validate schoolId presence at controller level
    }

    req.schoolId = schoolId;
    next();
  } catch (error) {
    next(error);
  }
}
