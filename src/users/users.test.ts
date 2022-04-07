/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../../src/app';
import { connectToDb } from '../../src/dbConnection';

const api = supertest(app);

const initialUsers = [
	{
		name: 'Abu Abdillah',
		email: 'abu@gmail.com',
		password: '123456',
		role: 'user',
	},
	{
		name: 'Abu Fawzan',
		email: 'fawzan@gmail.com',
		password: '123456',
		role: 'merchant',
	},
	{
		name: 'Micheal John',
		email: 'micheal@gmail.com',
		password: '123456',
		role: 'user',
	},
	{
		name: 'Ebuka Ugo',
		email: 'ebuka@gmail.com',
		password: '123456',
		role: 'merchant',
	},
];

beforeAll(async () => {

	await connectToDb();
	await api.post('/api/v1/users').send(initialUsers[0]);
});

describe('User API', () => {

  test('GET /api/v1/users => users can be retuned in JSON format and the correct length', async () => {
		const res = await api
			.get('/api/v1/users')
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(res.body).toHaveLength(1);
	});
});

afterAll(() => mongoose.connection.close());
