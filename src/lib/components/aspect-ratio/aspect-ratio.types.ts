import type { KitProps } from '$lib/@types';

export type AspectRatioValue = string | number;
type AspectRatioFit = 'cover' | 'contain' | 'fill';

export type AspectRatioProps = KitProps<{
	ref?: HTMLElement | null;
	is?: 'div' | 'span' | 'figure' | 'section' | 'article';
	ratio?: AspectRatioValue;
	aspectRatio?: AspectRatioValue;
	fit?: AspectRatioFit;
	inline?: boolean;
}>;
