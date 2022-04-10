/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { auth } from '../auth/auth.middleware';

import {
	createUser,
	getAllUsers,
	getUser,
	updateUser,
	deleteUser,
} from './users.controller';

const userRouter = Router();

userRouter.post('/', createUser);

userRouter.get('/', getAllUsers);

userRouter.get('/:id', getUser);

userRouter.put('/:id', auth, updateUser);

userRouter.delete('/:id', auth, deleteUser);

export { userRouter };
