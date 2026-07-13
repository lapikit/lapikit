import type { Component, DensityType, ElevationProps, RoundedType } from '$lib/@types';

type Variant = 'filled' | 'outline' | 'text';

export interface AppbarProps extends Component {
	ref?: HTMLElement | null;
	is?: 'div' | 'header' | 'nav';
	variant?: Variant;
	rounded?: RoundedType | 'full';
	density?: DensityType;
	color?: string;
	background?: string;
	classContent?: string | string[] | undefined;
	elevation?: ElevationProps;
}
