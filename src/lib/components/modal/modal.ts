import type { ModalState } from '$lib/@types';
import { lockScroll, unlockScroll } from '$lib/utils';
import { writable, type Writable } from 'svelte/store';

// presets
const refModal: ModalState = false;

// states
export const modalOpen: Writable<ModalState> = writable(refModal);
export const modalStack = writable<string[]>([]);

export function setOpenModal(state: boolean | 'persistent') {
	modalOpen.set(state);
}

export const pushModal = (id: string) => {
	modalStack.update((stack) => {
		if (stack.includes(id)) return stack;
		lockScroll();
		return [...stack, id];
	});
};

export const popModal = (id: string) => {
	modalStack.update((stack) => {
		if (!stack.includes(id)) return stack;
		unlockScroll();
		return stack.filter((m) => m !== id);
	});
};
