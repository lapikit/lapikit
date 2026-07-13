import type { Snippet } from 'svelte';
import type { Component, DensityType, ElevationProps, RoundedType, SizeType } from '$lib/@types';

type AlertVariant = 'filled' | 'outline' | 'text';
type AlertTone = 'default' | 'info' | 'success' | 'warning' | 'error';

export interface AlertProps extends Component {
	ref?: HTMLElement | null;
	is?: 'div' | 'section' | 'aside' | 'article';
	open?: boolean;
	closable?: boolean;
	variant?: AlertVariant;
	size?: SizeType;
	density?: DensityType;
	rounded?: RoundedType | 'full';
	tone?: AlertTone;
	color?: string;
	background?: string;
	prepend?: Snippet;
	append?: Snippet;
	close?: Snippet;
	elevation?: ElevationProps;
}
