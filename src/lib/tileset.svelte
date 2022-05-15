<script lang="ts">
	import { type Guess, letterLength, type TransitionProps } from './types';
	import TilesetRow from '$lib/tileset_row.svelte';
	import { debounce } from 'lodash';

	export let numRows = 6;
	export let numColumns = letterLength;

	export let tileWidth: string = '60px';

	export let animationDuration: number = 0;

	export let guesses: Guess[];
	export let currentNumAttempts: number;
	export let currentGuessWord: string;
	export let animating: boolean = false;

	const shakeDuration = 500;

	// I really don't like this solution for manually
	// triggering the render :/
	// https://stackoverflow.com/questions/59062025/is-there-a-way-to-perform-svelte-transition-without-a-if-block
	let shakeKey = {};
	export const shakeLatestRow = debounce(() => (shakeKey = {}), shakeDuration, {
		leading: true,
		trailing: false,
		maxWait: shakeDuration
	});
</script>

<div class="tileset">
	{#each guesses as guess, rowIndex}
		{#if rowIndex === currentNumAttempts}
			{#key shakeKey}
				<TilesetRow
					{guess}
					{rowIndex}
					{numColumns}
					{animationDuration}
					{currentNumAttempts}
					{currentGuessWord}
					{animating}
					{shakeDuration}
					--num-columns={numColumns}
					--tile-width={tileWidth}
					shouldShake
				/>
			{/key}
		{:else}
			<TilesetRow
				{guess}
				{rowIndex}
				{numColumns}
				{animationDuration}
				{currentNumAttempts}
				{currentGuessWord}
				{animating}
				--num-columns={numColumns}
				--tile-width={tileWidth}
			/>
		{/if}
	{/each}
</div>

<style>
	.tileset {
		display: grid;
		grid-template-rows: repeat(var(--num-rows), var(--tile-height));
		grid-auto-flow: row;
		gap: 0.5rem 0.5rem;
	}
</style>
