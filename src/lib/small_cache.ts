export class SmallCache<T> {
	private array: T[];
	private i: number = 0;
	private size: number;

	constructor(size: number = 3) {
		this.array = new Array<T>(size).fill(null);
		this.size = size;
	}

	add(el: T) {
		this.array[this.i] = el;
		this.i = (this.i + 1) % this.size;
	}

	has(el: T) {
		return this.array.indexOf(el) !== -1;
	}
}
