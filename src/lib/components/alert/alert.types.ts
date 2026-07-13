import type { Snippet } from 'svelte';
import type { Component, DensityType, RoundedType } from '$lib/@types';

export type AlertVariant = 'filled' | 'outline' | 'text';
export type AlertTone = 'default' | 'info' | 'success' | 'warning' | 'error';

export interface AlertProps extends Component {
	ref?: HTMLElement | null;
	is?: 'div' | 'section' | 'aside' | 'article';
	open?: boolean;
	closable?: boolean;
	variant?: AlertVariant;
	density?: DensityType;
	rounded?: RoundedType;
	tone?: AlertTone;
	color?: string;
	background?: string;
	prepend?: Snippet;
	append?: Snippet;
	close?: Snippet;
}
