import type { Guess, PlayerStatistics, PlayerWord } from '$lib/types';
import moment from 'moment';
import { get } from 'svelte/store';
import { settingsStore } from './settings_store';

export class StatisticsStore {
	private playerStatistics: PlayerStatistics;

	constructor() {
		if (get(settingsStore.saveProgress)) {
			this.loadPlayerStatistics();
		} else {
			this.playerStatistics = {
				totalPlays: 0,
				totalWins: 0,
				currentStreak: 0,
				maxStreak: 0,
				days: {}
			};
		}
	}

	savePlayerStatistics() {
		this.playerStatistics.totalPlays = Object.keys(this.playerStatistics.days).length;
		localStorage.setItem('playerStatistics', JSON.stringify(this.playerStatistics));
	}

	loadPlayerStatistics() {
		this.playerStatistics = (JSON.parse(localStorage.getItem('playerStatistics')) || {
			totalPlays: 0,
			totalWins: 0,
			currentStreak: 0,
			maxStreak: 0,
			days: {}
		}) as PlayerStatistics;
	}

	setGuess(currentWord: PlayerWord, attemptNum: number, guess: Guess) {
		const day = this.playerStatistics.days[currentWord.wordId];
		day.guessList[attemptNum] = guess;
	}

	getGuesses(currentWord: PlayerWord) {
		if (!(currentWord.wordId in this.playerStatistics.days)) return null;
		const day = this.playerStatistics.days[currentWord.wordId];
		return day.guessList;
	}

	hasDay(word: PlayerWord) {
		return word.wordId in this.playerStatistics.days;
	}

	addDay(word: PlayerWord) {
		const now = moment.utc();
		this.playerStatistics.days[word.wordId] = {
			startedTimestampMs: now.valueOf(),
			word,
			guessList: []
		};
	}

	addDayIfNotPresent(word: PlayerWord) {
		if (this.hasDay(word)) return;
		this.addDay(word);
	}

	addWin() {
		this.playerStatistics.totalWins++;
		this.playerStatistics.currentStreak++;
		if (this.playerStatistics.maxStreak < this.playerStatistics.currentStreak) {
			this.playerStatistics.maxStreak = this.playerStatistics.currentStreak;
		}
	}

	getAmountNthDegree(degree: number) {
		return Object.keys(this.playerStatistics.days).filter((wordId) => {
			const guess = this.playerStatistics.days[wordId];
			return (
				guess.guessList.some((g) => g.guessed && g.feedback.correct) &&
				guess.guessList.filter((g) => g.guessed).length === degree
			);
		}).length;
	}

	getCurrentTimeSpentMs(currentWord: PlayerWord) {
		if (!(currentWord.wordId in this.playerStatistics.days)) return null;
		const day = this.playerStatistics.days[currentWord.wordId];
		return moment.utc().valueOf() - day.startedTimestampMs;
	}

	getTotalPlays() {
		return this.playerStatistics.totalPlays;
	}

	getTotalWins() {
		return this.playerStatistics.totalWins;
	}

	getCurrentStreak() {
		return this.playerStatistics.currentStreak;
	}

	getMaxStreak() {
		return this.playerStatistics.maxStreak;
	}

	public get getStatistics(): PlayerStatistics {
		return this.playerStatistics;
	}

	print() {
		console.log(this.playerStatistics);
	}
}

export const statisticsStore = new StatisticsStore();
