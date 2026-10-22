import type { ColorProps, Component, ElevationProps, RoundedType, SizeType } from '$lib/@types';

export interface AvatarProps extends Component {
	ref?: HTMLElement | null;
	label?: string;
	size?: SizeType;
	density?: 'dense' | 'compact' | 'default' | 'comfortable' | 'spacious';
	rounded?: RoundedType | 'full';
	elevation?: ElevationProps;
	color?: ColorProps;
}
