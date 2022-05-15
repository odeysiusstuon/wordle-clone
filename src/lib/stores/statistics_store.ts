import type { Guess, PlayerStatistics, PlayerWord } from '$lib/types';
import { get } from 'svelte/store';
import { settingsStore } from './settings_store';

class StatisticsStore {
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
		this.playerStatistics.days[word.wordId] = {
			word,
			guessList: []
		};
	}

	addDayIfNotPresent(word: PlayerWord) {
		if (this.hasDay(word)) return;
		this.addDay(word);
	}

	public get getStatistics(): PlayerStatistics {
		return this.playerStatistics;
	}

	print() {
		console.log(this.playerStatistics);
	}
}

export const statisticsStore = new StatisticsStore();
