<script lang="ts">
	import { getFeedbackClass, type LetterFeedback } from './types';

	export let dataCode: string;
	export let dataKey: string;
	export let flex: string;
	export let feedback: LetterFeedback;
</script>

<button
	class={`key ${getFeedbackClass(feedback)}`}
	style={`--flex: ${flex}`}
	data-code={dataCode}
	data-key={dataKey}
	on:click
>
	<slot />
</button>

<style>
	.key {
		font-family: var(--tile-font-family);
		color: #fff;
		border: 0;
		border-radius: 4px;
		flex: var(--flex);
		height: 58px;
		min-width: 5%;
		display: flex;
		cursor: pointer;
		margin: 0 6px 0 0;
		outline: none;
		justify-content: center;
		align-items: center;
		font-weight: bold;
		text-transform: uppercase;
		user-select: none;
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0.3);
	}

	.key:focus {
		outline: none;
	}

	.key:last-of-type {
		margin: 0;
	}

	.key.nofeedback {
		background-color: var(--key-nofeedback-color);
	}

	.key.correct {
		background-color: var(--key-correct-color);
	}

	.key.present {
		background-color: var(--key-present-color);
	}

	.key.incorrect {
		background-color: var(--key-incorrect-color);
	}
</style>
