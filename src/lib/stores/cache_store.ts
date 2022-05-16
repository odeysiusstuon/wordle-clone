import type { PlayerWord } from '$lib/types';
import { writable } from 'svelte/store';

export const nextWord = writable<PlayerWord>(null);
