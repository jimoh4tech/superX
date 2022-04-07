/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';

import { createUser, getAllUsers } from './users.controller';

const userRouter = Router();

userRouter.post('/', createUser);

userRouter.get('/', getAllUsers);

export { userRouter };
