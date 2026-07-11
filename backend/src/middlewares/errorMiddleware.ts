import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { env } from '../config/env';

export function errorMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
  const status = err.status || 500;
  const message = err.message || 'An unexpected error occurred on the server.';

  // Stream to Winston logger
  logger.error(`[API Error] Path: ${req.path} | Status: ${status} | Message: ${message}`, {
    error: err,
    stack: err.stack,
  });

  res.status(status).json({
    success: false,
    message,
    stack: env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}
