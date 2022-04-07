/**
 * Required External Modules
 */

import { config} from 'dotenv';
import { connectToDb } from './dbConnection';
import app from './app';

config();

/**
 * App Variables
 */

const PORT = process.env.PORT || 4000;

/**
 * Server Activation and Database connection
 */

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.listen(PORT, async () => {
	await connectToDb();
	console.log(`Server runing on port ${PORT}`);
});