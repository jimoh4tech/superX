/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Request, Response } from 'express';
import { Items } from '../items/items.interface';
import ItemModel from '../items/items.model';
import { User } from '../users/users.interface';
import { throwError } from '../users/users.utils';
import { NewStore, Store, Stores } from './stores.interface';
import StoreModel from './stores.model';
import { parseDescription, parseName, toNewStore } from './stores.util';

const createStore = async (req: Request, res: Response) => {
	try {
		const user = req.currentUser;
		if (!user) {
			res.status(404).send('Invalid user');
		}

		if (user?.role === 'user') {
			res.status(404).send('Invalid request! Only merchant can create a store');
		}
		const newStore: NewStore = toNewStore(req.body);
		if (user) {
			newStore.user = user.id as unknown as User;
		}

		const existingStore = await StoreModel.findOne({ name: newStore.name });
		if (existingStore) {
			res
				.status(400)
				.json({ error: 'Store name must be unique. Name already taken' });
		}

		const haveStore = await StoreModel.findOne({ user: user?.id });
		if (haveStore) {
			res.status(400).json({
				error:
					'Merchant can only create one store. Store already associated with user',
			});
		} else {
			const createdStore = await StoreModel.create(newStore);
			res.status(201).json(createdStore);
		}
	} catch (error: unknown) {
		res.status(400).send(throwError(error));
	}
};

const getAllStores = async (_req: Request, res: Response) => {
	try {
		const stores: Stores = await StoreModel.find({});
		res.status(200).json(stores);
	} catch (error: unknown) {
		res.status(400).send(throwError(error));
	}
};

const getStore = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const store: Store | null = await StoreModel.findById(id);

		if (store) {
			res.status(200).json(store);
		}

		res.status(404).send(`store with id: ${id} not found!`);
	} catch (error: unknown) {
		res.status(400).send(throwError(error));
	}
};

const getStoreItems = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const store: Store | null = await StoreModel.findById(id);

		if (!store) {
			res.status(404).json({ error: `Store with id: ${id} not found` });
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		const storeItems: Items = await ItemModel.find({ store: store?.id });
		res.status(200).json(storeItems);
	} catch (error: unknown) {
		res.status(400).send(throwError(error));
	}
};

const updateStore = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const user = req.currentUser;
		if (!user) {
			res.status(404).send('Invalid user');
		}

		const existingStore = await StoreModel.findById(id);

		if (!existingStore) {
			res
				.status(404)
				.json({ error: `store with id: ${id} could not be found` });
		}

		if (user?.id !== String(existingStore?.user)) {
			res.status(401).json({ error: 'Unauthorized to update this store' });
		}

		const store = req.body;
		if (store.name) {
			store.name = parseName(store.name);
		}

		if (store.description) {
			store.description = parseDescription(store.description);
		}

		const updatedStore = await StoreModel.findByIdAndUpdate(id, store, {
			new: true,
			runValidators: true,
		});

		res.status(200).json(updatedStore);
	} catch (error: unknown) {
		res.status(400).send(throwError(error));
	}
};

const followStore =async (req:Request, res: Response) => {
	try {
		const { id } = req.params;
		const user = req.currentUser;
		if (!user) {
			res.status(404).send('Invalid user');
		}

		const store: Store | null = await StoreModel.findById(id);

		if (!store) {
			res.status(404).json({ error: `Store with id: ${id} not found` });
		}
		
		if (user && store) {
			const userId = user.id as unknown as User;
			if (store?.follow?.includes(userId)) {
				res.status(403).json({error: 'You cannot follow a store twice.'});
			}
			const storeToFollow: NewStore = {
				name: store.name,
				description: store.description,
				user: store.user,
				averageRating: store.averageRating,
				createAt: store.createAt,

				follow: store?.follow?.concat(userId)
			};

			const followedStore = await StoreModel.findByIdAndUpdate(store.id, storeToFollow, { new: true, runValidators: true });
			res.status(200).json(followedStore);
		}
	} catch (error: unknown) {
		res.status(400).send(throwError(error));
	}
};

const deleteStore = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const user = req.currentUser;
		if (!user) {
			res.status(404).send('Invalid user');
		}

		const existingStore = await StoreModel.findById(id);

		if (!existingStore) {
			res
				.status(404)
				.json({ error: `store with id: ${id} could not be found` });
		}

		if (user?.id !== String(existingStore?.user)) {
			res.status(401).json({ error: 'Unauthorized to update this store' });
		}

		await StoreModel.findByIdAndDelete(id);
		res.status(204).end();
	} catch (error: unknown) {
		res.status(400).send(throwError(error));
	}
};
export {
	createStore,
	getAllStores,
	getStore,
	getStoreItems,
	updateStore,
	followStore,
	deleteStore,
};
