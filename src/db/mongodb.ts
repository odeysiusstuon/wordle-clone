import type { IDatabase, Word } from '$lib/types';
import moment from 'moment';
import type { MongoClient, WithId } from 'mongodb';

type WordDocument = WithId<Document> & Word;

export class MongoDB implements IDatabase {
	client: Promise<MongoClient>;
	wordCache: Word[] = [];

	constructor(client: Promise<MongoClient>) {
		this.client = client;
	}

	async updateCache() {
		const connection = await this.client;
		const db = connection.db();
		const collection = db.collection('words');
		const words = await collection
			.find({
				date: { $gte: moment.utc().startOf('day').toDate() }
			})
			.sort({ date: 1 })
			.limit(2)
			.toArray();
		this.wordCache = words as WordDocument[];
	}

	async getLatestWord() {
		if (this.wordCache.length > 0) {
			if (this.wordCache.length === 1) {
				await this.updateCache();
			} else {
				const nextWord = this.wordCache[1];
				const now = moment.utc();
				const nextWordDate = moment(nextWord.date).utc();
				if (now >= nextWordDate) {
					await this.updateCache();
				}
			}
		} else {
			await this.updateCache();
		}
		
		if (this.wordCache.length > 0) {
			const word = this.wordCache[0];
			return {
				word: word.word,
				date: word.date,
				desc: word.desc
			};
		} else {
			return null;
		}
	}

	async getWordHistory() {
		const connection = await this.client;
		const db = connection.db();
		const collection = db.collection('words');
		const words = (await collection
			.find({
				date: {
					$lt: moment.utc().toDate()
				}
			})
			.toArray()) as [WordDocument];
		return words;
	}
}
