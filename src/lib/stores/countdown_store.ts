// https://svelte.dev/repl/4dc8559756cf491abe7ad8f7189a8873?version=3.38.3

import type { Moment } from 'moment';
import moment from 'moment';
import { readable } from 'svelte/store';

type CountdownStoreOptions = {
	interval?: number;
};

export default function (end: Moment, start: Moment = null, options: CountdownStoreOptions = {}) {
	// return a readable store
	if (!start) {
		start = moment.utc();
	}

	return readable(end.utc().diff(start), (set) => {
		// the `update` function sets the latest date
		const update = () => set(end.utc().diff(moment.utc()));

		// setup an interval timer to update the store's value every x milliseconds
		const interval = setInterval(update, options.interval || 1000);

		// return a cleanup function,
		// it will stop the timer when the store is destroyed
		return () => clearInterval(interval);
	});
}
