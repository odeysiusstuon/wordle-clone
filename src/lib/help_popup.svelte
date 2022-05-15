<script lang="ts">
	import Tileset from '$lib/tileset.svelte';
	import { LetterFeedback, letterLength, type Guess } from '$lib/types';

	const firstGuesses: Guess[] = [
		{
			guessed: true,
			word: 'videm',
			attemptNum: 1,
			feedback: {
				correct: false,
				hint: {
					letters: [
						LetterFeedback.Correct,
						LetterFeedback.Correct,
						LetterFeedback.None,
						LetterFeedback.Present,
						LetterFeedback.None
					]
				}
			}
		}
	];

	const secondGuesses: Guess[] = [
		{
			guessed: true,
			word: 'videm',
			attemptNum: 1,
			feedback: {
				correct: false,
				hint: {
					letters: [
						LetterFeedback.None,
						LetterFeedback.None,
						LetterFeedback.Incorrect,
						LetterFeedback.None,
						LetterFeedback.Incorrect
					]
				}
			}
		}
	];
</script>

<p>Guess the BARDLE in six tries.</p>

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
	--num-rows={1}
	--num-columns={letterLength}
	--tile-height="60px"
/>

<p>
	The letters <strong>V</strong> and <strong>I</strong> are in the word and in the correct spot.
	<br />
	The letter <strong>E</strong> is in the word but in the wrong spot.
</p>

<Tileset
	guesses={secondGuesses}
	currentNumAttempts={0}
	currentGuessWord=""
	alwaysShowTbdTiles
	--num-rows={1}
	--num-columns={letterLength}
	--tile-height="60px"
/>

<p>The letters <strong>D</strong> and <strong>M</strong> are not in the word in any spot.</p>

(Note: If you use a different tile color them from the default WORDLE one, this is a helpful guide
for understanding what tile colors represent what).

<hr />

<p>
	<strong
		>A new BARDLE will be available each day! (Hopefully. Send suggestions to videm#3598).</strong
	>
</p>
