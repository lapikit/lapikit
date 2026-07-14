import type { RoundedType, Component, SizeType, DensityType, ElevationProps } from '$lib/@types';
import type { Snippet } from 'svelte';

type AccordionVariant = 'filled' | 'outline' | 'text';

export type ModelAccordionItemProps = {
	open: boolean;
};

export interface AccordionProps extends Component {
	ref?: HTMLElement | null;
	is?: 'div';
	text?: string;
	color?: string;
	background?: string;
	rounded?: RoundedType | 'full';
	size?: SizeType;
	variant?: AccordionVariant;
	density?: DensityType;
	spacer?: boolean;
	hideIcon?: boolean;
}

export type AccordionItemModelProps = {
	open: boolean;
};

export interface AccordionItemProps extends Component {
	ref?: HTMLElement | null;
	is?: 'div';
	index: number | string;
	text?: string;
	color?: string;
	background?: string;
	readOnly?: boolean;
	open?: boolean;
	disabled?: boolean;
	toggle?: (index: number | string) => void;
	indicator?: Snippet<[AccordionItemModelProps]>;
	activator?: Snippet;
	elevation?: ElevationProps;
}
