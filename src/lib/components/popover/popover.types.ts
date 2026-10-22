import type { ColorProps, Component, ElevationProps, RoundedType } from '$lib/@types';
import type { Snippet } from 'svelte';

export type ModelPopoverProps = {
	toggle: (element: HTMLElement | null) => void;
};

export interface PopoverProps extends Component {
	ref?: HTMLElement | null;
	open?: boolean;
	rounded?: RoundedType | 'full';
	position?: 'top' | 'bottom' | 'left' | 'right';
	color?: ColorProps;
	activator?: Snippet<[ModelPopoverProps]>;
	elevation?: ElevationProps;
	density?: 'dense' | 'compact' | 'default' | 'comfortable' | 'spacious';
}
