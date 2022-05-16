import type { IDatabase } from '$lib/types';
import { MongoClient } from 'mongodb';
import { MongoDB } from './mongodb';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.MONGODB_URI) {
	throw new Error('Could not find URI');
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
	if (!global._mongoClientPromise) {
		client = new MongoClient(process.env.MONGODB_URI);
		global._mongoClientPromise = client.connect();
	}

	clientPromise = global._mongoClientPromise;
} else {
	client = new MongoClient(process.env.MONGODB_URI);
	clientPromise = client.connect();
}

export const db: IDatabase = new MongoDB(clientPromise);
