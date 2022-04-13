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
import { orderRouter } from './orders/orders.router';
import { reviewRouter } from './reviews/reviews.router';

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

app.use('/', (req, res, next) => {
	if (req.url === '/') {
		res
			.status(200)
			.send(
				'API is running. Click <a href="https://documenter.getpostman.com/view/15084009/UVyyrsGW">here</a> for available endpoints'
			);
	}
	next();
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/login', loginRouter);
app.use('/api/v1/stores', storeRouter);
app.use('/api/v1/wallets', walletRouter);
app.use('/api/v1/items', itemRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/reviews', reviewRouter);

app.use(errorHandler);
app.use(notFoundHandler);
/**
 * Server Activation and Database connection
 */

export default app;
