/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connection, connect } from 'mongoose';
import supertest, { Response } from 'supertest';
import app from '../../src/app';

const api = supertest(app);

let mongodb: MongoMemoryServer;
const initialUsers = [
	{
		id: '1',
		name: 'Abu Abdillah',
		email: 'abu@gmail.com',
		password: '123456',
		role: 'user',
	},
	{
		id: '2',
		name: 'Abu Fawzan',
		email: 'fawzan@gmail.com',
		password: '123456',
		role: 'merchant',
	},
];
const initialStore = [
	{
		name: 'Swift Exchange 4Life',
		description:
			'This is one of the best store you can ever get for swift exchage of currencies',
	},
];
const initialItem = [
	{
		name: '500N to 1$',
		price: 500,
		description: "Offer won't last long",
		fromCurrency: 'naira',
		toCurrency: 'dollar',
	},
];

const initialWallet = [
	{
		currency: 'naira',
		value: 1000,
	},
	{
		currency: 'dollar',
		value: 5000,
	},
];


const loginCredentials = { email: 'fawzan@gmail.com', password: '123456' };
let res: Response;

beforeAll(async () => {
	try {
		mongodb = await MongoMemoryServer.create();
		const uri = mongodb.getUri();
		await connect(uri);
		await api.post('/api/v1/users').send(initialUsers[0]);
		await api.post('/api/v1/users').send(initialUsers[1]);

    res = await api.post('/api/v1/login').send(loginCredentials);

    await api
			.post('/api/v1/wallets')
			.set('Authorization', `Bearer ${res.body.token}`)
			.send(initialWallet[1]);

		await api
			.post('/api/v1/stores')
			.set('Authorization', `Bearer ${res.body.token}`)
			.send(initialStore[0]);

		const store = await api.get('/api/v1/stores');
		const firstStore = store.body[0];

		await api
			.post(`/api/v1/stores/${firstStore.id}/items`)
			.set('Authorization', `Bearer ${res.body.token}`)
			.send(initialItem[0]);
	} catch (error) {
		console.error(error);
	}
});

describe('Order API', () => {
	test('POST /api/v1/items/:id/orders => items can be ordered', async () => {
		res = await api
			.post('/api/v1/login')
      .send({ email: 'abu@gmail.com', password: '123456' });
    
    await api
			.post('/api/v1/wallets')
			.set('Authorization', `Bearer ${res.body.token}`)
			.send(initialWallet[0]);
		const itemsAtStart = await api.get('/api/v1/items');
		const itemToOrder = itemsAtStart.body[0];

		await api
			.post(`/api/v1/items/${itemToOrder.id}/orders`)
			.set('Authorization', `Bearer ${res.body.token}`)
			.send({ quantity: 1 })
			.expect(201)
			.expect('Content-Type', /application\/json/);
	});

	test('GET /api/v1/orders => users can get their orders', async () => {
		const orderRes = await api
			.get('/api/v1/orders')
			.set('Authorization', `Bearer ${res.body.token}`)
			.expect(200)
			.expect('Content-Type', /application\/json/);
		expect(orderRes.body[0].user).toContain(res.body.id);
	});

	test('PUT /api/v1/orders/:id => store owner can accept their orders', async () => {
		res = await api
			.post('/api/v1/login')
			.send({ email: 'fawzan@gmail.com', password: '123456' });
		const stores = await api.get('/api/v1/stores');
		const store = stores.body[0];
		const storeOrders = await api
			.get(`/api/v1/stores/${store.id}/orders`)
      .set('Authorization', `Bearer ${res.body.token}`);
    

		const storeorderToAccept = storeOrders.body[0];
		const acceptedOrder = await api
			.put(`/api/v1/orders/${storeorderToAccept.id}`)
			.set('Authorization', `Bearer ${res.body.token}`)
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(acceptedOrder.body.status).toContain('completed');
	});
});

afterAll(async () => {
	await connection.close();
	await mongodb.stop();
});
