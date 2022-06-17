<script lang="ts">
	import lodash from 'lodash';
	const { toArray } = lodash;
	import { createEventDispatcher } from 'svelte';

	import Key from './key.svelte';
	import { characterToKey } from './utils';
	import { LetterFeedback, type Guess } from './types';

	export let guesses: Guess[];
	export let keyboardMap: string;
	export let disabled: boolean = false;

	const keyboard = keyboardMap.split('\n').map((row) => {
		return toArray(row).map((character) => {
			if (character === '↵') {
				return {
					display: 'Enter',
					backspace: false,
					flex: '1.5',
					'data-code': 'Enter',
					'data-key': '↵'
				};
			}
			if (character === '←') {
				return {
					display: 'Backspace',
					backspace: true,
					flex: '1.5',
					'data-code': 'Backspace',
					'data-key': '←'
				};
			}
			return {
				display: character,
				backspace: false,
				flex: '1',
				'data-code': characterToKey(character),
				'data-key': character
			};
		});
	});

	const keyPressDispatch = createEventDispatcher();
	function onKeyPress() {
		if (disabled) return;
		keyPressDispatch('keypress', {
			code: this.attributes['data-code'].value,
			key: this.attributes['data-key']?.value
		});
	}

	// Have to pass in guesses to make the element reactive.
	// There is most likely a better way of approaching this.
	function characterHasFeedback(guesses: Guess[], character: string, feedback: LetterFeedback) {
		return guesses.some((guess) => {
			if (!guess.guessed) return;
			return toArray(guess.word).some((letter, i) => {
				return letter === character && guess.feedback.hint.letters[i] === feedback;
			});
		});
	}

	// Have to pass in guesses to make the element reactive.
	// There is most likely a better way of approaching this.
	function getKeyFeedback(guesses: Guess[], character: string) {
		for (const feedback of [
			LetterFeedback.Correct,
			LetterFeedback.Present,
			LetterFeedback.Incorrect,
			LetterFeedback.None
		]) {
			if (characterHasFeedback(guesses, character, feedback)) {
				return feedback;
			}
		}
		return LetterFeedback.None;
	}
</script>

<div class="keyboard">
	{#each keyboard as row, i (i)}
		<div class="row">
			{#each row as character (character.display)}
				{#if character.backspace}
					<Key
						dataCode={character['data-code']}
						dataKey={character['data-key']}
						feedback={LetterFeedback.None}
						on:click={onKeyPress}
						--font-size="12px"
						--flex={character.flex}><span class="material-symbols-outlined"> backspace </span></Key
					>
				{:else}
					<Key
						dataCode={character['data-code']}
						dataKey={character['data-key']}
						feedback={getKeyFeedback(guesses, character.display)}
						on:click={onKeyPress}
						--font-size={character.display.length > 1 ? '12px' : undefined}
						--flex={character.flex}>{character.display}</Key
					>
				{/if}
			{/each}
		</div>
	{/each}
</div>

<style>
	.keyboard {
		display: block;
		margin: 0 8px;
		width: 600px;
	}

	@media all and (max-width: 600px) {
		.keyboard {
			width: 90vw;
		}
	}

	.row {
		display: flex;
		justify-content: center;
		margin: 0 auto 8px;
	}
</style>
