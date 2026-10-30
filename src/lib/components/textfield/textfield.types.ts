import type { HTMLInputAttributes } from 'svelte/elements';
import type {
	ClassNameType,
	KitClassNameType,
	KitStylePropertiesType,
	StylePropertiesType
} from '$lib/@types';
import type { FieldBaseProps } from '../field/field.types';

type FieldOwnedAttributes = keyof FieldBaseProps | 'size' | 'type' | 'value';

export interface TextfieldProps
	extends
		FieldBaseProps,
		Omit<HTMLInputAttributes, FieldOwnedAttributes | 'class' | 'style' | 'children'> {
	ref?: HTMLElement | null;
	class?: ClassNameType;
	style?: StylePropertiesType;
	's-class'?: KitClassNameType;
	's-style'?: KitStylePropertiesType;
	value?: string | number;
	type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';
	counter?: boolean;
	hideSpinButtons?: boolean;
}
