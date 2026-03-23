import type { Snippet } from 'svelte';
import type {
	ClassNameType,
	IdElementType,
	KitClassNameType,
	KitStylePropertiesType,
	PropValue,
	SClassProp,
	SStyleProp,
	StylePropertiesType
} from '$lib/@types';

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

export type KitComponentScan = {
	code: string;
	changed: boolean;
	importedComponents: Map<string, string>;
};

export type ComponentInfo = {
	name: string;
	ref: string;
};
