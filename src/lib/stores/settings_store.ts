import { browser } from '$app/env';
import { autoUpdateWritableStorage, getWritableBooleanFromStorage } from '$lib/utils';
import { writable, type Writable } from 'svelte/store';

class SettingsStore {
	public winConfetti: Writable<boolean> = writable(true);
	public winSound: Writable<boolean> = writable(true);
	public barColorTiles: Writable<boolean> = writable(false);
	public crimsonFont: Writable<boolean> = writable(false);
	public saveProgress: Writable<boolean> = writable(true);
	public autoCopyResults: Writable<boolean> = writable(true);
	public hardMode: Writable<boolean> = writable(false);

	constructor() {
		if (browser) {
			this.winConfetti = getWritableBooleanFromStorage(localStorage, 'winConfetti', true);
			this.winSound = getWritableBooleanFromStorage(localStorage, 'winSound', true);
			this.barColorTiles = getWritableBooleanFromStorage(localStorage, 'barColorTiles', false);
			this.crimsonFont = getWritableBooleanFromStorage(localStorage, 'crimsonFont', false);
			this.saveProgress = getWritableBooleanFromStorage(localStorage, 'saveProgress', true);
			this.autoCopyResults = getWritableBooleanFromStorage(localStorage, 'autoCopyResults', true);
			this.hardMode = getWritableBooleanFromStorage(localStorage, 'hardMode', false);

			autoUpdateWritableStorage(localStorage, 'winConfetti', this.winConfetti);
			autoUpdateWritableStorage(localStorage, 'winSound', this.winSound);
			autoUpdateWritableStorage(localStorage, 'barColorTiles', this.barColorTiles);
			autoUpdateWritableStorage(localStorage, 'crimsonFont', this.crimsonFont);
			autoUpdateWritableStorage(localStorage, 'saveProgress', this.saveProgress);
			autoUpdateWritableStorage(localStorage, 'autoCopyResults', this.autoCopyResults);
			autoUpdateWritableStorage(localStorage, 'hardMode', this.hardMode);
		}
	}
}

export const settingsStore = new SettingsStore();
