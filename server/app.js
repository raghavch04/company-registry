import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
//port xss from 'xss-clean';
import compression from 'compression';
import geocodeRoutes from './routes/geocodeRoutes.js';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import companyRoutes from './routes/companyRoutes.js';
import errorMiddleware from './middlewares/errorMiddleware.js';

const app = express();

// Security middleware
app.use(helmet());
//app.use(xss());
app.use(compression());
// Geocoding routes
app.use('/api/geocode', geocodeRoutes);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP'
});
app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/companies', companyRoutes);

// Error handling
app.use(errorMiddleware);

export default app;