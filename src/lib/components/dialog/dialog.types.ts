import type { Component, DensityType, ElevationProps, RoundedType } from '$lib/@types';

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
	density?: DensityType;
	rounded?: RoundedType;
	classContent?: string | string[] | undefined;
	color?: string;
	background?: string;
	elevation?: ElevationProps;
	space?: string;
}
