export const letterLength = 5;

type WordId = string;

export type Word = {
	wordId: WordId;
	word: string;
	date: Date;
	desc: string;
};

export type PlayerWord = Omit<Word, 'word' | 'desc'>;

export enum LetterFeedback {
	None = 0,
	Correct,
	Present,
	Incorrect
}

export type Hint = {
	letters: LetterFeedback[];
};

export type GuessFeedback = {
	correct: boolean;
	hint: Hint;
};

export type Guess =
	| {
			guessed: true;
			attemptNum: number;
			word: string;
			feedback: GuessFeedback;
	  }
	| {
			guessed: false;
	  };

export function getFeedbackClass(feedback: LetterFeedback) {
	if (feedback === LetterFeedback.None) {
		return 'nofeedback';
	} else {
		return LetterFeedback[feedback].toLowerCase();
	}
}

export type TransitionProps = {
	delay?: number;
	duration?: number;
	easing?: (t: number) => number;
	css?: (t: number, u: number) => string;
	tick?: (t: number, u: number) => void;
};

export type DayStatistics = {
	word: PlayerWord;
	guessList: Guess[];
};

export type PlayerStatistics = {
	totalPlays: number;
	totalWins: number;
	currentStreak: number;
	maxStreak: number;
	days: { [key: WordId]: DayStatistics };
};

export interface IDatabase {
	getLatestWord: () => Promise<Word>;
	getLatestPlayerWord: () => Promise<PlayerWord>;
	getWordHistory: () => Promise<Word[]>;
}

export const maxGuesses = 6;
