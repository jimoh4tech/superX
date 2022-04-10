/**
 * Required External Modules
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { userRouter } from './users/users.router';
import { loginRouter } from './auth/auth.router';
import { errorHandler } from './error/error.middleware';
import { notFoundHandler } from './error/not-found.middleware';

/**
 * App Variables
 */

const app = express();

/**
 *  App Configuration
 */
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api/v1/users', userRouter);
app.use('/api/v1/login', loginRouter);

app.use(errorHandler);
app.use(notFoundHandler);


/**
 * Server Activation and Database connection
 */

export default app;
