import type { IDatabase, PlayerWord, Word } from '$lib/types';
import moment from 'moment';
import type { MongoClient, WithId } from 'mongodb';

type WordDocument = WithId<Document> & Omit<Word, 'wordId'>;

export class MongoDB implements IDatabase {
	client: Promise<MongoClient>;
	wordCache: WordDocument[] = [];

	constructor(client: Promise<MongoClient>) {
		this.client = client;
	}

	private async fetchCache() {
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

	private async updateCache() {
		if (this.wordCache.length > 0) {
			if (this.wordCache.length === 1) {
				await this.fetchCache();
			} else {
				const nextWord = this.wordCache[1];
				const now = moment.utc();
				const nextWordDate = moment(nextWord.date).utc();
				if (now >= nextWordDate) {
					await this.fetchCache();
				}
			}
		} else {
			await this.fetchCache();
		}
	}

	async getLatestWord(): Promise<Word> {
		await this.updateCache();

		if (this.wordCache.length > 0) {
			const word = this.wordCache[0];
			return {
				wordId: word._id.toHexString(),
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
				date: word.date
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
		return words.map((w) => {
			return {
				wordId: w._id.toHexString(),
				word: w.word,
				date: w.date,
				desc: w.desc
			} as Word;
		});
	}
}
