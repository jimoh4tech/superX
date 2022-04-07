/**
 * Required External Modules
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { userRouter } from './users/users.router';

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


/**
 * Server Activation and Database connection
 */

export default app;
