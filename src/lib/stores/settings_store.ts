import { autoUpdateWritableStorage, getWritableBooleanFromStorage } from '$lib/utils';
import type { Writable } from 'svelte/store';

class SettingsStore {
	public winConfetti: Writable<boolean>;
	public winSound: Writable<boolean>;
	public barColorTiles: Writable<boolean>;

	constructor() {
		this.winConfetti = getWritableBooleanFromStorage(localStorage, 'winConfetti', true);
		this.winSound = getWritableBooleanFromStorage(localStorage, 'winSound', true);
		this.barColorTiles = getWritableBooleanFromStorage(localStorage, 'barColorTiles', false);

		autoUpdateWritableStorage(localStorage, 'winConfetti', this.winConfetti);
		autoUpdateWritableStorage(localStorage, 'winSound', this.winSound);
		autoUpdateWritableStorage(localStorage, 'barColorTiles', this.barColorTiles);
	}
}

export const settingsStore = new SettingsStore();
