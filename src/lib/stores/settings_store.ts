import { writable, type Writable } from 'svelte/store';

class SettingsStore {
	public winConfetti: Writable<boolean>;
	public winSound: Writable<boolean>;
	public barColorTiles: Writable<boolean>;

	constructor() {
		if (localStorage.getItem('winConfetti') === null) {
			this.winConfetti = writable(true);
		} else {
			this.winConfetti = writable(localStorage.getItem('winConfetti') === 'true');
		}

		if (localStorage.getItem('winSound') === null) {
			this.winSound = writable(true);
		} else {
			this.winSound = writable(localStorage.getItem('winSound') === 'true');
		}

		if (localStorage.getItem('barColorTiles') === null) {
			this.barColorTiles = writable(false);
		} else {
			this.barColorTiles = writable(localStorage.getItem('barColorTiles') === 'true');
		}

		this.winConfetti.subscribe((v) => localStorage.setItem('winConfetti', `${v}`));
		this.winSound.subscribe((v) => localStorage.setItem('winSound', `${v}`));
		this.barColorTiles.subscribe((v) => localStorage.setItem('barColorTiles', `${v}`));
	}
}

export const settingsStore = new SettingsStore();
