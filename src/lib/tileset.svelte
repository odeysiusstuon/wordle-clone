<script lang="ts">
	import { type Guess, letterLength } from './types';
	import TilesetRow from '$lib/tileset_row.svelte';
	import lodash from 'lodash';
	const { debounce } = lodash;

	export let numColumns = letterLength;

	export let width: string = '100%';
	export let gap: string = '8px';

	export let animationDuration: number = 0;

	// Makes tiles without feedback always show as
	// tbd tiles (i.e., tiles with outlines), even
	// when a "guess" is present for the tile.
	// This is especially useful for static tiles, as
	// is shown in the help popup.
	export const alwaysShowTbdTiles: boolean = false;

	export let guesses: Guess[];
	export let currentNumAttempts: number;
	export let currentGuessWord: string;
	export let animating: boolean = false;
	export let shakingAllowed: boolean = false;
	export let currentRowDeactivated: boolean = false;

	export let animateFinishedRefresh: boolean = false;

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

<div class="tileset" style={`--gap: ${gap};`}>
	{#each guesses as guess, rowIndex}
		{#if rowIndex === currentNumAttempts && shakingAllowed}
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
					{animateFinishedRefresh}
					deactivated={currentRowDeactivated}
					shouldShake
					alwaysShowTbdTiles
					--num-columns={numColumns}
					--width={width}
					--gap={gap}
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
				{animateFinishedRefresh}
				alwaysShowTbdTiles
				--num-columns={numColumns}
				--width={width}
				--gap={gap}
			/>
		{/if}
	{/each}
</div>

<style>
	.tileset {
		display: grid;
		grid-auto-flow: row;
		gap: var(--gap);
		/* display: flex;
		flex-direction: column;
		gap: 0.5rem 0.5rem; */
	}

	.tileset {
		grid-template-rows: repeat(var(--num-rows), 1fr);
	}
</style>
