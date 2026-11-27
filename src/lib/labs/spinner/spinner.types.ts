import type { ColorProps, KitProps } from '$lib/@types';

export type SpinnerProps = KitProps<{
	ref?: HTMLElement | null;
	value?: number | null;
	max?: number;
	size?: string | number;
	thickness?: string | number;
	label?: string;
	color?: ColorProps;
	children?: never;
}>;
