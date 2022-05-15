<script lang="ts">
	import { toArray } from 'lodash';

	import Tile from './tile.svelte';
	import { type Guess, LetterFeedback, letterLength, type TransitionProps } from './types';

	export let numColumns = letterLength;

	export let animationDuration: number = 0;

	export let rowIndex: number;
	export let guess: Guess;
	export let currentNumAttempts: number;
	export let currentGuessWord: string;
	export let animating: boolean = false;

	function easeFunction(t: number, offset: number = 0) {
		return 1 - Math.cos(Math.PI * t + offset) / 2;
	}

	export let shakeDuration: number = 0;
	export let shouldShake: boolean = false;
	export let currentlyShaking = false;
	function shakeTransition(node: HTMLElement, params: any): TransitionProps {
		if (shouldShake && !currentlyShaking && !animating) {
			currentlyShaking = true;
			return {
				duration: shakeDuration,
				css: (t) => {
					const newT =
						7 *
						Math.exp(-(Math.PI * easeFunction(t, -Math.PI / 2) - Math.PI / 2)) *
						Math.sin(6 * Math.PI * easeFunction(t));
					return `transform: translateX(${newT}px);`;
				},
				tick: (t) => {
					if (t >= 1) {
						shouldShake = false;
						currentlyShaking = false;
					}
				}
			};
		}
	}
</script>

<div class="row" in:shakeTransition>
	{#if guess.guessed}
		{#each toArray(guess.word) as letter, j (j)}
			<Tile
				{letter}
				guessed={guess.guessed}
				animationDelay={j * animationDuration}
				{animationDuration}
				feedback={guess.feedback.hint.letters[j]}
				isWinTile={guess.feedback.correct && !animating}
			/>
		{/each}
	{:else}
		{#each Array(numColumns) as _, j (j)}
			{#if rowIndex === currentNumAttempts}
				<Tile letter={currentGuessWord[j] || ''} feedback={LetterFeedback.None} />
			{:else}
				<Tile letter="" feedback={LetterFeedback.None} />
			{/if}
		{/each}
	{/if}
</div>

<style>
	.row {
		position: relative;
		display: grid;
		grid-template-columns: repeat(var(--num-columns), var(--tile-width));
		grid-auto-flow: column;
		gap: 0.5rem 0.5rem;
	}
</style>
