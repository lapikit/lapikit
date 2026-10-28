import type { ColorProps, Component, ElevationProps, RoundedType } from '$lib/@types';
import type { Snippet } from 'svelte';

/** The attributes to spread on the element that opens the popover */
export interface PopoverTriggerProps {
	'aria-haspopup': 'dialog';
	'aria-expanded': boolean;
	'aria-controls': string;
	onclick: (event: MouseEvent) => void;
}

export interface PopoverProps extends Component {
	ref?: HTMLElement | null;
	open?: boolean;
	rounded?: RoundedType | 'full';
	position?: 'top' | 'bottom' | 'left' | 'right';
	color?: ColorProps;
	trigger?: Snippet<[PopoverTriggerProps]>;
	elevation?: ElevationProps;
	density?: 'dense' | 'compact' | 'default' | 'comfortable' | 'spacious';
	/** removed in 0.8.0: use the trigger snippet */
	activator?: never;
}
