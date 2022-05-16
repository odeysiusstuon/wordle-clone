import type { IDatabase } from '$lib/types';
import { MongoClient } from 'mongodb';
import { MongoDB } from './mongodb';
import { variables } from '$lib/env';

const uri = variables.uri;

if (!uri) {
	throw new Error('Could not find URI');
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
	if (!global._mongoClientPromise) {
		client = new MongoClient(uri);
		global._mongoClientPromise = client.connect();
	}

	clientPromise = global._mongoClientPromise;
} else {
	client = new MongoClient(uri);
	clientPromise = client.connect();
}

export const db: IDatabase = new MongoDB(clientPromise);
