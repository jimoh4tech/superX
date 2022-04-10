/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { auth } from '../auth/auth.middleware';
import {
	createStore,
	getAllStores,
	getStore,
	updateStore,
	deleteStore,
	getStoreItems,
	followStore,
} from './stores.controller';

import { createItem } from '../items/items.controller';
// import { getStoreOrders } from '../orders/orders.controller';

const storeRouter = Router();

storeRouter.post('/', auth, createStore);

storeRouter.get('/', getAllStores);

storeRouter.get('/:id', getStore);

storeRouter.put('/:id', auth, updateStore);

storeRouter.put('/:id/follow', auth, followStore);

storeRouter.delete('/:id', auth, deleteStore);

storeRouter.post('/:id/items', auth, createItem);

// storeRouter.get('/:id/orders', auth, getStoreOrders);

storeRouter.get('/:id/items', getStoreItems);

export { storeRouter };
