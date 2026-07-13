import type { Component, DensityType, ElevationProps, RoundedType } from '$lib/@types';

type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
type ModalPosition =
	| 'top'
	| 'center'
	| 'bottom'
	| 'top-left'
	| 'top-right'
	| 'center-left'
	| 'center-right'
	| 'bottom-left'
	| 'bottom-right';

export interface ModalProps extends Component {
	ref?: HTMLDivElement | null;
	open?: boolean;
	contain?: boolean;
	size?: ModalSize;
	persistent?: boolean;
	position?: ModalPosition;
	rounded?: RoundedType;
	density?: DensityType;
	classContent?: string | string[] | undefined;
	color?: string;
	background?: string;
	closeWithEsc?: boolean;
	space?: string;
	elevation?: ElevationProps;
}
