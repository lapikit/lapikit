import type { Component, SizeType } from '$lib/internal/types/index.js';

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
	type?: 'button' | 'submit' | 'reset' | 'checkbox' | 'radio';
	value?: string | number | boolean;
	label?: string;
	block?: boolean;
	wide?: boolean;
}
