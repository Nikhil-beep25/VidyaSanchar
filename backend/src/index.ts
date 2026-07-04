import express from 'express';
import cors from 'cors';
import * as path from 'path';
import * as fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import apiRouter from './routes';
import { errorMiddleware } from './middlewares/errorMiddleware';

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (
      process.env.NODE_ENV !== 'production' ||
      allowedOrigins.indexOf(origin) !== -1 ||
      allowedOrigins.includes('*')
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load Swagger document
let swaggerDoc;
try {
  const swaggerPath = path.join(__dirname, './swagger/swagger.json');
  if (fs.existsSync(swaggerPath)) {
    swaggerDoc = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));
  }
} catch (error) {
  console.warn('Failed to load swagger.json. API documentation may be unavailable.', error);
}

if (swaggerDoc) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
  console.log(`Swagger API Documentation available at http://localhost:${env.PORT}/api-docs`);
}

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// Register routes
app.use('/api', apiRouter);

// Global Error Handler
app.use(errorMiddleware);

// Handle 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// Start Server
app.listen(env.PORT, () => {
  console.log(`[Server] Running in ${env.NODE_ENV} mode on port ${env.PORT}`);
});
