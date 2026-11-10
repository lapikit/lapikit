import type {
	ColorProps,
	DensityType,
	ElevationProps,
	KitProps,
	RoundedType,
	SizeType
} from '$lib/@types';

export type AvatarProps = KitProps<{
	ref?: HTMLElement | null;
	label?: string;
	size?: SizeType;
	density?: DensityType;
	rounded?: RoundedType | 'full';
	elevation?: ElevationProps;
	color?: ColorProps;
}>;
