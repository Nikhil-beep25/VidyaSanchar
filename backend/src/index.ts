import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
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

// 5. HTTP Request Logger (Morgan)
app.use(morgan('dev'));

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
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes.' }
});
app.use('/api', apiLimiter);

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
