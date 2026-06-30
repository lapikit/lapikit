import type { Component, DensityType, RoundedType } from '$lib/@types';

export interface CardProps extends Component {
	ref?: HTMLElement | null;
	is?: 'div' | 'article' | 'section' | 'aside' | 'a' | 'button';
	href?: string;
	type?: 'button' | 'submit' | 'reset';
	variant?: 'filled' | 'outline' | 'text';
	density?: DensityType;
	rounded?: RoundedType;
	interactive?: boolean;
	active?: boolean;
	disabled?: boolean;
	noRipple?: boolean;
}
