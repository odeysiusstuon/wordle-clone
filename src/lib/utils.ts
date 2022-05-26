import { writable, type Writable } from 'svelte/store';
import { emojiMappings, maxGuesses, type DayStatistics, type Guess, type PlayerStatistics, type PlayerWord } from './types';
import type { StatisticsStore } from '$lib/stores/statistics_store';
import { browser } from '$app/env';
import moment from 'moment';

export function keyToCharacter(key: string) {
	return key[3].toLowerCase();
}

export function characterToKey(character: string): string {
	return `Key${character.toUpperCase()}`;
}

export function guessListToEmojis(guesses: Guess[]) {
	return guesses
		.map((g) => {
			if (g.guessed) {
				return g.feedback.hint.letters.map((f) => emojiMappings[f]);
			} else {
				return null;
			}
		})
		.filter((g) => g !== null);
}

export function copyGuessesToClipboard(
	statisticsStore: StatisticsStore,
	currentWord: PlayerWord,
	addToast: (message: string) => void = undefined
) {
	if (!browser) return;
	const guesses = statisticsStore.getGuesses(currentWord);
	const guessesEmojis = guessListToEmojis(guesses);

	let resultsString = '';
	if (guesses.some((g) => g.guessed && g.feedback.correct)) {
		resultsString += `BARdle ${currentWord.num} ${guessesEmojis.length}/${maxGuesses}`;
	} else {
		resultsString += `BARdle ${currentWord.num} X/${maxGuesses}`;
	}
	resultsString += '\n\n';
	resultsString += guessesEmojis.map((r) => r.join('')).join('\n');

	navigator.clipboard
		.writeText(resultsString)
		.then(() => {
			if (addToast) {
				addToast('Copied results to clipboard!');
			}
		})
		.catch(() => {
			if (addToast) {
				addToast('Something went wrong while trying to copy to the clipboard.');
			}
		});
}

export function getWritableIntFromStorage(
	localStorage: Storage,
	name: string,
	defaultValue: number = 0
): Writable<number> {
	if (localStorage.getItem(name) === null) {
		return writable(defaultValue);
	} else {
		return writable(parseInt(localStorage.getItem(name)));
	}
}

export function getWritableNumberFromStorage(
	localStorage: Storage,
	name: string,
	defaultValue: number = 0
): Writable<number> {
	if (localStorage.getItem(name) === null) {
		return writable(defaultValue);
	} else {
		return writable(parseFloat(localStorage.getItem(name)));
	}
}

export function getWritableBooleanFromStorage(
	localStorage: Storage,
	name: string,
	defaultValue: boolean = false
): Writable<boolean> {
	if (localStorage.getItem(name) === null) {
		return writable(defaultValue);
	} else {
		return writable(localStorage.getItem(name) === 'true');
	}
}

export function autoUpdateWritableStorage<T>(
	localStorage: Storage,
	name: string,
	writable: Writable<T>
) {
	writable.subscribe((v) => localStorage.setItem(name, `${v}`));
}

export function ordinal(n: number) {
	var s = ['th', 'st', 'nd', 'rd'];
	var v = n % 100;
	return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// `array` should be an array of numbers, where true is a win and false is a lose
export function findMaxStreak(daysArray: [string, DayStatistics][]) {
	const numAndWinArray = daysArray.map(([_, stats]) => {
		return {
			num: stats.word.num,
			won: stats.guessList.some(g => g.guessed && g.feedback.correct)
		};
	});

	if (numAndWinArray.length === 0) return 0;
	if (numAndWinArray.length === 1) {
		if (numAndWinArray[0].won) return 1;
		return 0;
	}

	console.log(numAndWinArray);

	let maxStreak = 0;
	let currentStreak = 0;
	let currentNum = numAndWinArray[0].num;
	for (let i = 0; i < numAndWinArray.length; i++) {
		if (numAndWinArray[i].won && currentNum === numAndWinArray[i].num) {
			currentStreak++;
		} else {
			currentStreak = 0;
			currentNum = numAndWinArray[i].num;
		}
		if (currentStreak > maxStreak) {
			maxStreak = currentStreak;
		}
		currentNum++;
	}

	return maxStreak;
	// let maxStreak = 0;
	// let currentStreak = 0;
	// for (let i = 0; i < array.length; i++) {
	// 	if (array[i]) {
	// 		currentStreak++;
	// 	} else {
	// 		currentStreak = 0;
	// 	}
	// 	if (currentStreak > maxStreak) {
	// 		maxStreak = currentStreak;
	// 	}
	// }
	// return maxStreak;
}

export function findFirstDiscontinuousDay(daysArrayReversed: [string, DayStatistics][]) {
	if (daysArrayReversed.length > 0) {
		let currentDayNum = daysArrayReversed[0][1].word.num;
		for (let i = 0; i < daysArrayReversed.length; i++) {
			const stats = daysArrayReversed[i][1];
			if (stats.word.num !== currentDayNum) return i;
			currentDayNum--;
		};
		return -1;
	}
	return -1;
}
