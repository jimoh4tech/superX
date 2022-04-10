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

const loginCredentials = { email: 'abu@gmail.com', password: '123456' };
let res: Response;

beforeAll(async () => {
	try {
		mongodb = await MongoMemoryServer.create();
		const uri = mongodb.getUri();
		await connect(uri);
		await api.post('/api/v1/users').send(initialUsers[0]);

		res = await api.post('/api/v1/login').send(loginCredentials);

		await api
			.post('/api/v1/stores')
			.set('Authorization', `Bearer ${res.body.token}`)
			.send(initialStore[0]);
	} catch (error) {
		console.error(error);
	}
});

describe('Item API', () => {
	test('POST /api/v1/stores/:id/items => New item can be added', async () => {

		const store = await api.get('/api/v1/stores');
		const firstStore = store.body[0];

		const itemRes = await api
			.post(`/api/v1/stores/${firstStore.id}/items`)
			.set('Authorization', `Bearer ${res.body.token}`)
			.send(initialItem[0]);

		expect(itemRes.body.name).toContain(initialItem[0].name);
	});
	test('GET /api/v1/items => Items can be returned in JSON format and correct length', async () => {
		const res = await api
			.get('/api/v1/items')
			.expect(200)
			.expect('Content-Type', /application\/json/);
		expect(res.body).toHaveLength(1);
	});


	test('PUT /api/v1/items/:id => item can be updated', async () => {
		const itemsAtStart = await api.get('/api/v1/items');
		const itemToUpdate = itemsAtStart.body[0];

		const updateItem = {
			price: itemToUpdate.price + 100,
			description: itemToUpdate.description,
		};

		const itemRes = await api
			.put(`/api/v1/items/${itemToUpdate.id}`)
			.set('Authorization', `Bearer ${res.body.token}`)
			.send(updateItem)
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(itemRes.body.price).toBe(itemToUpdate.price + 100);
	});

	test('DELETE /api/v1/items/:id => item can be deleted', async () => {
		const itemsAtStart = await api.get('/api/v1/items');
		const itemToDelete = itemsAtStart.body[0];
		await api
			.delete(`/api/v1/items/${itemToDelete.id}`)
			.set('Authorization', `Bearer ${res.body.token}`)
			.expect(204);
	});
});

afterAll(async () => {
	await connection.close();
	await mongodb.stop();
});
