import type { Component, RoundedType } from '$lib/utils/types/index.ts';

export type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ModalPosition = 'top' | 'center' | 'bottom';
export type ModalDensity = 'compact' | 'comfortable' | 'default';

export interface ModalProps extends Component {
	ref?: HTMLDivElement | null;
	open?: boolean;
	contain?: boolean;
	size?: ModalSize;
	persistent?: boolean;
	position?: ModalPosition;
	rounded?: RoundedType;
	density?: ModalDensity;
	classContent?: string | string[] | undefined;
	color?: string;
	background?: string;
	closeWithEsc?: boolean;
}
