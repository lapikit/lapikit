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

type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

export type ModalProps = KitProps<
	{
		ref?: HTMLDialogElement | null;
		open?: boolean;
		contain?: boolean;
		size?: ModalSize;
		persistent?: boolean;
		position?: OverlayPositionType;
		rounded?: RoundedType | 'full';
		density?: DensityType;
		classContent?: ClassValue;
		color?: ColorProps;
		closeWithEsc?: boolean;
		space?: string;
		elevation?: ElevationProps;
	},
	DialogAttributes
>;
