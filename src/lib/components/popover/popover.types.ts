import type { Component, DensityType, ElevationProps, PropValue, RoundedType } from '$lib/@types';
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
	rounded?: RoundedType;
	position?: 'top' | 'bottom' | 'left' | 'right';
	color?: string;
	background?: string;
	activator?: Snippet<[ModelPopoverProps]>;
	elevation?: ElevationProps;
	density?: DensityType;
	[key: string]: PropValue | Record<string, PropValue> | unknown;
}
