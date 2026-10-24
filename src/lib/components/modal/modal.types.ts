import type { ClassValue } from 'svelte/elements';
import type { ColorProps, Component, ElevationProps, RoundedType } from '$lib/@types';

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
	ref?: HTMLDialogElement | null;
	open?: boolean;
	contain?: boolean;
	size?: ModalSize;
	persistent?: boolean;
	position?: ModalPosition;
	rounded?: RoundedType | 'full';
	density?: 'dense' | 'compact' | 'default' | 'comfortable' | 'spacious';
	classContent?: ClassValue;
	color?: ColorProps;
	closeWithEsc?: boolean;
	space?: string;
	elevation?: ElevationProps;
}
