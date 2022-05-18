import { db } from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';

type Params = { id: string };

type OutputType = { exists: boolean };

/** @type {import('./desc/[id].json.ts').RequestHandler} */
export const get: RequestHandler<Params, OutputType> = async ({ params, url }) => {
	const wordParam = url.searchParams.get('word');
	if (!wordParam) {
		return {
			status: 404
		};
	}

	const desc = await db.getDesc(params.id, wordParam);
	if (desc !== null) {
		return {
			body: { desc }
		};
	} else {
		return {
			status: 404,
			error: new Error(`Could not find word with id '${params.id}' and word '${wordParam}'`)
		};
	}
};
