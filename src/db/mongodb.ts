import type { IDatabase, Word } from '$lib/types';
import moment from 'moment';
import type { MongoClient, WithId } from 'mongodb';

type WordDocument = WithId<Document> & Word;

export class MongoDB implements IDatabase {
	client: Promise<MongoClient>;

	constructor(client: Promise<MongoClient>) {
		this.client = client;
	}

	async getLatestWord() {
		const connection = await this.client;
		const db = connection.db();
		const collection = db.collection('latestWord');
		const word = (await collection.findOne()) as WordDocument;
		return {
			word: word.word,
			date: word.date,
			desc: word.desc,
		};
	}

	async getWordHistory() {
		const connection = await this.client;
		const db = connection.db();
		const collection = db.collection('words');
		const words = (await collection
			.find({
				date: {
					$lt: moment.utc().toDate(),
				},
			})
			.toArray()) as [WordDocument];
		return words;
	}
}
