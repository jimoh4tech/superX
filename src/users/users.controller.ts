import { Request, Response } from 'express';
import { hash } from 'bcrypt';
import UserModel from './users.model';
import { throwError, toNewUser } from './users.utils';
import { NewUser, User, Users } from './users.interface';

const createUser = async (req: Request, res: Response) => {
	try {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const newUser: NewUser = toNewUser(req.body);
		const existingUser: User | null = await UserModel.findOne({ email: newUser.email });

		if (existingUser) {
			res
				.status(400)
				.json({ error: 'Email must be unique. User already registered' });
		}
		const saltRounds = 10;
		const passwordHash = await hash(newUser.password, saltRounds);
		newUser.password = passwordHash;

		const createdUser = await UserModel.create(newUser);

		res.status(201).json(createdUser);
	} catch (error: unknown) {
		res.status(400).send(throwError(error));
	}
};

const getAllUsers = async (_req: Request, res: Response) => {
	try {
		const users: Users = await UserModel.find({});

		res.status(200).json(users);
	} catch (error: unknown) {
		res.status(400).send(throwError(error));
	}
};

export { createUser, getAllUsers };
