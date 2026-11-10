import type { HTMLInputAttributes } from 'svelte/elements';
import type { KitBaseProps } from '$lib/@types';
import type { FieldBaseProps } from '../field/field.types';

type FieldOwnedAttributes = keyof FieldBaseProps | 'size' | 'type' | 'value';

export interface TextfieldProps
	extends
		FieldBaseProps,
		KitBaseProps,
		Omit<HTMLInputAttributes, FieldOwnedAttributes | 'class' | 'style' | 'children'> {
	ref?: HTMLElement | null;
	value?: string | number;
	type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';
	counter?: boolean;
	hideSpinButtons?: boolean;
}
