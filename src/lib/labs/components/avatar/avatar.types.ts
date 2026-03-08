import type { Component } from '$lib/labs/utils/types/index.js';

export type AvatarSize = 'default' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarDensity = 'compact' | 'comfortable' | 'default';

export interface AvatarProps extends Component {
	ref?: HTMLElement | null;
	label?: string;
	src?: string;
	alt?: string;
	icon?: string;
	size?: AvatarSize;
	density?: AvatarDensity;
}
