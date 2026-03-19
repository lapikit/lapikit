import type { Component } from '$lib/utils/types/index.ts';

export type AvatarSize = 'default' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarDensity = 'compact' | 'comfortable' | 'default';

export interface AvatarProps extends Component {
	ref?: HTMLElement | null;
	label?: string;
	size?: AvatarSize;
	density?: AvatarDensity;
}
