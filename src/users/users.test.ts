import { MongoMemoryServer } from 'mongodb-memory-server';
import { connection, connect } from 'mongoose';
import supertest from 'supertest';
import app from '../../src/app';
import UserModel from './users.model';

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

beforeAll(async () => {
	try {
		mongodb = await MongoMemoryServer.create();
		const uri = mongodb.getUri();
		await connect(uri);
		await UserModel.insertMany(initialUsers);
	} catch (error) {
		console.error(error);
	}
});

afterAll(async () => {
	await connection.close();
	await mongodb.stop();
});

describe('User API', () => {
	test('GET /api/v1/users => users can be retuned in JSON format and the correct length', async () => {
		const res = await api
			.get('/api/v1/users')
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(res.body).toHaveLength(2);
	});
	test('POST /api/v1/users => new user can be added', async () => {
		const newUser = {
			id: '3',
			name: 'John Ada',
			email: 'john@gmail.com',
			password: '123456',
			role: 'merchant',
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
