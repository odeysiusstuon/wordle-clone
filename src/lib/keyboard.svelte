<script lang="ts">
	import { toArray } from 'lodash';
	import { createEventDispatcher } from 'svelte';
	import { Keyboard } from '@etsoo/shared';

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
					'data-code': Keyboard.Codes.Enter,
					'data-key': '↵'
				};
			}
			if (character === '←') {
				return {
					display: 'Backspace',
					backspace: true,
					flex: '1.5',
					'data-code': Keyboard.Codes.Backspace,
					'data-key': '←'
				};
			}
			return {
				display: character,
				backspace: false,
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
						flex={character.flex}
						feedback={LetterFeedback.None}
						fontSize="12px"
						on:click={onKeyPress}><span class="material-symbols-outlined"> backspace </span></Key
					>
				{:else}
					<Key
						dataCode={character['data-code']}
						dataKey={character['data-key']}
						flex={character.flex}
						feedback={getKeyFeedback(guesses, character.display)}
						fontSize={character.display.length > 1 ? '12px' : undefined}
						on:click={onKeyPress}>{character.display}</Key
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

	.row {
		display: flex;
		margin: 0 auto 8px;
	}
</style>
