/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response } from 'express';
import { throwError } from '../users/users.utils';
import { User } from '../users/users.interface';
import { toNewItem, toUpdateItem } from './items.util';
import ItemModel from './items.model';
import { Item, Items } from './items.interface';
import StoreModel from '../stores/stores.model';
import { Store } from '../stores/stores.interface';

const createItem = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const user = req.currentUser;
		const store = await StoreModel.findById(id);

		if (!store) {
			res.status(404).json({ error: `Store with id: ${id} not found!` });
		}
		if (!user) {
			res.status(404).send('Invalid user');
		}

		if (user?.id !== String(store?.user)) {
			res
				.status(401)
				.json({ error: 'Not authorized to add items to this store' });
		}
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const newItem: Item = toNewItem(req.body);

		if (newItem.fromCurrency === newItem.toCurrency) {
			res.status(403).json({
				error: 'Invalid reqauest! Same currencies cannot be exchanged',
			});
		} else {
			if (user && store) {
				newItem.user = user.id as unknown as User;
				newItem.store = store?.id as Store;
			}

			const createdItem = await ItemModel.create(newItem);
			res.status(201).json(createdItem);
		}
	} catch (error: unknown) {
		res.status(400).send(throwError(error));
	}
};

const getItems = async (_req: Request, res: Response) => {
	try {
		const items: Items = await ItemModel.find({});
		res.status(200).json(items);
	} catch (error: unknown) {
		res.status(400).send(throwError(error));
	}
};

const getItem = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const item: Item | null = await ItemModel.findById(id);
		if (item) res.status(200).json(item);
		res.status(404).send(`Item with id: ${id} not found`);
	} catch (error: unknown) {
		res.status(400).send(throwError(error));
	}
};

const updateItem = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const user = req.currentUser;
		const item = await ItemModel.findById(id);

		if (!item) {
			res.status(404).json({ error: `Item with id: ${id} not found` });
		}

		if (!user) {
			res.status(404).send('Invalid user');
		}

		if (user?.id !== String(item?.user)) {
			res
				.status(401)
				.json({ error: 'Not authorized to update items to this store' });
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const itemToUpdate = toUpdateItem(req.body);

		const updatedItem = await ItemModel.findByIdAndUpdate(id, itemToUpdate, {
			new: true,
			runValidators: true,
		});
		res.status(200).json(updatedItem);
	} catch (error: unknown) {
		res.status(400).send(throwError(error));
	}
};

const deleteItem = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const user = req.currentUser;
		const item = await ItemModel.findById(id);

		if (!item) {
			res.status(404).json({ error: `Item with id: ${id} not found` });
		}

		if (!user) {
			res.status(404).send('Invalid user');
		}

		if (user?.id !== String(item?.user)) {
			res
				.status(401)
				.json({ error: 'Not authorized to delete items to this store' });
		}
		await ItemModel.findByIdAndDelete(id);
		res.status(204).end();
	} catch (error: unknown) {
		res.status(400).send(throwError(error));
	}
};

export { createItem, getItems, getItem, updateItem, deleteItem };
