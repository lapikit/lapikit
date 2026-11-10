import type { FloatingSide } from '$lib/utils/floating';
import type { ColorProps, DensityType, ElevationProps, KitProps, RoundedType } from '$lib/@types';
import type { Snippet } from 'svelte';

/** The attributes to spread on the element that opens the popover */
export interface PopoverTriggerProps {
	'aria-haspopup': 'dialog';
	'aria-expanded': boolean;
	'aria-controls': string;
	onclick: (event: MouseEvent) => void;
}

export type PopoverProps = KitProps<{
	ref?: HTMLElement | null;
	open?: boolean;
	rounded?: RoundedType | 'full';
	position?: FloatingSide;
	color?: ColorProps;
	trigger?: Snippet<[PopoverTriggerProps]>;
	elevation?: ElevationProps;
	density?: DensityType;
	/** removed in 0.8.0: use the trigger snippet */
	activator?: never;
}>;
