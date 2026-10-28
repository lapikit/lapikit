import type { Snippet } from 'svelte';
import type { HTMLInputAttributes } from 'svelte/elements';
import type {
	ClassNameType,
	ColorProps,
	KitClassNameType,
	KitStylePropertiesType,
	SizeType,
	StylePropertiesType
} from '$lib/@types';

type OwnedAttributes =
	| 'type'
	| 'value'
	| 'min'
	| 'max'
	| 'step'
	| 'size'
	| 'color'
	| 'class'
	| 'style';

export interface SliderProps extends Omit<HTMLInputAttributes, OwnedAttributes> {
	ref?: HTMLInputElement | null;
	class?: ClassNameType;
	style?: StylePropertiesType;
	's-class'?: KitClassNameType;
	's-style'?: KitStylePropertiesType;
	value?: number;
	min?: number;
	max?: number;
	step?: number;
	label?: string;
	/** shows the value next to the label */
	showValue?: boolean;
	/** text of the value, read by screen readers too (aria-valuetext) */
	format?: (value: number) => string;
	size?: Exclude<SizeType, 'default'>;
	color?: ColorProps;
	disabled?: boolean;
	error?: boolean;
	message?: string;
	errorMessage?: string;
	prepend?: Snippet;
	append?: Snippet;
}
