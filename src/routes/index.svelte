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

    const validateUrl = '/word/validate.json';
    const emojiMappings: { [key in LetterFeedback]: string } = {
        [LetterFeedback.Correct]: '🟩',
        [LetterFeedback.WrongSpot]: '🟨',
        [LetterFeedback.Incorrect]: '⬛',
    };

    export let word: Word;
    
    let guesses: string[] = [];
    let guess: string;
    let currentFeedback: GuessFeedback;

    async function onGuess() {
        if (guess.length === 5) {
            const res = await fetch(`${validateUrl}?guess=${guess}`);
            const { feedback }: { feedback: GuessFeedback } = await res.json();
            currentFeedback = feedback;
        }
    }
</script>

<div class="main">
    <Header title="BARdle" />
    <br>
    The word is <strong>{word.word}</strong>
    <br>
    {#if currentFeedback}
        That guess is {currentFeedback.correct ? 'correct!' : 'not correct!'}
        <br>
        {currentFeedback.hint.letters.map(x => emojiMappings[x]).join(' ')}
    {:else}
        Guess a word!
    {/if}
    <input type="text" maxlength="5" on:change={onGuess} bind:value={guess}>
</div>
