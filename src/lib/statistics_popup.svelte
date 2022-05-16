<script lang="ts">
	import { statisticsStore } from '$lib/stores/statistics_store';
	import moment from 'moment';
	import type { Readable } from 'svelte/store';
	import countdownStore from './stores/countdown_store';
	import { Circle2 } from 'svelte-loading-spinners';

	import { nextUrl, type PlayerWord } from './types';
	import { copyGuessesToClipboard } from './utils';
	import { nextWord } from './stores/cache_store';

	export let currentWord: PlayerWord;
	export let showShareButton: boolean = false;
	export let showNextWordTime: boolean = false;
	export let addToast: (message: string) => void;

	let clock: Readable<number>;

	async function getNextWord() {
		if ($nextWord) {
			clock = countdownStore(moment($nextWord.date));
			return $nextWord;
		}

		const res = await fetch(nextUrl);

		if (res.ok) {
			const { word } = await res.json();
			nextWord.set(word);
			clock = countdownStore(moment($nextWord.date));
			return nextWord;
		} else {
			throw new Error(await res.text());
		}
	}

	let nextWordPromise = getNextWord();

	function formatNextWordCountdown(diff: number) {
		if (diff <= 0) {
			return 'refresh ur page lol';
		}
		let countdownText = '';
		const diffDays = Math.floor(moment.duration(diff).asDays());
		const momentDiff = moment.utc(diff);

		if (diffDays > 0) {
			countdownText += `in (${diffDays} day${diffDays === 1 ? '' : 's'} and) `;
		}

		countdownText += momentDiff.format('HH:mm:ss');

		return countdownText;
	}
</script>

<div class="container">
	<h1>Statistics</h1>

	<div class="graph">
		<!-- TODO: Make statistics graph -->
	</div>

	<div class="statistics">
		<div class="stat total-plays">
			{statisticsStore.getTotalPlays()}
			<p class="label">Played</p>
		</div>

		<div class="stat total-won">
			{statisticsStore.getTotalWins()}
			<p class="label">Won</p>
		</div>

		<div class="stat win-rate">
			{Math.round((statisticsStore.getTotalWins() / statisticsStore.getTotalPlays()) * 10000) /
				100}%
			<p class="label">Win Rate</p>
		</div>

		<div class="stat current-streak">
			{statisticsStore.getCurrentStreak()}
			<p class="label">Current Streak</p>
		</div>

		<div class="stat max-streak">
			{statisticsStore.getMaxStreak()}
			<p class="label">Max Streak</p>
		</div>
	</div>

	{#if showShareButton || showNextWordTime}
		<div class="share-time-container">
			{#if showNextWordTime}
				<div
					class="next-word-time-container"
					style={`--margin-right=${showShareButton ? '20px' : '0'};`}
				>
					<h2>Next BARdle</h2>
					<h1 class="next-word-time">
						{#await nextWordPromise}
							<Circle2 colorInner="#8080ff" colorOuter="transparent" colorCenter="#e1221a" />
						{:then _}
							{formatNextWordCountdown($clock)}
						{:catch}
							N/A 😌
						{/await}
					</h1>
				</div>
			{/if}

			{#if showShareButton && showNextWordTime}
				<div class="divider" />
			{/if}

			{#if showShareButton}
				<button
					class="share-button"
					on:click={() => copyGuessesToClipboard(statisticsStore, currentWord, addToast)}
				>
					<div class="share-button-inner">
						Share
						<span class="material-symbols-outlined share-symbol"> share </span>
					</div>
				</button>
			{/if}
		</div>
	{/if}
</div>

<style>
	.container {
		display: grid;
		grid: auto-flow / 100%;
		justify-items: center;
		row-gap: 20px;
	}

	h1 {
		text-align: center;
		margin: 0;
	}

	.statistics {
		text-emphasis: true;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		flex-flow: wrap;
		justify-content: space-evenly;
		font-size: 2rem;
		font-weight: bold;
		width: 80%;
	}

	.stat {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		flex-flow: wrap;
		flex-basis: 30%;
		font-family: var(--wordle-font-family);
	}

	.label {
		color: darkgrey;
		font-size: 1rem;
		font-weight: 100;
		margin: 0;
		flex-basis: 100%;
		text-align: center;
	}

	.share-time-container {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.next-word-time-container {
		display: flex;
		text-align: center;
		flex-flow: column wrap;
		/* margin-right: 20px; */
		font-family: var(--wordle-font-family);
	}

	.next-word-time {
		display: flex;
		justify-content: center;
	}

	.next-word-time-container > h2,
	.next-word-time-container > h1 {
		margin: 0;
	}

	.divider {
		border-left: 2px solid white;
		margin: 10px;
		opacity: 0.5;
		height: 80%;
		flex-basis: 0;
	}

	.share-button-inner {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 10px;
	}

	.share-symbol {
		margin-left: 5px;
	}

	.share-button {
		margin: 15px;
		background-color: var(--correct-tile-background-color);
		font-size: 1rem;
		border-radius: 0.5em;
		border-style: none;
		color: #fff;
		cursor: pointer;
		user-select: none;
	}
</style>
