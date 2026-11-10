import type {
	AnchorAttributes,
	ButtonAttributes,
	ColorProps,
	DensityType,
	ElevationProps,
	KitProps,
	RoundedType,
	VariantType
} from '$lib/@types';

export type SheetProps = KitProps<
	{
		ref?: HTMLElement | null;
		is?: 'div' | 'article' | 'section' | 'aside' | 'a' | 'button';
		href?: string;
		type?: 'button' | 'submit' | 'reset';
		variant?: VariantType | 'plain';
		rounded?: RoundedType | 'full';
		density?: DensityType;
		elevation?: ElevationProps;
		active?: boolean;
		color?: ColorProps;
		interactive?: boolean;
		disabled?: boolean;
		noRipple?: boolean;
	},
	AnchorAttributes & ButtonAttributes
>;
