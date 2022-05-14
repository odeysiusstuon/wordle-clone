import { db } from '$db/db';
import { LetterFeedback, type GuessFeedback, type Hint } from '$lib/types';
import type { Dictionary } from 'lodash';
import countBy from 'lodash/countBy';

type LetterCount = Dictionary<number>;

function isCorrect(letter: string, guessLetter: string) {
	return letter === guessLetter;
}

function isWrongSpot(
	letter: string,
	guessLetter: string,
	wordLetterCount: LetterCount,
	correctCount: LetterCount
) {
	if (isCorrect(letter, guessLetter) || !(guessLetter in wordLetterCount)) return false;
	if (guessLetter in correctCount) {
		return wordLetterCount[guessLetter] < correctCount[guessLetter];
	} else {
		return true;
	}
}

function countCorrect(word: string, guess: string): LetterCount {
	return countBy(
		Array.from(word).filter((letter, i) => {
			return isCorrect(letter, guess[i]);
		})
	);
}

function createHint(word: string, guess: string): Hint {
	const wordLetterCount = countBy(word);
	const correctCount = countCorrect(word, guess);

	const letters: LetterFeedback[] = Array.from(word).map<LetterFeedback>((letter, i) => {
		const guessLetter = guess[i];
		if (isCorrect(letter, guessLetter)) {
			return LetterFeedback.Correct;
		} else if (isWrongSpot(letter, guessLetter, wordLetterCount, correctCount)) {
			return LetterFeedback.Present;
		} else {
			return LetterFeedback.Incorrect;
		}
	});

	return {
		letters
	};
}

/** @type {import('./validate').RequestHandler} */
export async function get({ request }) {
	const word = await db.getLatestWord();
	const guess = new URL(request.url).searchParams.get('guess');
	if (word && guess) {
		const wordString = word.word;
		const correct = wordString === guess;
		const hint = createHint(wordString, guess);
		const feedback: GuessFeedback = {
			correct,
			hint
		};

		return {
			body: {
				feedback
			}
		};
	}

	return {
		status: 404,
		error: new Error('Could not load the latest word')
	};
}
