import type { Component, RoundedType } from '$lib/@types';

type Density = 'compact' | 'comfortable' | 'default';
type Variant = 'filled' | 'outline' | 'text';

export interface AppbarProps extends Component {
	ref?: HTMLElement | null;
	is?: 'div' | 'header' | 'nav';
	variant?: Variant;
	rounded?: RoundedType | string;
	density?: Density | Record<string, Density>;
	color?: string;
	background?: string;
	classContent?: string | string[] | undefined;
}
