import { db } from '$lib/db';
import { env } from '$lib/env';
import { MongoClient } from 'mongodb';

export async function get() {
	console.log(db);
	console.log(env.MONGODB_URI);
	const client = new MongoClient(env.MONGODB_URI);
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
