/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
	await api.post('/api/v1/users').send(initialUsers[0]);
	await api.post('/api/v1/users').send(initialUsers[1]);
	await api.post('/api/v1/users').send(initialUsers[2]);
	await api.post('/api/v1/users').send(initialUsers[3]);
});

describe('User API', () => {

  test('GET /api/v1/users => users can be retuned in JSON format and the correct length', async () => {
		const res = await api
			.get('/api/v1/users')
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(res.body).toHaveLength(4);
	});
	test('POST /api/v1/users => new user can be added', async () => {
		const newUser = {
			name: 'Testing case',
			email: 'test@gmail.com',
			password: '654321',
			role: 'user',
		};

		const user = await api
			.post('/api/v1/users')
			.send(newUser)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		expect(user.body.email).toContain(newUser.email);
		expect(user.body.name).toContain(newUser.name);
		expect(user.body.role).toContain(newUser.role);
	});
});

afterAll(() => mongoose.connection.close());
