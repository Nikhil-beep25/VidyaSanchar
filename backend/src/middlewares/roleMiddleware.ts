import { Request, Response, NextFunction } from 'express';
import { RoleType } from '@prisma/client';

export function roleMiddleware(allowedRoles: RoleType[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in first.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden. You do not have permission to access this resource.' });
    }

    next();
  };
}
