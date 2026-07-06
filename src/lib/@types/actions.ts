import type { Action } from 'svelte/action';

/** Accordion */
export type AccordionOptions = {
	multiple?: boolean;
	readOnly?: boolean;
};

/**Modal */
export type ModalState = boolean | 'persistent';

/**Theme */
export type ThemeOptions = {
	name?: string;
	key?: string;
	overridden?: boolean;
};

export type ThemeAction = {
	action: Action<HTMLElement, ThemeOptions | undefined>;
	set: (name: string) => void;
	readonly active: string;
};
