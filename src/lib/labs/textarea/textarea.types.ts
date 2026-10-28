import type { HTMLTextareaAttributes } from 'svelte/elements';
import type {
	ClassNameType,
	KitClassNameType,
	KitStylePropertiesType,
	StylePropertiesType
} from '$lib/@types';
import type { FieldBaseProps } from '$lib/components/field/field.types';

type FieldOwnedAttributes = keyof FieldBaseProps | 'value';

export interface TextareaProps
	extends
		FieldBaseProps,
		Omit<HTMLTextareaAttributes, FieldOwnedAttributes | 'class' | 'style' | 'children'> {
	ref?: HTMLElement | null;
	class?: ClassNameType;
	style?: StylePropertiesType;
	's-class'?: KitClassNameType;
	's-style'?: KitStylePropertiesType;
	value?: string;
	rows?: number;
	/** the height follows the content */
	autoGrow?: boolean;
	/** maximal number of rows with autoGrow, then it scrolls */
	maxRows?: number;
	noResize?: boolean;
	counter?: boolean;
}
