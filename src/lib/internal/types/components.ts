import type { Snippet } from 'svelte';

type IdElementType = string | undefined;
type ClassNameType = string | string[] | undefined;
type KitClassNameType = string | string[] | undefined;
type KitStylePropertiesType = Record<string, boolean | string> | undefined;
type StylePropertiesType = string | undefined;
export type SizeType = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export interface Base {
	id?: IdElementType;
	class?: ClassNameType;
	style?: StylePropertiesType;
	's-class'?: KitClassNameType;
	's-style'?: KitStylePropertiesType;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
}

export interface Component extends Base {
	children?: Snippet;
}
