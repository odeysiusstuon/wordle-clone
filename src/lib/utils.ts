import type { Keyboard } from '@etsoo/shared';
import { writable, type Writable } from 'svelte/store';

export function keyToCharacter(key: Keyboard.Codes) {
	return key[3].toLowerCase();
}

export function characterToKey(character: string): Keyboard.Keys {
	return `Key${character.toUpperCase()}` as Keyboard.Keys;
}

export function getWritableIntFromStorage(
	localStorage: Storage,
	name: string,
	defaultValue: number = 0
): Writable<number> {
	if (localStorage.getItem(name) === null) {
		return writable(defaultValue);
	} else {
		return writable(parseInt(localStorage.getItem(name)));
	}
}

export function getWritableNumberFromStorage(
	localStorage: Storage,
	name: string,
	defaultValue: number = 0
): Writable<number> {
	if (localStorage.getItem(name) === null) {
		return writable(defaultValue);
	} else {
		return writable(parseFloat(localStorage.getItem(name)));
	}
}

export function getWritableBooleanFromStorage(
	localStorage: Storage,
	name: string,
	defaultValue: boolean = false
): Writable<boolean> {
	if (localStorage.getItem(name) === null) {
		return writable(defaultValue);
	} else {
		return writable(localStorage.getItem(name) === 'true');
	}
}

export function autoUpdateWritableStorage<T>(
	localStorage: Storage,
	name: string,
	writable: Writable<T>
) {
	writable.subscribe((v) => localStorage.setItem(name, `${v}`));
}
