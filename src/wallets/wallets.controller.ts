/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response } from 'express';
import { throwError } from '../users/users.utils';
import { NewWallet } from './wallets.interface';
import WalletModel from './wallets.model';
import { toNewWallet } from './wallets.utils';
import { User } from '../users/users.interface';

const fundWallet = async (req: Request, res: Response) => {
	try {
		const user = req.currentUser;

		if (!user) {
			res.status(404).send('Invalid user');
		}

		const haveWallet = await WalletModel.find({ user: user?.id });
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		const walletsCurrencies = haveWallet.map((w) => w.currency);
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const newWallet: NewWallet = toNewWallet(req.body);
		const wallet = haveWallet.find((w) => w.currency === newWallet.currency);

		if (
			haveWallet &&
			walletsCurrencies.includes(newWallet.currency) &&
			wallet
		) {
			const walletToUpdate = {
				value: wallet?.value + newWallet.value,
			};
			const updatedWallet = await WalletModel.findByIdAndUpdate(
				wallet?.id,
				walletToUpdate,
				{ new: true, runValidators: true }
			);

			res.status(200).json(updatedWallet);
		} else {
			if (user) {
				newWallet.user = user.id as unknown as User;
			}
			const createdWalllet = await WalletModel.create(newWallet);
			res.status(200).json(createdWalllet);
		}
	} catch (error: unknown) {
		res.status(400).send(throwError(error));
	}
};

const getMyWallet = async (req: Request, res: Response) => {
	try {
		const user = req.currentUser;

		if (!user) {
			res.status(404).send('Invalid user');
		}
		const wallet = await WalletModel.find({ user: user?.id });

		res.status(200).json(wallet);
	} catch (error: unknown) {
		res.status(400).send(throwError(error));
	}
};

export { fundWallet, getMyWallet };
