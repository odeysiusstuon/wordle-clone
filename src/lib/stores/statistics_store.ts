import { autoUpdateWritableStorage, getWritableIntFromStorage } from '$lib/utils';
import type { Writable } from 'svelte/store';

class SettingsStore {
	public totalPlays: Writable<number>;
	public totalWins: Writable<number>;
	public currentStreak: Writable<number>;
	public maxStreak: Writable<number>;

	constructor() {
		this.totalPlays = getWritableIntFromStorage(localStorage, 'totalPlays');
		this.totalWins = getWritableIntFromStorage(localStorage, 'totalWins');
		this.currentStreak = getWritableIntFromStorage(localStorage, 'currentStreak');
		this.maxStreak = getWritableIntFromStorage(localStorage, 'maxStreak');

		autoUpdateWritableStorage(localStorage, 'totalPlays', this.totalPlays);
		autoUpdateWritableStorage(localStorage, 'totalWins', this.totalWins);
		autoUpdateWritableStorage(localStorage, 'currentStreak', this.currentStreak);
		autoUpdateWritableStorage(localStorage, 'maxStreak', this.maxStreak);
	}
}

export const settingsStore = new SettingsStore();
