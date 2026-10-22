import type { ClassValue } from 'svelte/elements';
import type { ColorProps, Component, ElevationProps, RoundedType, SizeType } from '$lib/@types';

type Variant = 'filled' | 'tonal' | 'outline' | 'surface' | 'text';
type Orientation = 'horizontal' | 'vertical';

export interface ToolbarProps extends Component {
	ref?: HTMLElement | null;
	is?: 'div' | 'header' | 'nav';
	variant?: Variant;
	rounded?: RoundedType | 'full';
	density?: 'dense' | 'compact' | 'default' | 'comfortable' | 'spacious';
	color?: ColorProps;
	orientation?: Orientation;
	classContent?: ClassValue;
	elevation?: ElevationProps;
	size?: SizeType;
}
