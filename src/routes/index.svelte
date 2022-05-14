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
	import Keyboard from '$lib/keyboard.svelte';
	import Tileset from '$lib/tileset.svelte';
	import { type Guess, type GuessFeedback, type Word, letterLength } from '$lib/types';
	import '../styles/global.css';
	import { Keyboard as KeyboardEnums } from '@etsoo/shared';
	import { keyToCharacter } from '$lib/utils';
	import Toaster from '$lib/toaster.svelte';

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

	let toasts: string[] = [];

	function addToast(message: string) {
		toasts = [...toasts, message];
		setTimeout(() => {
			toasts = toasts.slice(0, -1);
		}, 1 * 1000);
	}

	async function makeGuess() {
		if (!canGuess) return;

		if (currentGuessWord.length !== letterLength) {
			addToast('Not enough letters');
			return;
		}

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

	const keyboardMap = 'qwertyuiop\nasdfghjkl\n↵zxcvbnm←';

	async function handleKeyPress(code: KeyboardEnums.Keys, character: string = undefined) {
		if (!canGuess) return;
		if (!(keyboardMap.indexOf(character) !== -1)) return;

		switch (code) {
			case KeyboardEnums.Keys.Enter:
				await makeGuess();
				break;
			case KeyboardEnums.Keys.Backspace:
				if (currentGuessWord.length > 0) {
					currentGuessWord = currentGuessWord.slice(0, -1);
				}
				break;
			default:
				if (currentGuessWord.length < letterLength && character) {
					currentGuessWord += keyToCharacter(code);
				}
				break;
		}
	}

	async function onKeyboardPress(event: CustomEvent) {
		await handleKeyPress(event.detail.code, event.detail.key);
	}

	async function onKeyPress(event: KeyboardEvent) {
		let key = event.key;
		if (key === KeyboardEnums.Keys.Enter) {
			key = '↵';
		} else if (key === KeyboardEnums.Keys.Backspace) {
			key = '←';
		}

		await handleKeyPress(event.code as KeyboardEnums.Keys, key);
	}
</script>

<svelte:window on:keydown={onKeyPress} />
<div class="main">
	<div class="header">
		<Header title="BARdle" />
	</div>
	<div class="container">
		The word is <strong>{word.word}</strong>

		<br />

		<!-- {#if currentNumAttempts > 0 && latestGuess}
			That guess is {latestGuess.guessed && latestGuess.feedback.correct
				? 'correct!'
				: 'not correct!'}
			<br />
		{/if} -->

		<div class="toaster">
			<Toaster {toasts} />
		</div>

		<div class="tileset">
			<Tileset
				{guesses}
				numRows={maxGuesses}
				{currentGuessWord}
				{currentNumAttempts}
				{animationDuration}
			/>
		</div>

		<!-- {#if currentNumAttempts === 0}
			Guess a word!
		{/if} -->

		<!-- {#if currentNumAttempts >= maxGuesses}
			You have no more attempts left!
			<br />
		{/if} -->
	</div>
	<div class="keyboard">
		<Keyboard on:keypress={onKeyboardPress} {guesses} disabled={!canGuess} {keyboardMap} />
	</div>
</div>

<style>
	.main {
		display: grid;
		grid-template-rows: 20px 1fr 200px;
		grid-template-columns: 1fr;
		grid-template-areas:
			'header'
			'container'
			'keyboard';
		height: 100vh;
		justify-content: center;
		align-items: center;
	}

	.header {
		grid-area: header;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		text-align: center;
	}

	.container {
		grid-area: container;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		text-align: center;
	}

	.keyboard {
		grid-area: keyboard;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: end;
	}

	.toaster,
	.tileset,
	.keyboard {
		padding-bottom: 50px;
	}
</style>
