export type Word = {
	word: string;
	date: Date;
	desc: string;
};

export enum LetterFeedback {
	Correct = 0,
	WrongSpot,
	Incorrect,
}

export type Hint = {
	letters: LetterFeedback[];
}

export type GuessFeedback = {
	correct: boolean;
	hint: Hint;
};

export interface IDatabase {
	getLatestWord: () => Promise<Word>;
	getWordHistory: () => Promise<[Word]>;
}
