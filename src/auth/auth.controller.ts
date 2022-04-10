/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { throwError } from '../users/users.utils';
import UserModel from '../users/users.model';
import { User } from '../users/users.interface';

const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;
		const user: User | null = await UserModel.findOne({ email });

		const passwordCorrect =
			user === null ? false : await compare(password, user.password);
		if (!user || !passwordCorrect) {
			res.status(401).json({ error: 'Invalid username or password' });
		}

		const userForToken = {
			email: user?.email,
			id: user?.id,
		};
		if (!process.env.SECRET) process.exit(1);

		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		const token = sign(userForToken, process.env.SECRET, { expiresIn: '1h' });

		res.status(200).json({ token, email: user?.email, id: user?.id });
	} catch (error: unknown) {
		res.status(400).send(throwError(error));
	}
};

export { login };
