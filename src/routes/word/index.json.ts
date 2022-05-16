import { db } from '$lib/db';

export async function get() {
	const word = await db.getLatestPlayerWord();
	if (word) {
		return {
			body: { word }
		};
	}

	return {
		status: 404,
		error: new Error('Could not load the latest word')
	};
}
