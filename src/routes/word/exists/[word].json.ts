import { db } from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';

type Params = { word: string };

type OutputType = { exists: boolean };

/** @type {import('./word/').RequestHandler} */
export const get: RequestHandler<Params, OutputType> = async ({ params }) => {
	return {
		body: { exists: await db.wordExists(params.word) }
	};
};
