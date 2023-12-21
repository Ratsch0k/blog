import { writable, type Writable } from 'svelte/store';

export interface MousePosition {
	/**
	 * X position
	 */
	x: number;

	/**
	 * Y position
	 */
	y: number;

	/**
	 * Whether the mouse has ever been on the page
	 */
	available: boolean;
}

let store: Writable<MousePosition> | null = null;

/**
 * Lazy getter for the mouse position store.
 *
 * On the first call will create the mouse position store and return it.
 * On every subsequent call, will only return the already created stored.
 *
 * The store will contain the current mouse position and whether the mouse
 * has been on the page or not.
 */
export const mousePosition = () => {
	// Return the store if it already exists
	if (store !== null) {
		return { subscribe: store.subscribe };
	}

	// Create the store
	store = writable<MousePosition>(
		{ x: 0, y: 0, available: false },
		() => () => window.removeEventListener('mousemove', updateMouse)
	);

	/**
	 * Handles a mouse move event
	 *
	 * Updates the store
	 * @param e Mouse event
	 */
	const updateMouse = (e: MouseEvent) => {
		if (store === null) {
			return;
		}

		store.set({ x: e.pageX, y: e.pageY, available: true });
	};

	// Register the mouse move event listener
	window.addEventListener('mousemove', updateMouse);

	return { subscribe: store.subscribe };
};
