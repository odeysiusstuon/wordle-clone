<script lang="ts">
	import { getFeedbackClass, type LetterFeedback } from './types';

	export let dataCode: string;
	export let dataKey: string;
	export let feedback: LetterFeedback;
</script>

<button
	class={`key ${getFeedbackClass(feedback)}`}
	data-code={dataCode}
	data-key={dataKey}
	on:click
>
	<slot />
</button>

<style>
	.key {
		color: #fff;
		border-radius: 4px;
		flex: var(--flex);
		height: 58px;
		display: flex;
		cursor: pointer;
		margin: 0 6px 0 0;
		outline: none;
		justify-content: center;
		align-items: center;
		font-family: var(--tile-font-family);
		font-size: var(--font-size);
		font-weight: bold;
		text-transform: uppercase;
		user-select: none;
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
