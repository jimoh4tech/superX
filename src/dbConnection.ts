import { config } from 'dotenv';
import { connect } from 'mongoose';
config();

const connectToDb = async (): Promise<void> => {
	if (!process.env.MONGODB_URI ) {
		throw new Error("Error: MONGO_DB undefined");
		
	}

	const MONGODB_URI = process.env.MONGODB_URI;

	await connect(MONGODB_URI)
		.then(() => console.log('Connected to database'))
		.catch((error) => console.log('error connecting to DB ' + error));
};

export { connectToDb };
