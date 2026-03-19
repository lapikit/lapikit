import type { Snippet } from 'svelte';
import type { Component, RoundedType } from '$lib/utils/types/index.ts';

export type AlertVariant = 'filled' | 'outline' | 'text';
export type AlertDensity = 'compact' | 'comfortable' | 'default';
export type AlertTone = 'default' | 'info' | 'success' | 'warning' | 'error';

export interface AlertProps extends Component {
	ref?: HTMLElement | null;
	is?: 'div' | 'section' | 'aside' | 'article';
	open?: boolean;
	closable?: boolean;
	variant?: AlertVariant;
	density?: AlertDensity;
	rounded?: RoundedType;
	tone?: AlertTone;
	info?: boolean;
	success?: boolean;
	warning?: boolean;
	error?: boolean;
	color?: string;
	background?: string;
	prepend?: Snippet;
	append?: Snippet;
	close?: Snippet;
}
