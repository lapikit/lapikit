import type { Component, RoundedType } from '$lib/labs/utils/types/index.js';

export type DialogSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type DialogPosition = 'top' | 'center' | 'bottom';
export type DialogDensity = 'compact' | 'comfortable' | 'default';

export interface DialogProps extends Component {
	ref?: HTMLDialogElement | null;
	open?: boolean;
	persistent?: boolean;
	size?: DialogSize;
	position?: DialogPosition;
	density?: DialogDensity;
	rounded?: RoundedType;
	classContent?: string | string[] | undefined;
	color?: string;
	background?: string;
}
