import type { Snippet } from 'svelte';
import type { ColorProps, Component, ElevationProps, RoundedType, SizeType } from '$lib/@types';

type AlertVariant = 'filled' | 'tonal' | 'outline' | 'surface' | 'text';
type AlertTone = 'default' | 'info' | 'success' | 'warning' | 'error';

export interface AlertProps extends Component {
	ref?: HTMLElement | null;
	is?: 'div' | 'section' | 'aside' | 'article';
	open?: boolean;
	closable?: boolean;
	closeLabel?: string;
	multiline?: boolean;
	variant?: AlertVariant;
	size?: SizeType;
	density?: 'dense' | 'compact' | 'default' | 'comfortable' | 'spacious';
	rounded?: RoundedType | 'full';
	tone?: AlertTone;
	color?: ColorProps;
	prepend?: Snippet;
	append?: Snippet;
	close?: Snippet;
	elevation?: ElevationProps;
}
