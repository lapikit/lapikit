import type { Base } from '$lib/@types';

type Orientation = 'horizontal' | 'vertical';

export interface SeparatorProps extends Base {
	ref?: HTMLElement | null;
	is?: 'div' | 'hr';
	inset?: boolean;
	thickness?: string | number;
	color?: string;
	orientation?: Orientation;
}
