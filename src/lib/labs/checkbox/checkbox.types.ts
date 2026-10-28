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

export type ChoiceValue = string | number;

export interface ChoiceBaseProps {
	ref?: HTMLInputElement | null;
	class?: ClassNameType;
	style?: StylePropertiesType;
	's-class'?: KitClassNameType;
	's-style'?: KitStylePropertiesType;
	label?: string;
	/** content of the label, instead of label */
	children?: Snippet;
	size?: Exclude<SizeType, 'default'>;
	color?: ColorProps;
	disabled?: boolean;
	error?: boolean;
}

type OwnedAttributes =
	| keyof ChoiceBaseProps
	| 'type'
	| 'checked'
	| 'indeterminate'
	| 'value'
	| 'group'
	| 'size';

export interface CheckboxProps extends ChoiceBaseProps, Omit<HTMLInputAttributes, OwnedAttributes> {
	checked?: boolean;
	indeterminate?: boolean;
	value?: ChoiceValue;
	/** the values of the checked checkboxes: adds or removes value */
	group?: ChoiceValue[];
	message?: string;
	errorMessage?: string;
}
