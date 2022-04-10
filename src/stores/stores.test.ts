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
const loginCredentials = { email: 'abu@gmail.com', password: '123456' };
let res: Response;

beforeAll(async () => {
	try {
		mongodb = await MongoMemoryServer.create();
		const uri = mongodb.getUri();
		await connect(uri);
		await api.post('/api/v1/users').send(initialUsers[0]);

		res = await api.post('/api/v1/login').send(loginCredentials);
	} catch (error) {
		console.error(error);
	}
});

describe('Store API', () => {
	test('POST /api/v1/store => new store can be created', async () => {
		await api
			.post('/api/v1/stores')
			.set('Authorization', `Bearer ${res.body.token}`)
			.send(initialStore[0]);
	});
	test('GET /api/v1/stores => stores can be returned in JSON and correct length', async () => {
		const res = await api
			.get('/api/v1/stores')
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(res.body).toHaveLength(1);
	});

	test('PUT /api/v1/stores => new store can be updated by the merchant', async () => {
		const storeAtStart = await api.get('/api/v1/stores');
		const upadateStore = storeAtStart.body[0];

		const storeToUpdate = {
			name: 'Swift Exchange Limited',
			description:
				'This is one of the best store you can ever get for swift exchage of currencies',
		};

		const res2 = await api
			.put(`/api/v1/stores/${upadateStore.id}`)
			.set('Authorization', `Bearer ${res.body.token}`)
			.send(storeToUpdate)
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(res2.body.name).toContain(storeToUpdate.name);
	});

	test('DELETE /api/v1/stores => store can be deleted by the owner', async () => {
		const storeAtStart = await api.get('/api/v1/stores');
		const storeToDelete = storeAtStart.body[0];

		await api
			.delete(`/api/v1/stores/${storeToDelete.id}`)
			.set('Authorization', `Bearer ${res.body.token}`)
			.expect(204);
	});
});

afterAll(async () => {
	await connection.close();
	await mongodb.stop();
});
