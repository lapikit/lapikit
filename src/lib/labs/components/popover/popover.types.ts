import type { Component, PropValue, RoundedType } from '$lib/labs/utils/types/index.js';
import type { Snippet } from 'svelte';

export type PositionElement = {
	x: number;
	y: number;
	location: 'top' | 'bottom' | 'left' | 'right' | null;
};

export type ModelPopoverProps = {
	toggle: (element: HTMLElement | null) => void;
};

export interface PopoverProps extends Component {
	ref?: HTMLElement | null;
	open?: boolean;
	dark?: boolean;
	light?: boolean;
	rounded?: RoundedType | string;
	position?: 'top' | 'bottom' | 'left' | 'right';
	color?: string;
	background?: string;
	activator?: Snippet<[ModelPopoverProps]>;
	[key: string]: PropValue | Record<string, PropValue> | unknown;
}
