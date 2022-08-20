<script lang="ts">
	import Tileset from '$lib/tileset.svelte';
	import { LetterFeedback, letterLength, type Guess } from '$lib/types';

	const firstGuesses: Guess[] = [
		{
			guessed: true,
			word: 'weary',
			attemptNum: 1,
			feedback: {
				correct: false,
				hint: {
					letters: [
						LetterFeedback.Correct,
						LetterFeedback.None,
						LetterFeedback.None,
						LetterFeedback.None,
						LetterFeedback.None
					]
				}
			}
		}
	];

	const secondGuesses: Guess[] = [
		{
			guessed: true,
			word: 'pills',
			attemptNum: 1,
			feedback: {
				correct: false,
				hint: {
					letters: [
						LetterFeedback.None,
						LetterFeedback.Present,
						LetterFeedback.None,
						LetterFeedback.None,
						LetterFeedback.None
					]
				}
			}
		}
	];

	const thirdGuesses: Guess[] = [
		{
			guessed: true,
			word: 'vague',
			attemptNum: 1,
			feedback: {
				correct: false,
				hint: {
					letters: [
						LetterFeedback.None,
						LetterFeedback.None,
						LetterFeedback.None,
						LetterFeedback.Incorrect,
						LetterFeedback.None
					]
				}
			}
		}
	];
</script>

<p>Guess the <strong>WORDLE</strong> in six tries.</p>

<p>Each guess must be a valid five-letter word. Hit the enter button to submit.</p>

<p>
	After each guess, the color of the tiles will change to show how close your guess was to the word.
</p>

<hr />

<p><strong>Examples</strong></p>

<Tileset
	guesses={firstGuesses}
	currentNumAttempts={0}
	currentGuessWord=""
	alwaysShowTbdTiles
	width={`${5 * 60 + 8 * 4}px`}
	gap="8px"
	--num-rows={1}
	--num-columns={letterLength}
/>

<p>
	The letter <strong>W</strong> is in the word and in the correct spot.
</p>

<Tileset
	guesses={secondGuesses}
	currentNumAttempts={0}
	currentGuessWord=""
	alwaysShowTbdTiles
	width={`${5 * 60 + 8 * 4}px`}
	gap="8px"
	--num-rows={1}
	--num-columns={letterLength}
/>

<p>The letter <strong>I</strong> is in the word but in the wrong spot.</p>

<Tileset
	guesses={thirdGuesses}
	currentNumAttempts={0}
	currentGuessWord=""
	alwaysShowTbdTiles
	width={`${5 * 60 + 8 * 4}px`}
	gap="8px"
	--num-rows={1}
	--num-columns={letterLength}
/>

<p>The letter <strong>U</strong> is not in the word in any spot.</p>

<hr />

<p>
	<strong
		>A new WORDLE will be available each day! (Contact: odeysiuss@gmail.com)</strong
	>
</p>
