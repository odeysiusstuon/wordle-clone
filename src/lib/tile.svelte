<script lang="ts">
	import { LetterFeedback, getFeedbackClass, type TransitionProps } from '$lib/types';

	export let feedback: LetterFeedback = LetterFeedback.None;
	export let letter: string = '';
	export let animationDelay: number = 0;
	export let animationDuration: number = 0;
	export let guessed: boolean = false;
	export let isWinTile: boolean = false;

	function flip(node: HTMLElement, params: any): TransitionProps {
		return {
			delay: animationDelay,
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
</script>

{#if guessed}
	{#key guessed}
		<!-- For some reason, this needs to be in a template bracket AND
			template string, otherwise the flip transition does not
			change its class. -->
		<div class={`tile guessed`} class:win={isWinTile} in:flip>
			{letter}
		</div>
	{/key}
{:else if letter.length > 0}
	<div class="tile tbd" in:bounce>
		{letter}
	</div>
{:else}
	<div class="tile empty">
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
		font-family: 'Clear Sans', 'Helvetica Neue', Arial, sans-serif;
		font-size: 2rem;
		text-transform: uppercase;
		user-select: none;
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
