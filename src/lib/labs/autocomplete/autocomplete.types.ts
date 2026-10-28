import type { Snippet } from 'svelte';
import type { HTMLInputAttributes } from 'svelte/elements';
import type {
	ClassNameType,
	KitClassNameType,
	KitStylePropertiesType,
	StylePropertiesType
} from '$lib/@types';
import type { FieldBaseProps } from '$lib/components/field/field.types';
import type { SelectItem, SelectItemState, SelectValue } from '../select/select.types';

type FieldOwnedAttributes = keyof FieldBaseProps | 'size' | 'type' | 'value' | 'children';

export interface AutocompleteProps
	extends FieldBaseProps, Omit<HTMLInputAttributes, FieldOwnedAttributes | 'class' | 'style'> {
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
	/** the text typed in the field */
	search?: string;
	/** keeps an option for the search, by default its label contains the search (case and accents ignored) */
	filter?: (item: SelectItem, search: string) => boolean;
	/** the items are already filtered (search on a server) */
	noFilter?: boolean;
	/** sends the value with the form */
	name?: string;
	required?: boolean;
	noDataText?: string;
	removeLabel?: string;
	/** content of an option */
	item?: Snippet<[SelectItem, SelectItemState]>;
	/** content of the selected values with multiple, before the input */
	selection?: Snippet<[SelectItem[], (value: SelectValue) => void]>;
}
