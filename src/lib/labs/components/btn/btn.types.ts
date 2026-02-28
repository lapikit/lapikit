import type { Component, RoundedType, SizeType } from '$lib/labs/utils/types/index.js';

export interface ButtonProps extends Component {
	ref?: HTMLElement | null;
	is?: 'button' | 'a' | 'input';
	input?: boolean;
	href?: string;
	variant?: 'outline' | 'text' | 'filled' | 'link';
	density?: 'compact' | 'comfortable' | 'default';
	active?: boolean;
	loading?: boolean;
	disabled?: boolean;
	checked?: boolean;
	size?: SizeType;
	rounded?: RoundedType;
	type?: 'button' | 'submit' | 'reset' | 'checkbox' | 'radio';
	value?: string | number | boolean;
	label?: string;
	block?: boolean;
	wide?: boolean;
	noRipple?: boolean;
}
