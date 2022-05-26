import { previousUrl, type Guess, type PlayerStatistics, type PlayerWord } from '$lib/types';
import moment from 'moment';
import { get } from 'svelte/store';
import { settingsStore } from './settings_store';
import { browser } from '$app/env';
import { findFirstDiscontinuousDay, findMaxStreak } from '$lib/utils';

export class StatisticsStore {
	private playerStatistics: PlayerStatistics;

	constructor() {
		if (get(settingsStore.saveProgress) && browser) {
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
		this.updatePlaysAndWins();
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
		this.updatePlaysAndWins();
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

	async wonPreviousDay() {
		const res = await fetch(previousUrl);
		const previousWord = (await res.json()) as PlayerWord;

		if (!(previousWord.wordId in this.playerStatistics.days)) return false;
		const previousDay = this.playerStatistics.days[previousWord.wordId];
		return previousDay.guessList.some((g) => g.guessed && g.feedback.correct);
	}

	private calculateStreak(currentWord: PlayerWord, hasFinished: boolean) {
		if (!(currentWord.wordId in this.playerStatistics.days)) return null;
		const currentDay = this.playerStatistics.days[currentWord.wordId];

		if (hasFinished && !currentDay.guessList.some(g => g.guessed && g.feedback.correct)) {
			return 0;
		}

		let daysArrayReversed = this.getDaysArray().reverse();

		if (!hasFinished) {
			daysArrayReversed = daysArrayReversed.slice(1);
		}

		const firstDiscontinuousDayIndex = findFirstDiscontinuousDay(daysArrayReversed);
		const firstLoseDayIndex = daysArrayReversed.findIndex(([_, stats]) => {
			return stats.guessList.every(g => !(g.guessed && g.feedback.correct));
		});

		if (firstDiscontinuousDayIndex === -1) {
			if (firstLoseDayIndex === -1) return daysArrayReversed.length;
			return firstLoseDayIndex;
		} else {
			if (firstLoseDayIndex === -1) {
				return Math.min(daysArrayReversed.length, firstDiscontinuousDayIndex);
			} else {
				return Math.min(firstLoseDayIndex, firstDiscontinuousDayIndex);
			}
		}
	}

	private calculateMaxStreak() {
		return findMaxStreak(this.getDaysArray());
	}

	updatePlaysAndWins() {
		this.playerStatistics.totalPlays = Object.keys(this.playerStatistics.days).length;
		this.playerStatistics.totalWins = Object.values(this.playerStatistics.days).reduce((currentWins, currentDay) => {
			return currentWins + (currentDay.guessList.some(g => g.guessed && g.feedback.correct) ? 1 : 0);
		}, 0);
	}

	updateStreaks(currentWord: PlayerWord, hasFinished: boolean) {
		this.playerStatistics.currentStreak = this.calculateStreak(currentWord, hasFinished);
		this.playerStatistics.maxStreak = this.calculateMaxStreak();
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

	getDaysArray() {
		return Object.entries(this.playerStatistics.days).sort(([_a, a], [_b, b]) => moment(a.word.date).diff(moment(b.word.date)));
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

	public get statistics(): PlayerStatistics {
		return this.playerStatistics;
	}

	print() {
		console.log(this.playerStatistics);
	}
}

export const statisticsStore = new StatisticsStore();
