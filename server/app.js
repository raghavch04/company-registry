import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
// import xss from 'xss-clean'; // Optional
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import companyRoutes from './routes/companyRoutes.js';
import geocodeRoutes from './routes/geocodeRoutes.js';
import errorMiddleware from './middlewares/errorMiddleware.js';

const app = express();

// Security middleware
app.use(helmet());
// app.use(xss()); // Uncomment if you want XSS protection
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP'
});
app.use('/api', limiter);

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://company-registry.onrender.com/',
  credentials: true
}));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API routes
app.use('/api/companies', companyRoutes);
app.use('/api/geocode', geocodeRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Static file serving for production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
  });
}

// Error handling middleware
app.use(errorMiddleware);

export default app;
