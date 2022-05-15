import { writable, type Writable } from 'svelte/store';

class SettingsStore {
	public winConfetti: Writable<boolean>;
	public winSound: Writable<boolean>;

	constructor() {
		this.winConfetti = writable(localStorage.getItem('winConfetti') === 'true' || true);
		this.winSound = writable(localStorage.getItem('winSound') === 'true' || true);

		this.winConfetti.subscribe((v) => localStorage.setItem('winConfetti', `${v}`));
		this.winSound.subscribe((v) => localStorage.setItem('winSound', `${v}`));
	}
}

export const settingsStore = new SettingsStore();
