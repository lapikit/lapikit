import type { ColorProps, KitProps, RoundedType } from '$lib/@types';

export type ProgressProps = KitProps<{
	ref?: HTMLElement | null;
	value?: number | null;
	max?: number;
	label?: string;
	color?: ColorProps;
	thickness?: string | number;
	rounded?: RoundedType | 'full';
	children?: never;
}>;
