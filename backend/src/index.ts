import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { env } from './config/env';
import apiRouter from './routes';
import { swaggerSpec } from './swagger/swagger';
import { errorMiddleware } from './middlewares/errorMiddleware';
import { tenantMiddleware } from './middlewares/tenantMiddleware';

const app = express();

// 1. Helmet (Security Headers)
app.use(helmet());

// 2. CORS
app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.options('*', cors());

// 3. Compression (Gzip)
app.use(compression());

// 4. Body Parsers (JSON & URL Encoded)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded assets
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// 5. HTTP Request Logger (Morgan)
import { logger } from './utils/logger';
const morganStream = {
  write: (message: string) => logger.info(message.trim()),
};
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev', { stream: morganStream }));

// 6. Path Rewriter Middleware (Frontend Compatibility)
// Rewrites routes omitting `/api` (like `/auth/login`) to `/api/auth/login`
app.use((req, res, next) => {
  if (
    !req.path.startsWith('/api') &&
    !req.path.startsWith('/api-docs') &&
    !req.path.startsWith('/health') &&
    req.path !== '/'
  ) {
    req.url = `/api${req.url}`;
  }
  next();
});

// 7. Rate Limiter (Brute-force protection)
const isDev = env.NODE_ENV === 'development';

const skipLocalhost = (req: any) => {
  if (isDev) {
    const ip = req.ip || req.socket.remoteAddress || '';
    return ip.includes('127.0.0.1') || ip.includes('::1') || ip.includes('localhost');
  }
  return false;
};

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 10000 : 5, // 10000 requests in dev, 5 requests in prod
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipLocalhost,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.'
  },
  handler: (req: any, res: any, next: any, options: any) => {
    console.warn(`[Rate Limit Hit - Auth Route Blocked] IP: ${req.ip || req.socket.remoteAddress}, Route: ${req.originalUrl}`);
    res.status(options.statusCode).json(options.message);
  }
});

const dashboardLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: isDev ? 10000 : 500, // 10000 requests in dev, 500 requests in prod
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipLocalhost,
  message: {
    success: false,
    message: 'Too many dashboard requests. Please try again in a minute.'
  },
  handler: (req: any, res: any, next: any, options: any) => {
    console.warn(`[Rate Limit Hit - Dashboard Route Blocked] IP: ${req.ip || req.socket.remoteAddress}, Route: ${req.originalUrl}`);
    res.status(options.statusCode).json(options.message);
  }
});

const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: isDev ? 10000 : 1000, // 10000 requests in dev, 1000 requests in prod
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req: any) => {
    if (skipLocalhost(req)) return true;
    const url = req.originalUrl || '';
    // Skip routes protected by their own limiters to prevent double limiting
    return url.startsWith('/api/auth/login') ||
           url.startsWith('/api/auth/register') ||
           url.startsWith('/api/auth/reset-password') ||
           url.startsWith('/api/analytics');
  },
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again in a minute.'
  },
  handler: (req: any, res: any, next: any, options: any) => {
    console.warn(`[Rate Limit Hit - General Route Blocked] IP: ${req.ip || req.socket.remoteAddress}, Route: ${req.originalUrl}`);
    res.status(options.statusCode).json(options.message);
  }
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/reset-password', authLimiter);
app.use('/api/analytics', dashboardLimiter);
app.use('/api', generalLimiter);

// 8. Dynamic Swagger UI served directly via TypeScript spec import
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
console.log(`Swagger API Documentation mounted on /api-docs`);

// 9. Root Route GET /
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'VidyaSanchar API Running',
    version: '1.0.0'
  });
});

// 10. Health Check Endpoints
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// 11. Register Routes with Tenant Isolation Middleware
app.use('/api', tenantMiddleware, apiRouter);

// 12. Handle 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// 13. Global Error Handler (must be registered last)
app.use(errorMiddleware);

// Start Server
app.listen(env.PORT, () => {
  console.log(`[Server] Running in ${env.NODE_ENV} mode on port ${env.PORT}`);
});
