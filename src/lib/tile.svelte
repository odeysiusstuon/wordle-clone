<script lang="ts">
	import { LetterFeedback, getFeedbackClass, type TransitionProps } from './types';

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

{#if guessed && animationDuration > 0}
	{#key guessed}
		<!-- For some reason, this needs to be in a template bracket AND
			template string, otherwise the flip transition does not
			change its class. -->
		<div
			class={`tile guessed`}
			class:win={isWinTile}
			style={`--delay: ${animationDelay}ms;`}
			in:flip
		>
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
		background-color: transparent;
		outline: #3a3a3c solid 2px;
	}

	.tile.tbd {
		background-color: transparent;
		outline: #525256 solid 2px;
	}

	.tile.correct {
		background-color: #538d4e;
		outline: #538d4e solid 2px;
	}

	.tile.present {
		background-color: #b59f3b;
		outline: #b59f3b solid 2px;
	}

	.tile.incorrect {
		background-color: #3a3a3c;
		outline: #3a3a3c solid 2px;
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
