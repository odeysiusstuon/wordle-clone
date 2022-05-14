<script lang="ts">
	import { LetterFeedback, tileColors } from './types';

	const tileOutlines: { [key in LetterFeedback]: string } = {
		[LetterFeedback.None]: '#3a3a3c solid 2px',
		[LetterFeedback.Correct]: 'none',
		[LetterFeedback.Present]: 'none',
		[LetterFeedback.Incorrect]: 'none'
	};

	type TransitionProps = {
		delay?: number;
		duration?: number;
		easing?: (t: number) => number;
		css?: (t: number, u: number) => string;
		tick?: (t: number, u: number) => void;
	};

	export let letterFeedback: LetterFeedback = LetterFeedback.None;
	export let letter: string = '';
	export let animationDelay: number = 0;
	export let animationDuration: number = 0;
	export let guessed: boolean = false;

	function flip(node: HTMLElement, params: any): TransitionProps {
		return {
			delay: animationDelay,
			duration: animationDuration,
			css: (t) => {
				const newT = 2 * Math.abs(t - 0.5);

				let backgroundColor: string;
				if (t > 0.5) {
					backgroundColor = tileColors[letterFeedback];
				} else {
					backgroundColor = tileColors[LetterFeedback.None];
				}

				let outline: string;
				if (t > 0.5) {
					outline = tileOutlines[letterFeedback];
				} else {
					outline = tileOutlines[LetterFeedback.None];
				}

				return `transform: scaleY(${newT}); background-color: ${backgroundColor}; outline: ${outline};`;
			}
		};
	}
</script>

{#if guessed}
	{#key guessed}
		<div
			class="tile"
			transition:flip
			style={`--tile-color: ${tileColors[letterFeedback]}; --tile-outline: ${tileOutlines[letterFeedback]};`}
		>
			{letter}
		</div>
	{/key}
{:else}
	<div
		class="tile"
		style={`--tile-color: ${tileColors[letterFeedback]}; --tile-outline: ${tileOutlines[letterFeedback]};`}
	>
		{letter}
	</div>
{/if}

<style>
	.tile {
		background-color: var(--tile-color);
		outline: var(--tile-outline);
		color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		font-family: 'Clear Sans', 'Helvetica Neue', Arial, sans-serif;
		font-size: 2rem;
		text-transform: uppercase;
		user-select: none;
	}
</style>
