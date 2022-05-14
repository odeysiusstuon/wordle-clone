<script lang="ts" context="module">
	export async function load({ fetch }) {
		const url = '/word.json';
		const res = await fetch(url);

		if (res.ok) {
			const { word } = await res.json();

			return {
				status: res.status,
				props: {
					word
				}
			};
		} else {
			return {
				status: res.status,
				error: res.error
			};
		}
	}
</script>

<script lang="ts">
	import Header from '$lib/header.svelte';
	import Tileset from '$lib/tileset.svelte';
	import { type Guess, type GuessFeedback, type Word, letterLength } from '$lib/types';
	import '../styles/global.css';

	const validateUrl = '/word/validate.json';

	export let word: Word;

	const maxGuesses = 6;
	const animationDuration = 400;

	let guesses: Guess[] = new Array(maxGuesses);
	for (let i = 0; i < maxGuesses; i++) {
		guesses[i] = {
			guessed: false
		};
	}
	let currentGuessWord = '';
	let currentNumAttempts = 0;

	let latestGuess: Guess;

	let animating: boolean = false;

	let canGuess: boolean = true;
	$: canGuess =
		currentNumAttempts < maxGuesses &&
		(!latestGuess ||
			!latestGuess.guessed ||
			(latestGuess.guessed && !latestGuess.feedback.correct)) &&
		!animating;

	async function onGuess() {
		if (canGuess && currentGuessWord.length === letterLength) {
			const res = await fetch(`${validateUrl}?guess=${currentGuessWord}`);
			const { feedback }: { feedback: GuessFeedback } = await res.json();
			currentNumAttempts++;
			const guess = {
				guessed: true,
				attemptNum: currentNumAttempts,
				word: currentGuessWord,
				feedback
			};
			currentGuessWord = '';
			guesses[currentNumAttempts - 1] = guess;
			latestGuess = guess;

			animating = true;
			setTimeout(() => (animating = false), animationDuration * letterLength);
		}
	}
</script>

<div class="main">
	<Header title="BARdle" />
	<br />
	The word is <strong>{word.word}</strong>
	<br />
	{#if currentNumAttempts > 0 && latestGuess}
		That guess is {latestGuess.guessed && latestGuess.feedback.correct
			? 'correct!'
			: 'not correct!'}
		<br />
	{/if}
	<Tileset {guesses} numRows={maxGuesses} {animationDuration} />
	{#if currentNumAttempts === 0}
		Guess a word!
	{/if}
	{#if currentNumAttempts >= maxGuesses}
		You have no more attempts left!
		<br />
	{/if}
	<input
		type="text"
		maxlength={letterLength}
		on:change={onGuess}
		disabled={!canGuess}
		bind:value={currentGuessWord}
	/>
</div>
