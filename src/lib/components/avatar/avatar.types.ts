import type { Component, DensityType, ElevationProps, RoundedType, SizeType } from '$lib/@types';

export interface AvatarProps extends Component {
	ref?: HTMLElement | null;
	label?: string;
	size?: SizeType;
	density?: DensityType;
	rounded?: RoundedType | 'full';
	elevation?: ElevationProps;
	color?: string;
	background?: string;
}
