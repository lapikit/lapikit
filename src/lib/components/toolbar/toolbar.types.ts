import type { Component, PropValue, RoundedType } from '$lib/@types';

type Variant = 'filled' | 'outline' | 'text' | 'dash';
type Density = 'compact' | 'comfortable' | 'default';
type Orientation = 'horizontal' | 'vertical';
type Location = 'top' | 'bottom';

export interface ToolbarProps extends Component {
	ref?: HTMLElement | null;
	is?: 'div' | 'header' | 'nav';
	variant?: Variant | Record<string, Variant>;
	rounded?: RoundedType | string;
	density?: Density | Record<string, Density>;
	color?: string;
	orientation?: Orientation | Record<string, Orientation>;
	background?: string;
	location?: Location | Record<string, Location>;
	classContent?: string | string[] | undefined;
	[key: string]: PropValue | Record<string, PropValue> | unknown;
}
