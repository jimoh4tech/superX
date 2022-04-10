/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response } from 'express';
import { hash } from 'bcrypt';
import UserModel from './users.model';
import { parseRole, throwError, toNewUser } from './users.utils';
import { NewUser, User, Users } from './users.interface';

const createUser = async (req: Request, res: Response) => {
	try {
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

const getUser = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const user: User | null = await UserModel.findById(id);

		if (user) {
			res.status(200).json(user);
		}

		res.status(404).send(`User with id: ${id} not found`);
	} catch (error: unknown) {
		res.status(400).send(throwError(error));
	}
};

const updateUser = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const user = req.currentUser;
		if (!user) {
			res.status(404).send('Invalid user');
		}

		if (user?.id !== id) {
			res.status(401).json({ error: 'Unauthorized to update this user' });
		}
		const body = req.body;

		if (body.password) {
			body.password = await hash(body.password, 10);
		}
		if (body.role) {
			body.role = parseRole(body.role);
		}
		const userToUpdate = {
			...body,
			email: user?.email,
			createdAt: user?.createdAt,
		};

		const updatedUser = await UserModel.findByIdAndUpdate(id, userToUpdate, {
			new: true,
			runValidators: true,
		});

		res.status(200).json(updatedUser);
	} catch (error: unknown) {
		res.status(400).send(throwError(error));
	}
};

const deleteUser = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const user = req.currentUser;
		if (!user) {
			res.status(404).send('Invalid user');
		}
		if (user?.id !== id) {
			res.status(401).json({ error: 'Unauthorized to update this user' });
		}

		await UserModel.findByIdAndDelete(id);
		res.status(204).end();
	} catch (error: unknown) {
		res.status(400).send(throwError(error));
	}
};

export { createUser, getAllUsers, getUser, updateUser, deleteUser };
