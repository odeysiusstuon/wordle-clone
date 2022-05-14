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

export const tileColors: { [key in LetterFeedback]: string } = {
	[LetterFeedback.None]: 'transparent',
	[LetterFeedback.Correct]: '#538d4e',
	[LetterFeedback.Present]: '#b59f3b',
	[LetterFeedback.Incorrect]: '#3a3a3c'
};

export const keyColors: { [key in LetterFeedback]: string } = {
	[LetterFeedback.None]: '#818384',
	[LetterFeedback.Correct]: '#538d4e',
	[LetterFeedback.Present]: '#b59f3b',
	[LetterFeedback.Incorrect]: '#3a3a3c'
};

export interface IDatabase {
	getLatestWord: () => Promise<Word>;
	getWordHistory: () => Promise<[Word]>;
}
