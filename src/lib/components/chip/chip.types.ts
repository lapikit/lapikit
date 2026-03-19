import type { Component, SizeType } from '$lib/utils/types/index.ts';
import type { Snippet } from 'svelte';

export interface ChipProps extends Component {
	ref?: HTMLElement | null;
	is?: 'div' | 'a' | 'input' | 'button';
	input?: boolean;
	href?: string;
	variant?: 'outline' | 'text' | 'filled' | 'link';
	density?: 'compact' | 'comfortable' | 'default';
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
}
