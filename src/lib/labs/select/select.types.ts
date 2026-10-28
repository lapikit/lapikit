import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type {
	ClassNameType,
	KitClassNameType,
	KitStylePropertiesType,
	StylePropertiesType
} from '$lib/@types';
import type { FieldBaseProps } from '$lib/components/field/field.types';

export type SelectValue = string | number;

export interface SelectItem {
	label: string;
	value: SelectValue;
	disabled?: boolean;
}

export interface SelectItemState {
	selected: boolean;
	active: boolean;
}

type FieldOwnedAttributes = keyof FieldBaseProps | 'children';

export interface SelectProps
	extends
		FieldBaseProps,
		Omit<HTMLAttributes<HTMLDivElement>, FieldOwnedAttributes | 'class' | 'style'> {
	ref?: HTMLElement | null;
	class?: ClassNameType;
	style?: StylePropertiesType;
	's-class'?: KitClassNameType;
	's-style'?: KitStylePropertiesType;
	/** a string or a number is its own label */
	items?: (SelectValue | SelectItem)[];
	/** an array with multiple */
	value?: SelectValue | SelectValue[] | null;
	multiple?: boolean;
	open?: boolean;
	placeholder?: string;
	/** sends the value with the form */
	name?: string;
	required?: boolean;
	noDataText?: string;
	/** content of an option */
	item?: Snippet<[SelectItem, SelectItemState]>;
	/** content of the field when a value is selected */
	selection?: Snippet<[SelectItem[]]>;
}
