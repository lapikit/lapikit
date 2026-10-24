import { writable } from 'svelte/store';

export const modalStack = writable<string[]>([]);

export const pushModal = (id: string) => {
	modalStack.update((stack) => (stack.includes(id) ? stack : [...stack, id]));
};

export const popModal = (id: string) => {
	modalStack.update((stack) => stack.filter((m) => m !== id));
};
