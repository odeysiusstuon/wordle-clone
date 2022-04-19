import { db } from '$db/db';
import { LetterFeedback, type GuessFeedback, type Hint } from '$lib/types';

function createHint(word: string, guess: string): Hint {
  const wordLetters = new Set(word);
  const letters: LetterFeedback[] = Array.from(word).map<LetterFeedback>((letter, i) => {
    const guessLetter = guess[i];
    if (guessLetter === letter) {
      return LetterFeedback.Correct;
    } else if (wordLetters.has(guessLetter)) {
      return LetterFeedback.WrongSpot;
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
      hint,
    };
    
    return {
      body: {
        feedback
      },
    };
  }

  return {
    status: 404,
  };
}
