import type { Snippet } from 'svelte';
import type {
	ColorProps,
	DensityType,
	ElevationProps,
	KitProps,
	RoundedType,
	SizeType,
	VariantType
} from '$lib/@types';

export type FieldVariant = VariantType;

/** The attributes to spread on the control (input, textarea, select...) */
export interface FieldControlProps {
	id: string;
	'aria-describedby': string | undefined;
	'aria-invalid': true | undefined;
	disabled: boolean;
	readonly: boolean;
}

export interface FieldBaseProps {
	variant?: FieldVariant;
	size?: SizeType;
	density?: DensityType;
	rounded?: RoundedType | 'full';
	color?: ColorProps;
	elevation?: ElevationProps;
	label?: string;
	disabled?: boolean;
	readonly?: boolean;
	error?: boolean;
	errorMessage?: string;
	message?: string;
	messagePrefix?: string;
	messageSuffix?: string;
	persistentMessage?: boolean;
	clearable?: boolean;
	clearLabel?: string;
	persistentClear?: boolean;
	prefix?: string;
	suffix?: string;
	append?: Snippet;
	prepend?: Snippet;
	prependInner?: Snippet;
	appendInner?: Snippet;
}

export type FieldProps = KitProps<
	FieldBaseProps & {
		ref?: HTMLElement | null;
		/** id of the control, generated when empty */
		id?: string;
		/** the field holds a value: shows the clear button */
		dirty?: boolean;
		/** text at the end of the message line, the counter of a textfield */
		counter?: string;
		onclear?: () => void;
		children?: Snippet<[FieldControlProps]>;
	}
>;
