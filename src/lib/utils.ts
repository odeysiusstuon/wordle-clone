import type { Keyboard } from '@etsoo/shared';

export function keyToCharacter(key: Keyboard.Codes) {
	return key[3].toLowerCase();
}

export function characterToKey(character: string): Keyboard.Keys {
	return `Key${character.toUpperCase()}` as Keyboard.Keys;
}
