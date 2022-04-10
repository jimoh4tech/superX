/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response } from 'express';
import { Item } from '../items/items.interface';
import ItemModel from '../items/items.model';
import StoreModel from '../stores/stores.model';
import { User } from '../users/users.interface';
import { throwError } from '../users/users.utils';
import {
	Currency,
	NewWallet,
	Wallet,
	Wallets,
} from '../wallets/wallets.interface';
import WalletModel from '../wallets/wallets.model';
import { Order, Orders, Status } from './orders.interface';
import OrderModel from './orders.model';
import { toNewOrder } from './orders.utils';

const createOrder = async (req: Request, res: Response) => {
	try {
		const user = req.currentUser;
		const { id } = req.params;

		if (!user) {
			res.status(404).send('Invalid user');
		}

		if (user?.role !== 'user') {
			res
				.status(400)
				.json({ error: 'Invalid request! Merchant cannot place order' });
		}
		const item: Item | null = await ItemModel.findById(id);

		if (!item) {
			res.status(404).json({ error: `Item with id: ${id} not found!` });
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const order = toNewOrder(req.body);

		const userWallets: Wallets = await WalletModel.find({ user: user?.id });

		const orderWallet: Wallet | undefined = userWallets.find(
			(w) => w.currency === item?.fromCurrency
		);

		if (item) {
			order.totalPrice = order.quantity * item?.price;
		}
		if (!orderWallet || (orderWallet && orderWallet.value < order.totalPrice)) {
			res.status(403).json({
				error: `Insufficient balance! Fund your ${orderWallet?.currency} wallet and retry.`,
			});
		} else {
			if (user && item) {
				order.user = user.id as unknown as User;
				order.store = item.store;
				order.status = Status.Pending;
				order.item = item.id as unknown as Item;
			}

			const createdOrder: Order | null = await OrderModel.create(order);

			res.status(201).json(createdOrder);
		}
	} catch (error: unknown) {
		res.status(400).send(throwError(error));
	}
};

const getMyOrders = async (req: Request, res: Response) => {
	try {
		const user = req.currentUser;

		if (!user) {
			res.status(404).send('Invalid user');
		}

		const orders: Orders = await OrderModel.find({ user: user?.id });
		res.status(200).json(orders);
	} catch (error: unknown) {
		res.status(400).send(throwError(error));
	}
};

const getStoreOrders = async (req: Request, res: Response) => {
	try {
		const user = req.currentUser;
		const { id } = req.params;

		if (!user) {
			res.status(404).send('Invalid user');
		}

		const store = await StoreModel.findById(id);

		if (!store) {
			res.status(404).json({ error: `Store with id: ${id} not found!` });
		}

		if (String(store?.user) !== user?.id) {
			res
				.status(401)
				.json({ error: 'Not authorized to view another store orders' });
		}
		const orders: Orders = await OrderModel.find({ store: id });

		res.status(200).json(orders);
	} catch (error: unknown) {
		res.status(400).send(throwError(error));
	}
};

const acceptOrder = async (req: Request, res: Response) => {
	try {
		const user = req.currentUser;
		const { id } = req.params;

		const order: Order | null = await OrderModel.findById(id);

		if (!user) {
			res.status(404).send('Invalid user');
		}

		
		if (!order) {
			res.status(404).json({ error: `Order with id: ${id} not found!` });
		}

		if (order?.status === 'completed') {
			res.status(400).json({error: 'Order has already been processed!'});
		}
		if (user?.role !== 'merchant') {
			res.status(403).json({ error: 'Users cannot access this route!' });
		}
		const item = await ItemModel.findById(order?.item);

		const userWallets: Wallets = await WalletModel.find({ user: order?.user });

		const userWalletFrom: Wallet | undefined = userWallets.find(
			(w) => w.currency === item?.fromCurrency
		);

		const userWalletTo: Wallet | undefined = userWallets.find(
			(w) => w.currency === item?.toCurrency
		);

		if (
			!userWalletFrom ||
			(userWalletFrom && order && userWalletFrom.value < order?.totalPrice)
		) {
			res.status(403).json({
				error: `Insufficient balance! User does not have enough balance to continue`,
			});
		}

		const storeWallets: Wallets = await WalletModel.find({ user: user?.id });
		const storeWalletToDebit: Wallet | undefined = storeWallets.find(
			(w) => w.currency === item?.toCurrency
		);

		const storeWalletToCredit: Wallet | undefined = storeWallets.find(
			(w) => w.currency === item?.fromCurrency
		);

		if (
			!storeWalletToDebit ||
			(storeWalletToDebit &&
				order &&
				storeWalletToDebit.value < order?.quantity)
		) {
			res.status(403).json({
				error: `Insufficient balance! Fund your ${storeWalletToDebit?.currency} wallet and retry.`,
			});
		}

		if (userWalletFrom && order) {
			const userWalletToUpdate: NewWallet = {
				user: userWalletFrom.user,
				currency: userWalletFrom.currency,
				value: userWalletFrom.value - order?.totalPrice,
			};
			await WalletModel.findByIdAndUpdate(
				userWalletFrom.id,
				userWalletToUpdate,
				{ new: true, runValidators: true }
			);
		}

		if (userWalletTo && order) {
			const userWalletToUpdate: NewWallet = {
				user: userWalletTo.user,
				currency: userWalletTo.currency,
				value: userWalletTo.value + order?.quantity,
			};
			await WalletModel.findByIdAndUpdate(userWalletTo.id, userWalletToUpdate, {
				new: true,
				runValidators: true,
			});
		} else if (order) {
			const newUserWallet: NewWallet = {
				user: order.user,
				currency: item?.toCurrency as Currency,
				value: order?.quantity,
			};

			await WalletModel.create(newUserWallet);
		}

		if (storeWalletToDebit && order) {
			const storeWalletToUpdate: NewWallet = {
				user: storeWalletToDebit.user,
				currency: storeWalletToDebit.currency,
				value: storeWalletToDebit.value - order.quantity,
			};

			await WalletModel.findByIdAndUpdate(
				storeWalletToDebit.id,
				storeWalletToUpdate,
				{ new: true, runValidators: true }
			);
		}

		if (storeWalletToCredit && order) {
			const storeWalletToUpdate: NewWallet = {
				user: storeWalletToCredit.user,
				currency: storeWalletToCredit.currency,
				value: storeWalletToCredit.value + order.totalPrice,
			};

			await WalletModel.findByIdAndUpdate(
				storeWalletToCredit.id,
				storeWalletToUpdate,
				{ new: true, runValidators: true }
			);
		} else if (order) {
			const newStoreWallet: NewWallet = {
				user: user?.id as unknown as User,
				currency: item?.toCurrency as Currency,
				value: order.totalPrice,
			};

			await WalletModel.create(newStoreWallet);
		}

		const orderToUpadate = {
			user: order?.user,
			store: order?.store,
			status: Status.Completed,
			item: order?.item,
			quantity: order?.quantity,
			totalPrice: order?.totalPrice,
		};

		const updatedOrder = await OrderModel.findByIdAndUpdate(
			order?.id,
			orderToUpadate,
			{ new: true, runValidators: true }
		);

		res.status(200).json(updatedOrder);
	} catch (error: unknown) {
		res.status(400).send(throwError(error));
	}
};

export { createOrder, getMyOrders, getStoreOrders, acceptOrder };
