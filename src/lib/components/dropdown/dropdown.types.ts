import type { Component, PropValue, RoundedType } from '$lib/@types/index';
import type { Snippet } from 'svelte';

export type PositionElement = {
	x: number;
	y: number;
	location: 'top' | 'bottom' | 'left' | 'right' | null;
};

export type ModelDropdownProps = {
	open: boolean;
	close: () => void;
	toggle: (element: HTMLElement | PointerEvent | null) => void;
};

export interface DropdownProps extends Component {
	ref?: HTMLElement | null;
	rounded?: RoundedType | string;
	position?: 'top' | 'bottom' | 'left' | 'right';
	openOnHover?: boolean;
	closeOnClick?: boolean;
	color?: string;
	background?: string;
	activator?: Snippet<
		[
			ModelDropdownProps,
			(state: 'open' | 'close', element: HTMLElement | PointerEvent | null) => void
		]
	>;
	[key: string]: PropValue | Record<string, PropValue> | unknown;
}
