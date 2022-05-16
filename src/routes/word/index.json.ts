import { db } from '$lib/db';
import { variables } from '$lib/env';
import { MongoClient } from 'mongodb';

export async function get() {
	console.log(db);
	console.log(variables.uri);
	const client = new MongoClient(variables.uri);
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
