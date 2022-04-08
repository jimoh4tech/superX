/* eslint-disable @typescript-eslint/no-unsafe-call */
import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../../src/app';
import { connectToDb } from '../../src/dbConnection';
import UserModel from './users.model';

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
	await UserModel.deleteMany();
});

describe('User API', () => {
	test('POST /api/v1/users => new user can be added', async () => {
		const user = await api
			.post('/api/v1/users')
			.send(initialUsers[0])
			.expect(201)
			.expect('Content-Type', /application\/json/);

		expect(user.body.email).toContain(initialUsers[0].email);
		expect(user.body.name).toContain(initialUsers[0].name);
		expect(user.body.role).toContain(initialUsers[0].role);
	});
	test('GET /api/v1/users => users can be retuned in JSON format and the correct length', async () => {
		const res = await api
			.get('/api/v1/users')
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(res.body).toHaveLength(1);
	});
});

afterAll(() => mongoose.connection.close());
