import type { Snippet } from 'svelte';
import type {
	ColorProps,
	DensityType,
	ElevationProps,
	KitProps,
	RoundedType,
	SizeType,
	VariantType
} from '$lib/@types';

type AlertTone = 'default' | 'info' | 'success' | 'warning' | 'error';

export type AlertProps = KitProps<{
	ref?: HTMLElement | null;
	is?: 'div' | 'section' | 'aside' | 'article';
	open?: boolean;
	closable?: boolean;
	closeLabel?: string;
	multiline?: boolean;
	variant?: VariantType;
	size?: SizeType;
	density?: DensityType;
	rounded?: RoundedType | 'full';
	tone?: AlertTone;
	color?: ColorProps;
	prepend?: Snippet;
	append?: Snippet;
	close?: Snippet;
	elevation?: ElevationProps;
}>;
