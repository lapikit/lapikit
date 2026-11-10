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

export type CardProps = KitProps<
	{
		ref?: HTMLElement | null;
		is?: 'div' | 'article' | 'section' | 'aside' | 'a' | 'button';
		href?: string;
		type?: 'button' | 'submit' | 'reset';
		variant?: VariantType | 'plain';
		density?: DensityType;
		rounded?: RoundedType;
		elevation?: ElevationProps;
		interactive?: boolean;
		active?: boolean;
		disabled?: boolean;
		noRipple?: boolean;
		color?: ColorProps;
	},
	AnchorAttributes & ButtonAttributes
>;

export type CardTitleProps = KitProps<{
	ref?: HTMLElement | null;
	is?: 'div' | 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
	color?: string | false;
}>;

export type CardContentProps = KitProps<{
	ref?: HTMLElement | null;
	is?: 'div' | 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
	color?: string | false;
}>;

export type CardMediaProps = KitProps<{
	ref?: HTMLElement | null;
	is?: 'div' | 'span';
}>;

export type CardContainerProps = KitProps<{
	ref?: HTMLElement | null;
	is?: 'div' | 'span';
}>;

export type CardActionsProps = KitProps<{
	ref?: HTMLElement | null;
	is?: 'div' | 'span';
}>;
