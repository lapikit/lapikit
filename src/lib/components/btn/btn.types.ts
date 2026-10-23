import type { ColorProps, Component, ElevationProps, RoundedType, SizeType } from '$lib/@types';
import type { Snippet } from 'svelte';

export interface ButtonProps extends Component {
	ref?: HTMLElement | null;
	is?: 'button' | 'a' | 'input';
	input?: boolean;
	href?: string;
	variant?: 'filled' | 'tonal' | 'outline' | 'text' | 'plain' | 'surface' | 'link';
	density?: 'dense' | 'compact' | 'default' | 'comfortable' | 'spacious';
	active?: boolean;
	loading?: boolean;
	disabled?: boolean;
	checked?: boolean;
	size?: SizeType;
	rounded?: RoundedType | 'full';
	type?: 'button' | 'submit' | 'reset' | 'checkbox' | 'radio';
	value?: string | number | boolean;
	label?: string;
	block?: boolean;
	wide?: boolean;
	noRipple?: boolean;
	icon?: boolean;
	load?: Snippet;
	append?: Snippet;
	prepend?: Snippet;
	elevation?: ElevationProps;
	color?: ColorProps;
}
