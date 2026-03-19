import type { Component, RoundedType } from '$lib/utils/types/index.ts';

export interface CardProps extends Component {
	ref?: HTMLElement | null;
	is?: 'div' | 'article' | 'section' | 'aside' | 'a' | 'button';
	href?: string;
	type?: 'button' | 'submit' | 'reset';
	variant?: 'filled' | 'outline' | 'text';
	density?: 'compact' | 'default' | 'comfortable';
	rounded?: RoundedType;
	interactive?: boolean;
	active?: boolean;
	disabled?: boolean;
	noRipple?: boolean;
}
