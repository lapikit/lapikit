import type { ModalState } from '$lib/@types';
import { disabledScroll } from '$lib/utils';
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
		let values = stack;
		if (!stack.includes(id)) values = [...stack, id];
		disabledScroll(values.length !== 0 ? true : false);
		return values;
	});
};

export const popModal = (id: string) => {
	modalStack.update((stack) => {
		const newStack = stack.filter((m) => m !== id);
		disabledScroll(newStack.length !== 0 ? true : false);
		return newStack.length === 0 ? [] : newStack;
	});
};
