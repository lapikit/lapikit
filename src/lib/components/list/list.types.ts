import type { Snippet } from 'svelte';
import type {
	AnchorAttributes,
	ButtonAttributes,
	ColorProps,
	DensityType,
	KitProps,
	RoundedType,
	SizeType,
	VariantType
} from '$lib/@types';

export type ListVariant = VariantType | 'plain';
export type ListElement = 'div' | 'nav' | 'ul';
export type ListItemElement = 'div' | 'a' | 'button' | 'li';

export type ListProps = KitProps<{
	ref?: HTMLElement | null;
	is?: ListElement;
	size?: SizeType;
	variant?: ListVariant;
	density?: DensityType;
	rounded?: RoundedType | 'full';
	nav?: boolean;
	color?: string | false;
}>;

export type ListItemProps = KitProps<
	{
		ref?: HTMLElement | null;
		is?: ListItemElement;
		href?: string;
		append?: Snippet;
		prepend?: Snippet;
		color?: ColorProps;
		interactive?: boolean;
		active?: boolean;
		disabled?: boolean;
		noRipple?: boolean;
	},
	AnchorAttributes & ButtonAttributes
>;
