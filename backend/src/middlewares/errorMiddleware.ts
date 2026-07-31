import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { env } from '../config/env';

export function errorMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'An unexpected error occurred on the server.';

  // Stream to logger
  logger.error(`[API Error] Path: ${req.originalUrl || req.path} | Status: ${statusCode} | Message: ${message}`, {
    error: err,
    stack: err.stack,
  });

  return res.status(statusCode).json({
    success: false,
    message,
    error: err.error || err.message || 'InternalServerError',
    statusCode,
    stack: env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}
