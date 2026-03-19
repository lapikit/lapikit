import type { Snippet } from 'svelte';
import type { SClassProp, SStyleProp } from '$lib/compiler/types/index.ts';

type IdElementType = string | undefined;
type ClassNameType = string | string[] | undefined;
type KitClassNameType = string | string[] | undefined;
type KitStylePropertiesType = Record<string, boolean | string> | undefined;
type StylePropertiesType = string | undefined;
export type PropValue = string | boolean | number | null | undefined;
export type SizeType = 'default' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type RoundedType = 0 | '0' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export interface useClassNameProps {
	baseClass?: string;
	className?: string;
	sClass?: SClassProp;
	classProps?: Record<string, PropValue>;
}

export interface useStylesProps {
	styleAttr?: string;
	sStyle?: SStyleProp;
	styleProps?: Record<string, PropValue>;
}

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

export interface RippleProps {
	component?: string; // The component name to use for the ripple shape
	center?: boolean;
	color?: string; // CSS color
	duration?: number; // In ms
	disabled?: boolean; // Should the ripple be disabled
}

export type ClickOutsideOptions = {
	exclude?: (HTMLElement | PointerEvent | null)[];
	onClose: () => void;
};
