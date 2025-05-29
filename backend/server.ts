// Server startup logic
import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { connectDB } from './config/db.config';

import authRoutes from './auth/routes/auth.routes';
import userRoutes from './user/routes/user.routes';
import documentRoutes from './document/routes/document.routes';
import ingestionRoutes from './ingestion/routes/ingestion.routes';
import { errorHandler } from './utils/error-handler';

import { swaggerUi, swaggerSpec } from './config/swagger';

dotenv.config();

const app = express();
app.use(express.json());

// Security headers
app.use(helmet());

// HTTP request logger
app.use(morgan('combined'));

// Parse JSON bodies
app.use(bodyParser.json());

// Parse URL-encoded bodies (useful for form submissions)
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();

const PORT = process.env.PORT || 5000;

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/ingestions', ingestionRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Application running on port ${PORT}`);
});

export default app;