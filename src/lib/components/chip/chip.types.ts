import type { ColorProps, Component, ElevationProps, RoundedType, SizeType } from '$lib/@types';
import type { Snippet } from 'svelte';

export interface ChipProps extends Component {
	ref?: HTMLElement | null;
	is?: 'div' | 'a' | 'input' | 'button';
	input?: boolean;
	href?: string;
	variant?: 'filled' | 'tonal' | 'outline' | 'text' | 'plain' | 'surface';
	density?: 'dense' | 'compact' | 'default' | 'comfortable' | 'spacious';
	rounded?: RoundedType | 'full';
	interactive?: boolean;
	active?: boolean;
	loading?: boolean;
	disabled?: boolean;
	checked?: boolean;
	size?: SizeType;
	labelStyle?: boolean;
	type?: 'button' | 'submit' | 'reset' | 'checkbox' | 'radio';
	value?: string | number | boolean;
	label?: string;
	noRipple?: boolean;
	readonly?: boolean;
	load?: Snippet;
	append?: Snippet;
	prepend?: Snippet;
	elevation?: ElevationProps;
	color?: ColorProps;
}
