import type {
	AnchorAttributes,
	ButtonAttributes,
	ColorProps,
	DensityType,
	ElevationProps,
	InputAttributes,
	KitProps,
	RoundedType,
	SizeType,
	VariantType
} from '$lib/@types';
import type { Snippet } from 'svelte';
import type { TooltipValue } from '../tooltip/tooltip.types';

export type ChipProps = KitProps<
	{
		ref?: HTMLElement | null;
		is?: 'div' | 'a' | 'input' | 'button';
		input?: boolean;
		href?: string;
		variant?: VariantType | 'plain';
		density?: DensityType;
		rounded?: RoundedType | 'full';
		interactive?: boolean;
		active?: boolean;
		loading?: boolean;
		disabled?: boolean;
		checked?: boolean;
		size?: SizeType;
		labelStyle?: boolean;
		type?: 'button' | 'submit' | 'reset' | 'checkbox' | 'radio';
		value?: string | number | boolean;
		label?: string;
		/** text of a tooltip on hover and keyboard focus, or its options */
		tooltip?: TooltipValue;
		noRipple?: boolean;
		readonly?: boolean;
		load?: Snippet;
		append?: Snippet;
		prepend?: Snippet;
		elevation?: ElevationProps;
		color?: ColorProps;
	},
	AnchorAttributes & ButtonAttributes & InputAttributes
>;
