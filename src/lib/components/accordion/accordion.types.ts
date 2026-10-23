import type { ColorProps, Component, ElevationProps, RoundedType, SizeType } from '$lib/@types';
import type { Snippet } from 'svelte';

type AccordionVariant = 'filled' | 'tonal' | 'outline' | 'surface' | 'text';

export type ModelAccordionItemProps = {
	open: boolean;
};

export interface AccordionProps extends Component {
	ref?: HTMLElement | null;
	is?: 'div';
	text?: string;
	color?: string | false;
	rounded?: RoundedType | 'full';
	size?: SizeType;
	variant?: AccordionVariant;
	density?: 'dense' | 'compact' | 'default' | 'comfortable' | 'spacious';
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
	color?: ColorProps;
	readOnly?: boolean;
	open?: boolean;
	disabled?: boolean;
	toggle?: (index: number | string) => void;
	indicator?: Snippet<[AccordionItemModelProps]>;
	activator?: Snippet;
	elevation?: ElevationProps;
}
