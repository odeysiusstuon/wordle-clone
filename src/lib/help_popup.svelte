<script lang="ts">
	import Tileset from '$lib/tileset.svelte';
	import { LetterFeedback, type Guess } from '$lib/types';

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

<Tileset numRows={1} guesses={firstGuesses} currentNumAttempts={0} currentGuessWord="" />

<p>
	The letters <strong>V</strong> and <strong>I</strong> are in the word and in the correct spot.
	<br />
	The letter <strong>E</strong> is in the word but in the wrong spot.
</p>

<Tileset numRows={1} guesses={secondGuesses} currentNumAttempts={0} currentGuessWord="" />

<p>The letters <strong>D</strong> and <strong>M</strong> are not in the word in any spot.</p>

<hr />

<p>
	<strong
		>A new BARDLE will be available each day! (Hopefully. Send suggestions to videm#3598).</strong
	>
</p>
