import { db } from '$lib/db';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

export async function get() {
	console.log(db);
	console.log(process.env.MONGODB_URI);
	const client = new MongoClient(process.env.MONGODB_URI);
	const clientPromise = client.connect();
	console.log(clientPromise);
	const word = await db.getLatestPlayerWord();
	if (word) {
		return {
			body: { word }
		};
	}

	return {
		status: 404,
		error: new Error('Could not load the latest word')
	};
}
