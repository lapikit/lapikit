import type MagicString from 'magic-string';
import type {
	ClassNameType,
	KitClassNameType,
	KitStylePropertiesType,
	PropValue,
	SStyleProp,
	StylePropertiesType
} from '$lib/@types';
import type {
	ClassValue,
	HTMLAnchorAttributes,
	HTMLAttributes,
	HTMLButtonAttributes,
	HTMLDialogAttributes,
	HTMLInputAttributes
} from 'svelte/elements';

export interface useStylesProps {
	styleAttr?: string;
	sStyle?: SStyleProp;
	styleProps?: Record<string, PropValue>;
}

export interface KitBaseProps {
	class?: ClassNameType;
	style?: StylePropertiesType;
	's-class'?: KitClassNameType;
	's-style'?: KitStylePropertiesType;
	[key: `s-class_${string}`]: PropValue;
	[key: `s-style_${string}`]: PropValue;
}

type ElementAttributes<Attributes> = Omit<Attributes, keyof HTMLAttributes<HTMLElement>>;

export type AnchorAttributes = ElementAttributes<HTMLAnchorAttributes>;
export type ButtonAttributes = ElementAttributes<HTMLButtonAttributes>;
export type InputAttributes = ElementAttributes<HTMLInputAttributes>;
export type DialogAttributes = ElementAttributes<HTMLDialogAttributes>;

export type KitProps<Own, Extra = unknown> = Own &
	KitBaseProps &
	Omit<HTMLAttributes<HTMLElement> & Extra, keyof Own | keyof KitBaseProps>;

export type KitComponentScan = {
	code: string;
	changed: boolean;
	magic: MagicString;
	importedComponents: Map<string, string>;
};

export type ComponentInfo = {
	name: string;
	ref: string;
	// true when `ref` points to the component file itself (default import)
	direct?: boolean;
};

export interface ComponentAttrs {
	/** For the class attribute of the element: Svelte applies clsx (strings, arrays, objects) */
	class: ClassValue;
	style: string;
	rest: Record<string, unknown>;
}
