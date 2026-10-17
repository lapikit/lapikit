import type { ColorProps, Component, ElevationProps, RoundedType } from '$lib/@types';

export interface SheetProps extends Component {
	ref?: HTMLElement | null;
	is?: 'div' | 'article' | 'section' | 'aside' | 'a' | 'button';
	href?: string;
	type?: 'button' | 'submit' | 'reset';
	variant?: 'filled' | 'tonal' | 'outline' | 'text' | 'plain' | 'surface';
	rounded?: RoundedType | 'full';
	density?: 'dense' | 'compact' | 'default' | 'comfortable' | 'spacious';
	elevation?: ElevationProps;
	active?: boolean;
	color?: ColorProps;
	interactive?: boolean;
	disabled?: boolean;
	noRipple?: boolean;
}
