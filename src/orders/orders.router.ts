/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { auth } from '../auth/auth.middleware';
import { createReview } from '../reviews/reviews.controller';
import { acceptOrder, getMyOrders } from './orders.controller';

const orderRouter = Router();

orderRouter.get('/', auth, getMyOrders);

orderRouter.put('/:id', auth, acceptOrder);

orderRouter.post('/:id/review', auth, createReview);

export { orderRouter };
