import type { ColorProps, KitProps } from '$lib/@types';

export type SpinnerProps = KitProps<{
	ref?: HTMLElement | null;
	size?: string | number;
	thickness?: string | number;
	label?: string;
	color?: ColorProps;
	children?: never;
}>;
