import type { IDatabase, PlayerWord, Word } from '$lib/types';
import moment from 'moment';
import type { MongoClient, WithId } from 'mongodb';

type WordDocument = WithId<Document> & Omit<Word, 'wordId'>;

const wordCacheLimit = 2;

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
		const words = (await collection
			.find({
				date: { $gte: moment.utc().startOf('day').subtract(1, 'day').toDate() }
			})
			.sort({ date: 1 })
			.toArray()) as WordDocument[];

		this.wordCache = words.slice(0, wordCacheLimit);
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

	private async getWordNumber(words: WordDocument[], searchWord: WordDocument) {
		return words.findIndex((w) => w._id === searchWord._id) + 1;
	}

	async getLatestWord(): Promise<Word> {
		await this.updateCache();

		if (this.wordCache.length > 0) {
			const word = this.wordCache[0];
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
		await this.updateCache();

		if (this.wordCache.length > 1) {
			const word = this.wordCache[1];
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
