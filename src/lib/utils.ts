export function keyToCharacter(key: string) {
	return key[3].toLowerCase();
}

export function characterToKey(character: string) {
	return `Key${character.toUpperCase()}`;
}
