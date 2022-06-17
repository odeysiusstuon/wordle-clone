<script lang="ts">
	import { LetterFeedback, getFeedbackClass, type TransitionProps } from '$lib/types';
	import { onMount } from 'svelte';

	export let feedback: LetterFeedback = LetterFeedback.None;
	export let letter: string = '';
	export let animateFinishedRefresh: boolean = false;
	export let animationDelay: number = 0;
	export let animationDuration: number = 0;
	export let guessed: boolean = false;
	export let isWinTile: boolean = false;
	export let deactivated: boolean = false;
	let forceAnimateFinishedRefresh = false;
	let isAnimating = false;

	function flip(node: HTMLElement, params: any): TransitionProps {
		isAnimating = true;
		return {
			delay: animationDelay / (animateFinishedRefresh ? 3 : 1),
			duration: animationDuration,
			css: (t) => {
				const newT = 2 * Math.abs(t - 0.5);
				return `transform: scaleY(${newT});`;
			},
			tick: (t) => {
				if (t > 0.5) {
					node.classList.remove('guessed');
					node.classList.add(getFeedbackClass(feedback));
				}
				if (t >= 1) {
					isAnimating = false;
				}
			}
		};
	}

	function bounce(node: HTMLElement, params: any): TransitionProps {
		return {
			duration: 75,
			css: (t) => {
				const newT = -0.3 * Math.abs(t - 0.5) + 1.15;
				return `transform: scale(${newT}, ${newT})`;
			}
		};
	}

	onMount(() => {
		forceAnimateFinishedRefresh = true;
	});
</script>

{#if guessed}
	{#if animateFinishedRefresh && forceAnimateFinishedRefresh}
		<div
			class={`tile guessed ${isAnimating ? '' : getFeedbackClass(feedback)}`}
			class:deactivated
			in:flip
		>
			{letter}
		</div>
	{:else}
		{#key guessed}
			<div
				class={`tile guessed ${isAnimating ? '' : getFeedbackClass(feedback)}`}
				class:win={isWinTile}
				class:deactivated
				in:flip
			>
				{letter}
			</div>
		{/key}
	{/if}
{:else if letter.length > 0}
	{#if animateFinishedRefresh}
		<div class="tile tbd" class:deactivated in:flip>
			{letter}
		</div>
	{:else}
		<div class="tile tbd" class:deactivated in:bounce>
			{letter}
		</div>
	{/if}
{:else if animateFinishedRefresh}
	<div class="tile empty" class:deactivated in:flip>
		{letter}
	</div>
{:else}
	<div class="tile empty" class:deactivated>
		{letter}
	</div>
{/if}

<style>
	.tile {
		/* background-color: var(--tile-color);
		outline: var(--tile-outline); */
		color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		font-family: var(--tile-font-family);
		font-size: 2rem;
		flex: 1;
		text-transform: uppercase;
		user-select: none;
		width: calc(60px - max(0px, 0.15 * (750px - 100vh), 0.25 * (380px - 100vw)));
		height: calc(60px - max(0px, 0.15 * (750px - 100vh), 0.25 * (380px - 100vw)));
	}

	/* @media all and (max-height: 750px) {
		.tile {
			width: min(calc(60px - 0.15 * (750px - 100vh)), calc(60px - 0.15 * (350 - 100vw)));
			height: min(calc(60px - 0.15 * (750px - 100vh)), calc(60px - 0.15 * (350 - 100vw)));
			font-size: min(calc(2rem - 0.1 * (750px - 100vh)), calc(2rem - 0.1 * (350 - 100vw)));
		}
	}

	@media all and (max-width: 350px) {
		.tile {
			width: min(calc(60px - 0.15 * (750px - 100vh)), calc(60px - 0.15 * (350 - 100vw)));
			height: min(calc(60px - 0.15 * (750px - 100vh)), calc(60px - 0.15 * (350 - 100vw)));
			font-size: min(calc(2rem - 0.1 * (750px - 100vh)), calc(2rem - 0.1 * (350 - 100vw)));
		}
	} */

	.tile.deactivated {
		color: #777;
	}

	.tile.empty,
	.tile.guessed {
		background-color: var(--empty-tile-background-color);
		outline: var(--empty-tile-outline);
	}

	.tile.tbd {
		background-color: var(--tbd-tile-background-color);
		outline: var(--tbd-tile-outline);
	}

	.tile.correct {
		background-color: var(--correct-tile-background-color);
		outline: var(--correct-tile-outline);
	}

	.tile.present {
		background-color: var(--present-tile-background-color);
		outline: var(--present-tile-outline);
	}

	.tile.incorrect {
		background-color: var(--incorrect-tile-background-color);
		outline: var(--incorrect-tile-outline);
	}

	.tile.win {
		animation-name: bounce;
		animation-delay: calc(var(--delay) / 3);
		animation-timing-function: ease;
		animation-duration: 0.75s;
	}

	@keyframes bounce {
		0% {
			transform: translateY(0);
		}
		20% {
			transform: translateY(-25px);
		}
		30% {
			transform: translateY(-25px);
		}
		40% {
			transform: translateY(5px);
		}
		50% {
			transform: translateY(-10px);
		}
		100% {
			transform: translateY(0);
		}
	}
</style>
