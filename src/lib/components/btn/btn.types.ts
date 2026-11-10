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

export type ButtonProps = KitProps<
	{
		ref?: HTMLElement | null;
		is?: 'button' | 'a' | 'input';
		input?: boolean;
		href?: string;
		variant?: VariantType | 'plain' | 'link';
		density?: DensityType;
		active?: boolean;
		loading?: boolean;
		disabled?: boolean;
		checked?: boolean;
		size?: SizeType;
		rounded?: RoundedType | 'full';
		type?: 'button' | 'submit' | 'reset' | 'checkbox' | 'radio';
		value?: string | number | boolean;
		label?: string;
		/** text of a tooltip on hover and keyboard focus, or its options */
		tooltip?: TooltipValue;
		block?: boolean;
		wide?: boolean;
		noRipple?: boolean;
		icon?: boolean;
		load?: Snippet;
		append?: Snippet;
		prepend?: Snippet;
		elevation?: ElevationProps;
		color?: ColorProps;
	},
	AnchorAttributes & ButtonAttributes & InputAttributes
>;
