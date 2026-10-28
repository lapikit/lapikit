import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLInputAttributes } from 'svelte/elements';
import type {
	ClassNameType,
	ColorProps,
	KitClassNameType,
	KitStylePropertiesType,
	SizeType,
	StylePropertiesType
} from '$lib/@types';
import type { ChoiceBaseProps, ChoiceValue } from '../checkbox/checkbox.types';

type OwnedAttributes = keyof ChoiceBaseProps | 'type' | 'checked' | 'value' | 'group' | 'size';

export interface RadioProps extends ChoiceBaseProps, Omit<HTMLInputAttributes, OwnedAttributes> {
	value: ChoiceValue;
	/** the value of the checked radio, without kit:radio-group */
	group?: ChoiceValue | null;
}

export interface RadioGroupProps extends Omit<
	HTMLAttributes<HTMLFieldSetElement>,
	'class' | 'style' | 'children' | 'color'
> {
	ref?: HTMLFieldSetElement | null;
	class?: ClassNameType;
	style?: StylePropertiesType;
	's-class'?: KitClassNameType;
	's-style'?: KitStylePropertiesType;
	/** the value of the checked radio */
	value?: ChoiceValue | null;
	/** generated when empty */
	name?: string;
	label?: string;
	inline?: boolean;
	size?: Exclude<SizeType, 'default'>;
	color?: ColorProps;
	disabled?: boolean;
	required?: boolean;
	error?: boolean;
	message?: string;
	errorMessage?: string;
	children?: Snippet;
}

export interface RadioGroupContext {
	readonly name: string;
	value: ChoiceValue | null | undefined;
	readonly size: RadioGroupProps['size'];
	readonly color: ColorProps | undefined;
	readonly disabled: boolean;
	readonly required: boolean;
	readonly error: boolean;
	readonly describedby: string | undefined;
}
