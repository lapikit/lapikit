import type { Component, SizeType } from '$lib/@types';
import type { TooltipValue } from '../tooltip/tooltip.types';

export interface IconProps extends Component {
	ref?: HTMLElement | null;
	is?: 'i' | 'span';
	name?: string;
	src?: string;
	icon?: string;
	size?: SizeType;
	alt?: string;
	label?: string;
	/** text of a tooltip on hover and keyboard focus, or its options */
	tooltip?: TooltipValue;
	decorative?: boolean;
	loading?: 'eager' | 'lazy';
	decoding?: 'sync' | 'async' | 'auto';
	color?: string | false;
	colorMode?: 'auto' | 'none' | 'mask' | 'filter';
	imgFilter?: string;
}
