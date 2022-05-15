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
	import { Keyboard as KeyboardEnums } from '@etsoo/shared';
	import Modal, { bind } from 'svelte-simple-modal';
	import { writable } from 'svelte/store';

	import '../styles/global.css';

	import Keyboard from '$lib/keyboard.svelte';
	import Tileset from '$lib/tileset.svelte';
	import { type Guess, type GuessFeedback, type Word, letterLength } from '$lib/types';
	import { keyToCharacter } from '$lib/utils';
	import Toaster from '$lib/toaster.svelte';
	import HelpPopup from '$lib/help_popup.svelte';

	const helpModal = writable(null);
	const showHelpModal = () => helpModal.set(bind(HelpPopup, {}));

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

	let playWinAnimation = false;
	$: playWinAnimation = latestGuess && latestGuess.guessed && latestGuess.feedback.correct;

	let toasts: string[] = [];

	function addToast(message: string) {
		toasts = [...toasts, message];
		setTimeout(() => {
			toasts = toasts.slice(0, -1);
		}, 1 * 1000);
	}

	async function onWin() {
		playWinAnimation = true;
		addToast('Splendid');
		const winAudio = document.getElementById('win-audio');
		if (winAudio && winAudio instanceof HTMLAudioElement) {
			await winAudio.play();
		}
		setTimeout(() => (playWinAnimation = false), 5 * 1000);
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

		if (latestGuess.guessed && latestGuess.feedback.correct) {
			await onWin();
		}
	}

	const keyboardMap = 'qwertyuiop\nasdfghjkl\n↵zxcvbnm←';

	async function handleKeyPress(code: KeyboardEnums.Codes, character: string = undefined) {
		if (!canGuess) return;
		if (!(keyboardMap.indexOf(character) !== -1)) return;

		switch (code) {
			case KeyboardEnums.Codes.Enter:
			case 'NumpadEnter' as KeyboardEnums.Codes:
				await makeGuess();
				break;
			case KeyboardEnums.Codes.Backspace:
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

		await handleKeyPress(event.code as KeyboardEnums.Codes, key);
	}
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
	/>
</svelte:head>
<svelte:window on:keydown={onKeyPress} />
<div class="main" class:win={playWinAnimation}>
	<audio id="win-audio" src="win_sfx.mp3" />
	<div class="header">
		<div class="header-buttons-left">
			<a class="home" href="https://thebar.world/">
				<span class="material-symbols-outlined"> home </span>
			</a>
			<Modal
				show={$helpModal}
				styleWindow={{ backgroundColor: '#222', color: '#fff', textAlign: 'left' }}
			>
				<button class="help" on:click={showHelpModal}>
					<span class="material-symbols-outlined"> help </span>
				</button>
			</Modal>
		</div>
		<div class="heading">
			<h1>BARdle</h1>
		</div>
		<div class="header-buttons-right">
			<button class="statistics">
				<span class="material-symbols-outlined"> leaderboard </span>
			</button>
			<button class="settings">
				<span class="material-symbols-outlined"> settings </span>
			</button>
		</div>
	</div>
	<div class="container">
		The word is <strong>{word.word}</strong>

		<br />

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
				{animating}
			/>
		</div>
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

	.main.win {
		background-image: url('win_confetti.gif');
	}

	.header {
		grid-area: header;
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: space-between;
		text-align: center;
		border-bottom: 1px solid #4d4dff;
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

	.header-buttons-left,
	.header-buttons-right,
	.heading {
		margin: 10px;
		margin-top: 20px;
	}

	.header-buttons-left,
	.header-buttons-right {
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: center;
	}

	.statistics,
	.settings,
	.home,
	.help {
		background-color: transparent;
		color: #fff;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		text-align: center;
		cursor: pointer;
		width: 30px;
		border-radius: 1em;
		text-decoration: none;
	}

	h1 {
		font-size: 42px;
		margin: 0px;
	}
</style>
