<script lang="ts">
	import { getFeedbackClass, type LetterFeedback } from './types';

	export let dataCode: string;
	export let dataKey: string;
	export let fontSize: string = '14px';
	export let flex: string = '1';
	export let feedback: LetterFeedback;
</script>

<button
	class={`key ${getFeedbackClass(feedback)}`}
	data-code={dataCode}
	data-key={dataKey}
	on:click
	style={`--font-size: ${fontSize}; --flex: ${flex};`}
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
		font-family: 'Clear Sans', 'Helvetica Neue', Arial, sans-serif;
		font-size: var(--font-size);
		font-weight: bold;
		text-transform: uppercase;
		user-select: none;
	}

	.key.nofeedback {
		background-color: #818384;
	}

	.key.correct {
		background-color: #538d4e;
	}

	.key.present {
		background-color: #b59f3b;
	}

	.key.incorrect {
		background-color: #3a3a3c;
	}
</style>
