import { config } from 'dotenv';
import { connect } from 'mongoose';
config();

const connectToDb = async (): Promise<void> => {
	if (!process.env.MONGODB_URI || !process.env.TEST_MONGODB_URI) {
		return;
	}

	const MONGODB_URI =
		process.env.NODE_ENV === 'test'
			? process.env.TEST_MONGODB_URI
			: process.env.MONGODB_URI;

	await connect(MONGODB_URI)
		.then(() => console.log('Connected to database'))
		.catch((error) => console.log('error connecting to DB ' + error));
};

export { connectToDb };
