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

type Orientation = 'horizontal' | 'vertical';

export type ToolbarProps = KitProps<{
	ref?: HTMLElement | null;
	is?: 'div' | 'header' | 'nav';
	variant?: VariantType;
	rounded?: RoundedType | 'full';
	density?: DensityType;
	color?: ColorProps;
	orientation?: Orientation;
	classContent?: ClassValue;
	elevation?: ElevationProps;
	size?: SizeType;
}>;
