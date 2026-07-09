import type { Snippet } from 'svelte';
import type { Component, DensityType, RoundedTypeWithFull, SizeType } from '$lib/@types';

export type ListVariant = 'filled' | 'outline' | 'text';
export type ListElement = 'div' | 'nav' | 'ul';
export type ListItemElement = 'div' | 'a' | 'button' | 'li';

export interface ListProps extends Component {
	ref?: HTMLElement | null;
	is?: ListElement;
	size?: SizeType;
	variant?: ListVariant;
	density?: DensityType;
	rounded?: RoundedTypeWithFull;
	nav?: boolean;
	color?: string;
	background?: string;
}

export interface ListItemProps extends Component {
	ref?: HTMLElement | null;
	is?: ListItemElement;
	href?: string;
	append?: Snippet;
	prepend?: Snippet;
	color?: string;
	background?: string;
	rounded?: RoundedTypeWithFull;
	interactive?: boolean;
	active?: boolean;
	disabled?: boolean;
	noRipple?: boolean;
}
