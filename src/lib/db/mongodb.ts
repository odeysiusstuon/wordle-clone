import type { IDatabase, PlayerWord, Word } from '$lib/types';
import moment from 'moment-timezone';
import { ObjectId, type MongoClient, type WithId } from 'mongodb';

type WordDocument = WithId<Document> & Omit<Word, 'wordId'>;

const wordCacheLimit = 2;

const timezone = 'America/Los_Angeles';

export class MongoDB implements IDatabase {
	client: Promise<MongoClient>;
	wordCache: WordDocument[] = [];
	wordHistoryCache: PlayerWord[] = [];

	constructor(client: Promise<MongoClient>) {
		this.client = client;
	}

	private async fetchCache() {
		const connection = await this.client;
		const db = connection.db();
		const collection = db.collection('words');
		const todayAndFutureWords = (await collection
			.find({
				date: { $gte: moment.tz(timezone).startOf('day').toDate() }
			})
			.sort({ date: 1 })
			.toArray()) as WordDocument[];

		this.wordCache = todayAndFutureWords.slice(0, wordCacheLimit);

		const pastWords = (await collection
			.find({
				date: {
					$lt: moment.utc().toDate()
				}
			})
			.toArray()) as [WordDocument];
		this.wordHistoryCache = pastWords.map((w) => {
			return {
				wordId: w._id.toHexString(),
				num: w.num,
				date: w.date
			} as PlayerWord;
		});
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
		await this.updateCache();
		if (this.wordHistoryCache) {
			return this.wordHistoryCache;
		}
		return null;
	}

	async wordExists(word: string) {
		const connection = await this.client;
		const db = connection.db();
		const collection = db.collection('words');
		const foundWord = await collection.findOne({
			word
		});
		return foundWord !== null;
	}

	async getDesc(id: string, word: string) {
		const connection = await this.client;
		const db = connection.db();
		const collection = db.collection('words');
		const foundWord = (await collection.findOne({
			_id: new ObjectId(id)
		})) as WordDocument;

		if (foundWord && foundWord.word === word) {
			return foundWord.desc;
		} else {
			return null;
		}
	}
}
