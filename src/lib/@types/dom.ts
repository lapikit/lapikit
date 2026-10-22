import type { ClassValue } from 'svelte/elements';

// ref DOM Element (id, class, style ...)
export type IdElementType = string | undefined;
export type ClassNameType = ClassValue | undefined;
export type StylePropertiesType = string | undefined;
export type KitClassNameType = ClassValue | undefined;
export type KitStylePropertiesType = Record<string, boolean | string> | undefined;

export type SClassProp = ClassValue | Record<string, boolean | string> | undefined;
export type SStyleProp = Record<string, boolean | string> | undefined;
