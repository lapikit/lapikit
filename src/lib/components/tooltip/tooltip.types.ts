import type { ColorProps, Component, RoundedType } from '$lib/@types';
import type { Snippet } from 'svelte';

export interface TooltipProps extends Component {
	ref?: HTMLElement | null;
	open?: boolean;
	forceMount?: boolean;
	rounded?: RoundedType | 'full';
	label?: string;
	location?: 'top' | 'bottom' | 'left' | 'right';
	color?: ColorProps;
	delayDuration?: number;
	variant?: 'arrow';
	density?: 'dense' | 'compact' | 'default' | 'comfortable' | 'spacious';
	disabled?: boolean;
	avoidCollisions?: boolean;
	tooltip?: Snippet;
}
