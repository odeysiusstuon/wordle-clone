<script lang="ts">
	import { toArray } from 'lodash';

	import Tile from './tile.svelte';
	import { type Guess, LetterFeedback, letterLength } from './types';

	export let numRows = 6;
	export let numColumns = letterLength;

	export let tileWidth: string = '60px';
	export let tileHeight: string = '60px';

	export let animationDuration: number;

	export let guesses: Guess[];
	export let currentNumAttempts: number;
	export let currentGuessWord: string;

	let rootElement: HTMLDivElement;
	$: {
		if (rootElement) {
			rootElement.style.setProperty('--num-rows', numRows.toString());
			rootElement.style.setProperty('--num-columns', numColumns.toString());
			rootElement.style.setProperty('--tile-width', tileWidth.toString());
			rootElement.style.setProperty('--tile-height', tileHeight.toString());
		}
	}

	$: console.log(guesses);
</script>

<div class="tileset" bind:this={rootElement}>
	{#each guesses as guess, i}
		{#if guess.guessed}
			{#each toArray(guess.word) as letter, j (j)}
				<Tile
					{letter}
					guessed={guess.guessed}
					animationDelay={j * animationDuration}
					{animationDuration}
					letterFeedback={guess.feedback.hint.letters[j]}
				/>
			{/each}
		{:else}
			{#each Array(numColumns) as _, j (j)}
				{#if i === currentNumAttempts}
					<Tile letter={currentGuessWord[j] || ''} letterFeedback={LetterFeedback.None} />
				{:else}
					<Tile letter="" letterFeedback={LetterFeedback.None} />
				{/if}
			{/each}
		{/if}
	{/each}
</div>

<style>
	.tileset {
		display: grid;
		grid-template-rows: repeat(var(--num-rows), var(--tile-height));
		grid-template-columns: repeat(var(--num-columns), var(--tile-width));
		grid-auto-flow: row;
		gap: 10px 10px;
	}
</style>
