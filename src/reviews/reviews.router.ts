import { Router } from 'express';
import { auth } from '../auth/auth.middleware';
import { updateReview } from './reviews.controller';

const reviewRouter = Router();

// eslint-disable-next-line @typescript-eslint/no-misused-promises
reviewRouter.put('/:id', auth, updateReview);

export { reviewRouter };
