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
			.post('/api/v1/wallets')
			.set('Authorization', `Bearer ${res.body.token}`)
			.send(initialWallet[0]);
	} catch (error) {
		console.error(error);
	}
});

describe('Wallet API', () => {
	test('POST /api/v1/wallets => wallet can be created and fund', async () => {
		const walletRes = await api
			.post('/api/v1/wallets')
			.set('Authorization', `Bearer ${res.body.token}`)
			.send(initialWallet[1]);

		expect(walletRes.body.currency).toBe('dollar');
		expect(walletRes.body.value).toBe(5000);
	});

	test('GET /api/v1/wallets => user can get all their wallets', async () => {
		await api
			.get('/api/v1/wallets')
			.set('Authorization', `Bearer ${res.body.token}`)
			.expect(200)
			.expect('Content-Type', /application\/json/);
	});
});

afterAll(async () => {
	await connection.close();
	await mongodb.stop();
});
