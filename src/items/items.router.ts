/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { auth } from '../auth/auth.middleware';

import { getItems, getItem, updateItem, deleteItem } from './items.controller';
// import { createOrder } from '../orders/orders.controller';
// import { getItemReviews } from '../reviews/reviews.controller';

const itemRouter = Router();

itemRouter.get('/', getItems);

itemRouter.get('/:id', getItem);

itemRouter.put('/:id', auth, updateItem);

itemRouter.delete('/:id', auth, deleteItem);

// itemRouter.post('/:id/orders', auth, createOrder);

// itemRouter.get('/:id/review', getItemReviews);

export { itemRouter };
