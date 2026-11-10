import type { KitProps } from '$lib/@types';

type Orientation = 'horizontal' | 'vertical';

export type SeparatorProps = KitProps<{
	ref?: HTMLElement | null;
	is?: 'div' | 'hr';
	inset?: boolean;
	thickness?: string | number;
	color?: string | false;
	orientation?: Orientation;
	children?: never;
}>;
