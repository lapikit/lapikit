import type { ClassValue } from 'svelte/elements';
import type { ColorProps, Component, ElevationProps, RoundedType } from '$lib/@types';

type DialogSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type DialogPosition =
	| 'top'
	| 'center'
	| 'bottom'
	| 'top-left'
	| 'top-right'
	| 'center-left'
	| 'center-right'
	| 'bottom-left'
	| 'bottom-right';

export interface DialogProps extends Component {
	ref?: HTMLDialogElement | null;
	open?: boolean;
	persistent?: boolean;
	size?: DialogSize;
	position?: DialogPosition;
	density?: 'dense' | 'compact' | 'default' | 'comfortable' | 'spacious';
	rounded?: RoundedType | 'full';
	classContent?: ClassValue;
	color?: ColorProps;
	elevation?: ElevationProps;
	space?: string;
}
