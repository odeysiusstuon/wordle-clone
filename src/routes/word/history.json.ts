import { db } from '$lib/db';

export async function get() {
  const wordHistory = await db.getWordHistory();
  if (wordHistory) {
    return {
      body: { wordHistory }
    };
  }

  return {
    status: 404,
    error: new Error('Could not load the word history')
  };
}
