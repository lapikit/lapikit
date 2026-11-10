import type {
	ColorProps,
	DensityType,
	ElevationProps,
	KitProps,
	RoundedType,
	SizeType,
	VariantType
} from '$lib/@types';
import type { Snippet } from 'svelte';

export type ModelAccordionItemProps = {
	open: boolean;
};

export type AccordionProps = KitProps<{
	ref?: HTMLElement | null;
	is?: 'div';
	text?: string;
	color?: string | false;
	rounded?: RoundedType | 'full';
	size?: SizeType;
	variant?: VariantType;
	density?: DensityType;
	spacer?: boolean;
	hideIcon?: boolean;
}>;

export type AccordionItemProps = KitProps<{
	ref?: HTMLElement | null;
	is?: 'div';
	index: number | string;
	text?: string;
	color?: ColorProps;
	readOnly?: boolean;
	open?: boolean;
	disabled?: boolean;
	toggle?: (index: number | string) => void;
	indicator?: Snippet<[ModelAccordionItemProps]>;
	activator?: Snippet;
	elevation?: ElevationProps;
}>;
