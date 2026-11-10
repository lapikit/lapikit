import type { ClassValue } from 'svelte/elements';
import type {
	ColorProps,
	DensityType,
	DialogAttributes,
	ElevationProps,
	KitProps,
	OverlayPositionType,
	RoundedType
} from '$lib/@types';

type DialogSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type DialogProps = KitProps<
	{
		ref?: HTMLDialogElement | null;
		open?: boolean;
		persistent?: boolean;
		size?: DialogSize;
		position?: OverlayPositionType;
		density?: DensityType;
		rounded?: RoundedType | 'full';
		classContent?: ClassValue;
		color?: ColorProps;
		elevation?: ElevationProps;
		space?: string;
	},
	DialogAttributes
>;
