import type { ClassValue } from 'svelte/elements';
import type {
	ColorProps,
	DensityType,
	ElevationProps,
	KitProps,
	RoundedType,
	SizeType,
	VariantType
} from '$lib/@types';

export type AppbarProps = KitProps<{
	ref?: HTMLElement | null;
	is?: 'div' | 'header' | 'nav';
	variant?: VariantType;
	rounded?: RoundedType | 'full';
	density?: DensityType;
	size?: SizeType;
	color?: ColorProps;
	classContent?: ClassValue;
	elevation?: ElevationProps;
}>;
