export const letterLength = 5;

export type Word = {
	word: string;
	date: Date;
	desc: string;
};

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

export interface IDatabase {
	getLatestWord: () => Promise<Word>;
	getWordHistory: () => Promise<[Word]>;
}
