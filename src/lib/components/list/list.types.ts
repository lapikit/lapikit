import type { Snippet } from 'svelte';
import type { Component, RoundedType, SizeType } from '$lib/utils/types/index.ts';

export type ListVariant = 'filled' | 'outline' | 'text';
export type ListDensity = 'compact' | 'comfortable' | 'default';
export type ListElement = 'div' | 'nav' | 'ul';
export type ListItemElement = 'div' | 'a' | 'button' | 'li';

export interface ListProps extends Component {
	ref?: HTMLElement | null;
	is?: ListElement;
	size?: SizeType;
	variant?: ListVariant;
	density?: ListDensity;
	rounded?: RoundedType;
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
	rounded?: RoundedType;
	active?: boolean;
	disabled?: boolean;
	noRipple?: boolean;
}
