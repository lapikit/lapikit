import type { Component, SizeType } from '$lib/labs/utils/types/index.js';

export interface IconProps extends Component {
	ref?: HTMLElement | null;
	name?: string;
	src?: string;
	icon?: string;
	size?: SizeType;
	alt?: string;
	label?: string;
	decorative?: boolean;
	loading?: 'eager' | 'lazy';
	decoding?: 'sync' | 'async' | 'auto';
	color?: string;
	colorMode?: 'auto' | 'none' | 'mask' | 'filter';
	imgFilter?: string;
}
