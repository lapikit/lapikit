import type { ColorProps, Component, RoundedType } from '$lib/@types';
import type { Snippet } from 'svelte';

/** The attributes to spread on the element that shows the tooltip */
export interface TooltipTriggerProps {
	'aria-describedby'?: string;
	'aria-labelledby'?: string;
	onpointerenter: (event: PointerEvent) => void;
	onpointerleave: (event: PointerEvent) => void;
	onpointerdown: (event: PointerEvent) => void;
	onfocus: (event: FocusEvent) => void;
	onblur: (event: FocusEvent) => void;
}

export interface TooltipProps extends Omit<Component, 'children'> {
	ref?: HTMLElement | null;
	open?: boolean;
	rounded?: RoundedType | 'full';
	label?: string;
	/** the tooltip names the trigger (aria-labelledby) instead of describing it */
	asLabel?: boolean;
	location?: 'top' | 'bottom' | 'left' | 'right';
	color?: ColorProps;
	delayDuration?: number;
	closeDelay?: number;
	variant?: 'arrow';
	density?: 'dense' | 'compact' | 'default' | 'comfortable' | 'spacious';
	disabled?: boolean;
	avoidCollisions?: boolean;
	trigger?: Snippet<[TooltipTriggerProps]>;
	tooltip?: Snippet;
	/** removed in 0.8.0: use the trigger snippet */
	children?: never;
}

/** The tooltip prop of kit:btn, kit:chip and kit:icon */
export interface TooltipOptions {
	label: string;
	location?: TooltipProps['location'];
	variant?: TooltipProps['variant'];
	density?: TooltipProps['density'];
	rounded?: TooltipProps['rounded'];
	delayDuration?: number;
	closeDelay?: number;
}

export type TooltipValue = string | TooltipOptions | null | undefined | false;
