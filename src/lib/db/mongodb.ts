import type { IDatabase, PlayerWord, Word } from '$lib/types';
import moment from 'moment';
import type { MongoClient, WithId } from 'mongodb';

type WordDocument = WithId<Document> & Omit<Word, 'wordId'>;

export class MongoDB implements IDatabase {
	client: Promise<MongoClient>;

	constructor(client: Promise<MongoClient>) {
		this.client = client;
	}

	async getLatestWord(): Promise<Word> {
		const connection = await this.client;
		const db = connection.db();
		const collection = db.collection('words');
		const words = (await collection
			.find({
				date: { $gte: moment.utc().startOf('day').subtract(1, 'day').toDate() }
			})
			.sort({ date: 1 })
			.toArray()) as WordDocument[];

		if (words.length > 0) {
			const word = words[0];
			return {
				wordId: word._id.toHexString(),
				num: word.num,
				word: word.word,
				date: word.date,
				desc: word.desc
			};
		} else {
			return null;
		}
	}

	async getLatestPlayerWord(): Promise<PlayerWord> {
		const word = await this.getLatestWord();
		if (word) {
			return {
				wordId: word.wordId,
				num: word.num,
				date: word.date
			};
		} else {
			return null;
		}
	}

	async getNextPlayerWord(): Promise<PlayerWord> {
		const connection = await this.client;
		const db = connection.db();
		const collection = db.collection('words');
		const words = (await collection
			.find({
				date: { $gte: moment.utc().startOf('day').subtract(1, 'day').toDate() }
			})
			.sort({ date: 1 })
			.toArray()) as WordDocument[];

		if (words.length > 0) {
			const word = words[1];
			return {
				wordId: word._id.toHexString(),
				num: word.num,
				date: word.date
			};
		} else {
			return null;
		}
	}

	async getPreviousPlayerWord(): Promise<PlayerWord> {
		const latestWord = await this.getLatestWord();
		if (latestWord) {
			const connection = await this.client;
			const db = connection.db();
			const collection = db.collection('words');
			const previousWords = (await collection
				.find({
					date: { $lt: latestWord.date }
				})
				.sort({ date: -1 })
				.limit(1)
				.toArray()) as WordDocument[];
			const previousWord = previousWords[0];
			if (previousWord) {
				return {
					wordId: previousWord._id.toHexString(),
					date: previousWord.date,
					num: previousWord.num
				};
			} else {
				return null;
			}
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
		return words.map((w) => {
			return {
				wordId: w._id.toHexString(),
				num: w.num,
				word: w.word,
				date: w.date,
				desc: w.desc
			} as Word;
		});
	}
}
