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

export interface CardTitleProps extends Component {
	ref?: HTMLElement | null;
	is?: 'div' | 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export interface CardContentProps extends Component {
	ref?: HTMLElement | null;
	is?: 'div' | 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export interface CardMediaProps extends Component {
	ref?: HTMLElement | null;
	is?: 'div' | 'span';
}

export interface CardContainerProps extends Component {
	ref?: HTMLElement | null;
	is?: 'div' | 'span';
}

export interface CardActionsProps extends Component {
	ref?: HTMLElement | null;
	is?: 'div' | 'span';
}
