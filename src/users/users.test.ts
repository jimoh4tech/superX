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

beforeAll(async () => {
	try {
		mongodb = await MongoMemoryServer.create();
		const uri = mongodb.getUri();
		await connect(uri);
		await api.post('/api/v1/users').send(initialUsers[0]);
		await api.post('/api/v1/users').send(initialUsers[1]);
	} catch (error) {
		console.error(error);
	}
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

	let res: Response;
	describe('LOGIN API', () => {
		const userLogin = {
			email: 'abu@gmail.com',
			password: '123456',
		};

		test('POST /api/v1/login => user can login', async () => {
			const res = await api
				.post('/api/v1/login')
				.send(userLogin)
				.expect(200)
				.expect('Content-Type', /application\/json/);

			expect(res.body.token).toBeDefined();
		});
		beforeEach(async () => {
			res = await api
				.post('/api/v1/login')
				.send(userLogin)
				.expect(200)
				.expect('Content-Type', /application\/json/);
		});

		test('PUT /api/v1/users/:id => only valid user can update their personal details', async () => {
			const userToUpdate = {
				name: 'Testing updating',
				email: 'abu@gmail.com',
				password: '123456',
				role: 'user',
			};

			const userRes = await api.get('/api/v1/users');
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const user = userRes.body[0];

			await api
				.put(`/api/v1/users/${user.id}`)
				.set('Authorization', `Bearer ${res.body.token}`)
				.send(userToUpdate)
				.expect(200);
		});

		test('DELETE /api/v1/users/:id => only valid users can delete their account', async () => {
			const userRes = await api.get('/api/v1/users');
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const user = userRes.body[0];
			await api
				.delete(`/api/v1/users/${user.id}`)
				.set('Authorization', `Bearer ${res.body.token}`)
				.expect(204);
		});
	});
});

afterAll(async () => {
	await connection.close();
	await mongodb.stop();
});
