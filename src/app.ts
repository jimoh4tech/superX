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
import { storeRouter } from './stores/stores.router';
import { walletRouter } from './wallets/wallets.router';
import { itemRouter } from './items/items.router';

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
app.use('/api/v1/stores', storeRouter);
app.use('/api/v1/wallets', walletRouter);
app.use('/api/v1/items', itemRouter);

app.use(errorHandler);
app.use(notFoundHandler);


/**
 * Server Activation and Database connection
 */

export default app;
