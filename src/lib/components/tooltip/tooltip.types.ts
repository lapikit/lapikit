import type { Component, PropValue, RoundedType } from '$lib/@types';
import type { Snippet } from 'svelte';

export interface TooltipProps extends Component {
	ref?: HTMLElement | null;
	open?: boolean;
	forceMount?: boolean;
	dark?: boolean;
	light?: boolean;
	rounded?: RoundedType | string;
	label?: string;
	location?: 'top' | 'bottom' | 'left' | 'right';
	color?: string;
	background?: string;
	delayDuration?: number;
	variant?: 'arrow';
	density?: 'compact' | 'comfortable' | 'default';
	disabled?: boolean;
	avoidCollisions?: boolean;
	tooltip?: Snippet;
	[key: string]: PropValue | Record<string, PropValue> | unknown;
}

export type PositionElement = {
	x: number;
	y: number;
	location: 'top' | 'bottom' | 'left' | 'right' | null;
};
