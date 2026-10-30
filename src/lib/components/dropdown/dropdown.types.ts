import type { ColorProps, Component, ElevationProps, RoundedType } from '$lib/@types/index';
import type { Snippet } from 'svelte';

/** The attributes to spread on the element that opens the menu */
export interface DropdownTriggerProps {
	'aria-haspopup': 'menu';
	'aria-expanded': boolean;
	'aria-controls': string;
	onclick: (event: MouseEvent) => void;
	onkeydown: (event: KeyboardEvent) => void;
	onpointerenter?: (event: PointerEvent) => void;
	onpointerleave?: (event: PointerEvent) => void;
}

/** The state of the menu, for a trigger that needs more than the props */
export interface DropdownTriggerModel {
	open: boolean;
	close: () => void;
	/** opens the menu at the position of the pointer (context menu) */
	openAt: (event: MouseEvent) => void;
}

export interface DropdownProps extends Component {
	ref?: HTMLElement | null;
	open?: boolean;
	rounded?: RoundedType | 'full';
	position?: 'top' | 'bottom' | 'left' | 'right';
	openOnHover?: boolean;
	closeOnClick?: boolean;
	color?: ColorProps;
	density?: 'dense' | 'compact' | 'default' | 'comfortable' | 'spacious';
	trigger?: Snippet<[DropdownTriggerProps, DropdownTriggerModel]>;
	elevation?: ElevationProps;
	/** removed in 0.8.0: use the trigger snippet */
	activator?: never;
}
