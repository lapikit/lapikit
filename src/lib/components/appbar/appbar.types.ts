import type { ClassValue } from 'svelte/elements';
import type { ColorProps, Component, ElevationProps, RoundedType, SizeType } from '$lib/@types';

type Variant = 'filled' | 'tonal' | 'outline' | 'surface' | 'text';

export interface AppbarProps extends Component {
	ref?: HTMLElement | null;
	is?: 'div' | 'header' | 'nav';
	variant?: Variant;
	rounded?: RoundedType | 'full';
	density?: 'dense' | 'compact' | 'default' | 'comfortable' | 'spacious';
	size?: SizeType;
	color?: ColorProps;
	classContent?: ClassValue;
	elevation?: ElevationProps;
}
