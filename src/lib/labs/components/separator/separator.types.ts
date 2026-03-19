import type { Base } from '$lib/labs/utils/types/index.js';

type Orientation = 'horizontal' | 'vertical';

export interface SeparatorProps extends Base {
	ref?: HTMLElement | null;
	is?: 'div' | 'hr';
	light?: boolean;
	dark?: boolean;
	inset?: boolean;
	thickness?: string | number;
	opacity?: string | number;
	color?: string;
	orientation?: Orientation | Record<string, Orientation>;
}
