import type { Snippet } from 'svelte';
import type { ColorProps, Component, RoundedType, SizeType } from '$lib/@types';

export type ListVariant = 'filled' | 'tonal' | 'outline' | 'surface' | 'text' | 'plain';
export type ListElement = 'div' | 'nav' | 'ul';
export type ListItemElement = 'div' | 'a' | 'button' | 'li';

export interface ListProps extends Component {
	ref?: HTMLElement | null;
	is?: ListElement;
	size?: SizeType;
	variant?: ListVariant;
	density?: 'dense' | 'compact' | 'default' | 'comfortable' | 'spacious';
	rounded?: RoundedType | 'full';
	nav?: boolean;
	color?: string | false;
}

export interface ListItemProps extends Component {
	ref?: HTMLElement | null;
	is?: ListItemElement;
	href?: string;
	append?: Snippet;
	prepend?: Snippet;
	color?: ColorProps;
	interactive?: boolean;
	active?: boolean;
	disabled?: boolean;
	noRipple?: boolean;
}
