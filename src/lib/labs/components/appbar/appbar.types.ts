import type { Component, RoundedType } from '$lib/labs/utils/types/index.js';

type Density = 'compact' | 'comfortable' | 'default';
type Variant = 'outline' | 'text';

export interface AppbarProps extends Component {
	ref?: HTMLElement | null;
	is?: 'div' | 'header' | 'nav';
	variant?: Variant;
	rounded?: RoundedType | string;
	density?: Density | Record<string, Density>;
	dark?: boolean;
	light?: boolean;
	color?: string;
	background?: string;
	classContent?: string | string[] | undefined;
}
