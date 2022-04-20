<script lang="ts" context="module">
    export async function load({ fetch }) {
        const url = '/word.json';
        const res = await fetch(url);
        const { word } = await res.json();
        
        return {
            status: res.status,
            props: {
                word
            },
        };
    }
</script>

<script lang="ts">
    import Header from '$lib/header.svelte';
    import { LetterFeedback, type GuessFeedback, type Word } from '$lib/types';
    import '../styles/global.css';

    type Guess = {
        attemptNum: number;
        word: string;
        feedback: GuessFeedback;
    };

    const validateUrl = '/word/validate.json';
    const emojiMappings: { [key in LetterFeedback]: string } = {
        [LetterFeedback.Correct]: '🟩',
        [LetterFeedback.WrongSpot]: '🟨',
        [LetterFeedback.Incorrect]: '⬛',
    };

    export let word: Word;

    const maxGuesses = 6;
    
    let guesses: Guess[] = new Array(maxGuesses);
    for (let i = 0; i < maxGuesses; i++) {
        guesses[i] = {
            attemptNum: i + 1,
            word: null,
            feedback: null,
        };
    }
    let currentGuessWord = '';
    let currentNumAttempts = 0;

    function getLatestGuess() {
        if (currentNumAttempts > 0) {
            return guesses[currentNumAttempts - 1];
        }
        return null;
    }

    async function onGuess() {
        const latestGuess = getLatestGuess();
        if (currentGuessWord.length === 5 && currentNumAttempts < maxGuesses && (!latestGuess || !latestGuess.feedback.correct)) {
            const res = await fetch(`${validateUrl}?guess=${currentGuessWord}`);
            const { feedback }: { feedback: GuessFeedback } = await res.json();
            currentNumAttempts++;
            const guess = {
                attemptNum: currentNumAttempts,
                word: currentGuessWord,
                feedback,
            };
            guesses[currentNumAttempts - 1] = guess;
        }
    }
</script>

<!-- {@debug guesses} -->

<div class="main">
    <Header title="BARdle" />
    <br>
    The word is <strong>{word.word}</strong>
    <br>
    {#if currentNumAttempts > 0}
        That guess is {getLatestGuess().feedback.correct ? 'correct!' : 'not correct!'}
        <br>
    {/if}
    {#each guesses as { attemptNum, feedback } (attemptNum)}
        {#if feedback}
            {feedback.hint.letters.map(x => emojiMappings[x]).join(' ')}
        {:else}
            {emojiMappings[LetterFeedback.Incorrect].repeat(maxGuesses)}
        {/if}
        <br>
    {/each}
    {#if currentNumAttempts === 0}
        Guess a word!
    {/if}
    {#if currentNumAttempts >= 6}
        You have no more attempts left!
        <br>
    {/if}
    <input type="text" maxlength="5" on:change={onGuess} bind:value={currentGuessWord}>
</div>
