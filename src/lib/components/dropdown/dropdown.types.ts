import type { ColorProps, Component, ElevationProps, RoundedType } from '$lib/@types/index';
import type { Snippet } from 'svelte';

export type ModelDropdownProps = {
	open: boolean;
	close: () => void;
	toggle: (element: HTMLElement | PointerEvent | null) => void;
};

export type ModelDropdownHandleProps = (
	state: 'open' | 'close',
	element: HTMLElement | PointerEvent | null
) => void;

export interface DropdownProps extends Component {
	ref?: HTMLElement | null;
	rounded?: RoundedType | 'full';
	position?: 'top' | 'bottom' | 'left' | 'right';
	openOnHover?: boolean;
	closeOnClick?: boolean;
	color?: ColorProps;
	density?: 'dense' | 'compact' | 'default' | 'comfortable' | 'spacious';
	activator?: Snippet<
		[
			ModelDropdownProps,
			(state: 'open' | 'close', element: HTMLElement | PointerEvent | null) => void
		]
	>;
	elevation?: ElevationProps;
}
