import type { Component } from '$lib/utils/types/index.ts';

export type AspectRatioValue = string | number;
export type AspectRatioFit = 'cover' | 'contain' | 'fill';

export interface AspectRatioProps extends Component {
	ref?: HTMLElement | null;
	is?: 'div' | 'span' | 'figure' | 'section' | 'article';
	ratio?: AspectRatioValue;
	aspectRatio?: AspectRatioValue;
	fit?: AspectRatioFit;
	inline?: boolean;
}
