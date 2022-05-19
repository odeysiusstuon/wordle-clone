<script lang="ts" context="module">
	export async function load({ fetch }) {
		const url = latestUrl;
		const res = await fetch(url);

		if (res.ok) {
			const { word }: { word: PlayerWord } = await res.json();

			let guesses: Guess[] = [];
			let currentNumAttempts = 0;
			if (browser) {
				statisticsStore.addDayIfNotPresent(word);
				guesses = statisticsStore.getGuesses(word);

				if (guesses === null || guesses.length === 0) {
					guesses = new Array(maxGuesses).fill({
						guessed: false
					});
					guesses.forEach((g, i) => statisticsStore.setGuess(word, i, g));
				} else {
					if (guesses !== null) {
						let latestGuess: Guess;
						for (const guess of guesses) {
							if (guess.guessed) {
								latestGuess = guess;
							}
						}
						if (latestGuess && latestGuess.guessed) {
							currentNumAttempts = latestGuess.attemptNum;
						}
					}
				}
			}

			let wordDescription: string;
			if (guesses.length > 0) {
				const correctGuess = guesses.find((g) => g.guessed && g.feedback.correct);
				if (correctGuess && correctGuess.guessed && correctGuess.word) {
					const wordDescriptionRes = await fetch(
						`/word/desc/${word.wordId}.json?word=${correctGuess.word}`
					);
					if (wordDescriptionRes.ok) {
						wordDescription = (await wordDescriptionRes.json()).desc;
					}
				}
			}

			return {
				status: res.status,
				props: {
					word,
					guesses,
					currentNumAttempts,
					wordDescription
				}
			};
		} else {
			return {
				status: 200,
				props: {
					word: null,
					guesses: [],
					currentNumAttempts: 0
				}
			};
		}
	}
</script>

<script lang="ts">
	import Modal, { bind } from 'svelte-simple-modal';
	import { writable } from 'svelte/store';
	import lodash from 'lodash';
	const { countBy } = lodash;

	import '../styles/global.css';

	import { settingsStore } from '$lib/stores/settings_store';
	const { autoCopyResults, hardMode, saveProgress, winConfetti, winSound } = settingsStore;

	import { statisticsStore } from '$lib/stores/statistics_store';

	import Keyboard from '$lib/keyboard.svelte';
	import Tileset from '$lib/tileset.svelte';
	import {
		type Guess,
		type GuessFeedback,
		letterLength,
		type PlayerWord,
		maxGuesses,
		validateUrl,
		latestUrl,
		LetterFeedback
	} from '$lib/types';
	import { copyGuessesToClipboard, keyToCharacter, ordinal } from '$lib/utils';
	import Toaster from '$lib/toaster.svelte';
	import HelpPopup from '$lib/help_popup.svelte';
	import SettingsPopup from '$lib/settings_popup.svelte';
	import StatisticsPopup from '$lib/statistics_popup.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/env';
	import { variables } from '$lib/env';
	import { SmallCache } from '$lib/small_cache';

	const helpModal = writable(null);
	const showHelpModal = () => helpModal.set(bind(HelpPopup, {}));
	const settingsModal = writable(null);
	const showSettingsModal = () =>
		settingsModal.set(
			bind(SettingsPopup, {
				currentWord: word,
				guesses
			})
		);
	const statisticsModal = writable(null);
	const showStatisticsModal = (
		showShareButton: boolean = false,
		showNextWordTime: boolean = true
	) =>
		statisticsModal.set(
			bind(StatisticsPopup, {
				currentWord: word,
				showShareButton,
				showNextWordTime,
				addToast,
				wordDescription
			})
		);

	const modalWindowStyle = { backgroundColor: '#222', color: '#fff', textAlign: 'left' };

	export let word: PlayerWord;
	export let wordDescription: string;

	const animationDuration = 400;

	export let guesses: Guess[];
	export let currentNumAttempts: number = 0;
	let latestGuess: Guess = guesses ? guesses[currentNumAttempts - 1] || null : null;
	let currentGuessWord: string = '';

	$: latestGuess = guesses ? guesses[currentNumAttempts - 1] || null : null;

	let animating: boolean = false;

	let hasFinished: boolean = false;
	$: hasFinished =
		(latestGuess && latestGuess.guessed && latestGuess.feedback.correct) ||
		currentNumAttempts >= maxGuesses;

	const guessCooldown = 2 * 1000;
	let currentGuessCooldownClock: number = null;
	let countdownInterval: NodeJS.Timer;
	let guessOnCooldown: boolean = false;
	$: guessOnCooldown = currentGuessCooldownClock !== null && currentGuessCooldownClock > 0;

	let canGuess: boolean = true;
	$: canGuess =
		currentNumAttempts < maxGuesses &&
		(!latestGuess || !latestGuess.guessed || !hasFinished) &&
		!animating &&
		!guessOnCooldown;

	$: {
		if (countdownInterval && currentGuessCooldownClock !== null && currentGuessCooldownClock <= 0) {
			clearTimeout(countdownInterval);
		}
	}

	let toasts: string[] = [];

	function addToast(message: string) {
		toasts = [...toasts, message];
		setTimeout(() => {
			toasts = toasts.slice(0, -1);
		}, 1 * 1000);
	}

	let playWinAnimation: boolean = false;
	async function onFinish(correctGuess: Guess, won: boolean) {
		if (won) {
			addToast('Splendid');

			if ($winSound) {
				const winAudio = document.getElementById('win-audio');
				if (winAudio && winAudio instanceof HTMLAudioElement) {
					await winAudio.play();
				}
			}

			if (browser) {
				await statisticsStore.addWin();
				statisticsStore.savePlayerStatistics();
			}

			if ($winConfetti) {
				playWinAnimation = true;
				setTimeout(() => (playWinAnimation = false), 5 * 1000);
			}
		} else {
			if (browser) {
				statisticsStore.addLoss();
			}
		}

		if ($autoCopyResults) {
			copyGuessesToClipboard(statisticsStore, word);
		}

		// To satisfy TS intellisense
		if (correctGuess.guessed) {
			const wordDescriptionRes = await fetch(
				`/word/desc/${word.wordId}.json?word=${correctGuess.word}`
			);
			if (wordDescriptionRes.ok) {
				wordDescription = (await wordDescriptionRes.json()).desc;
			}
		}

		showStatisticsModal(true);
	}

	let tileset: Tileset;
	function onInsufficientInput() {
		if (!animating) {
			addToast('Not enough letters');
			tileset.shakeLatestRow();
		}
	}

	function isAllowedInHardMode(guessWord: string, letterHints: LetterFeedback[]) {
		const guessWordLetterCount = countBy(guessWord);
		const currentGuessWordLetterCount = countBy(currentGuessWord);

		let allowed = true;
		for (let i = 0; i < letterLength; i++) {
			const feedback = letterHints[i];
			const guessLetter = guessWord[i];
			const currentGuessLetter = currentGuessWord[i];
			if (feedback === LetterFeedback.Incorrect) continue;
			if (feedback === LetterFeedback.Correct) {
				if (currentGuessLetter !== guessLetter) {
					addToast(`${ordinal(i + 1)} letter must be ${guessLetter.toUpperCase()}`);
					allowed = false;
					break;
				}
			} else if (feedback === LetterFeedback.Present) {
				if (
					!currentGuessWordLetterCount[guessLetter] ||
					currentGuessWordLetterCount[guessLetter] < guessWordLetterCount[guessLetter]
				) {
					addToast(`Guess must contain ${guessLetter.toUpperCase()}`);
					allowed = false;
					break;
				}
			}
		}

		return allowed;
	}

	function activateGuessCooldown() {
		currentGuessCooldownClock = guessCooldown;
		countdownInterval = setInterval(() => (currentGuessCooldownClock -= 1 * 1000), 1 * 1000);
	}

	async function makeGuess() {
		if (!canGuess) return;

		if (currentGuessWord.length !== letterLength) {
			onInsufficientInput();
			return;
		}

		if ($hardMode && latestGuess && latestGuess.guessed) {
			const allowed = guesses.every((g, i) => {
				if (!g.guessed || i === currentNumAttempts) return true;
				return isAllowedInHardMode(g.word, g.feedback.hint.letters);
			});
			if (!allowed) {
				tileset.shakeLatestRow();
				return;
			}
		}

		if (!(await wordExists())) {
			activateGuessCooldown();
			addToast('Not in word list');
			tileset.shakeLatestRow();
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

		if (browser && $saveProgress) {
			statisticsStore.addDayIfNotPresent(word);
			statisticsStore.setGuess(word, currentNumAttempts - 1, guess);
			statisticsStore.savePlayerStatistics();
		}

		animating = true;
		setTimeout(() => (animating = false), animationDuration * letterLength);

		if (guess.guessed && guess.feedback.correct) {
			await onFinish(guess, true);
		} else if (currentNumAttempts >= maxGuesses) {
			await onFinish(guess, false);
		}
	}

	const keyboardMap = 'qwertyuiop\nasdfghjkl\n↵zxcvbnm←';

	async function handleKeyPress(code: string, character: string = undefined) {
		if (!(keyboardMap.indexOf(character) !== -1)) return;

		const isEnter = code === 'Enter' || code === 'NumpadEnter';
		const isBackspace = code === 'Backspace';

		if (!canGuess) {
			if (currentGuessCooldownClock && currentGuessCooldownClock > 0 && isEnter) {
				addToast(
					`Wait ${currentGuessCooldownClock / 1000} second${
						currentGuessCooldownClock / 1000 === 1 ? '' : 's'
					} before guessing again`
				);
			}
			return;
		}

		if (isEnter) {
			await makeGuess();
		} else if (isBackspace) {
			if (currentGuessWord.length > 0) {
				currentGuessWord = currentGuessWord.slice(0, -1);
			}
		} else {
			if (currentGuessWord.length < letterLength && character) {
				currentGuessWord += keyToCharacter(code);
			}
		}
	}

	async function onKeyboardPress(event: CustomEvent) {
		await handleKeyPress(event.detail.code, event.detail.key);
	}

	async function onKeyPress(event: KeyboardEvent) {
		let key = event.key;
		if (key === 'Enter') {
			key = '↵';
		} else if (key === 'Backspace') {
			key = '←';
		}

		await handleKeyPress(event.code, key);
	}

	const wordNotExistsCache: SmallCache<string> = new SmallCache();

	async function wordExists() {
		if (wordNotExistsCache.has(currentGuessWord)) return;
		const res = await fetch(`/word/exists/${currentGuessWord}.json`);
		if (res.ok) {
			if ((await res.json()).exists) {
				return true;
			}
		}
		wordNotExistsCache.add(currentGuessWord);
		return false;
	}

	let animateFinishedRefresh = false;
	onMount(() => {
		if (hasFinished) {
			showStatisticsModal(true);
			animateFinishedRefresh = true;
		}
	});
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
	/>
	<title>BARdle</title>
	<meta content="BARdle" property="og:title" />
	<meta content="Wordle but The BAR" property="og:description" />
	<meta content="https://bardle.thebar.world" property="og:url" />
	<meta content="/bardle_logo.png" property="og:image" />
	<meta content="#4d4dff" data-react-helmet="true" name="theme-color" />
</svelte:head>

<svelte:window on:keydown={onKeyPress} />

<div class="main" class:win={playWinAnimation}>
	<audio id="win-audio" src="/win_sfx.mp3" />

	<div class="header">
		<div class="header-buttons-left">
			<a class="home" href={variables.home_uri}>
				<span class="material-symbols-outlined"> home </span>
			</a>

			<Modal show={$helpModal} styleWindow={modalWindowStyle}>
				<button class="help" on:click={showHelpModal}>
					<span class="material-symbols-outlined"> help </span>
				</button>
			</Modal>
		</div>

		<div class="heading">
			<h1>BARdle</h1>
		</div>

		<div class="header-buttons-right">
			<Modal show={$statisticsModal} styleWindow={modalWindowStyle}>
				<button class="statistics" on:click={() => showStatisticsModal(hasFinished)}>
					<span class="material-symbols-outlined"> leaderboard </span>
				</button>
			</Modal>

			<Modal show={$settingsModal} styleWindow={modalWindowStyle}>
				<button class="settings" on:click={showSettingsModal}>
					<span class="material-symbols-outlined"> settings </span>
				</button>
			</Modal>
		</div>
	</div>

	{#if word === null}
		<div class="container">
			<div class="tileset">
				<h1>Could not load today's word</h1>
				<h2>Try refreshing</h2>
				<img src="/the-bar-logo-v2-medium.png" alt="The BAR Logo" draggable="false" />
			</div>
		</div>
	{:else}
		<div class="container">
			<div class="toaster">
				<Toaster {toasts} />
			</div>

			<div class="tileset">
				<Tileset
					bind:this={tileset}
					{guesses}
					{currentGuessWord}
					{currentNumAttempts}
					{animationDuration}
					{animating}
					{animateFinishedRefresh}
					currentRowDeactivated={guessOnCooldown}
					shakingAllowed
					--num-rows={maxGuesses}
					--num-columns={letterLength}
					--tile-height="60px"
				/>
			</div>
		</div>

		<div class="keyboard">
			<Keyboard on:keypress={onKeyboardPress} {guesses} disabled={!canGuess} {keyboardMap} />
		</div>
	{/if}
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

	.main::after {
		opacity: 0;
		position: absolute;
		content: '';
		width: 100%;
		height: 100%;
		background: url('/win_confetti.gif');
		background-repeat: repeat;
		transition: opacity 1s;
		pointer-events: none;
	}

	.main.win::after {
		opacity: 1;
		transition: opacity 0s;
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
		user-select: none;
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

	.toaster {
		z-index: 1001;
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
