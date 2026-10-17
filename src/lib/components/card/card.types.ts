import type { ColorProps, Component, ElevationProps, RoundedType } from '$lib/@types';

export interface CardProps extends Component {
	ref?: HTMLElement | null;
	is?: 'div' | 'article' | 'section' | 'aside' | 'a' | 'button';
	href?: string;
	type?: 'button' | 'submit' | 'reset';
	variant?: 'filled' | 'tonal' | 'outline' | 'text' | 'plain' | 'surface';
	density?: 'dense' | 'compact' | 'default' | 'comfortable' | 'spacious';
	rounded?: RoundedType;
	elevation?: ElevationProps;
	interactive?: boolean;
	active?: boolean;
	disabled?: boolean;
	noRipple?: boolean;
	color?: ColorProps;
}

export interface CardTitleProps extends Component {
	ref?: HTMLElement | null;
	is?: 'div' | 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
	color?: string;
}

export interface CardContentProps extends Component {
	ref?: HTMLElement | null;
	is?: 'div' | 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
	color?: string;
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
