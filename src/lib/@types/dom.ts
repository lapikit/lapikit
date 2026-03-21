// ref DOM Element (id, class, style ...)
export type IdElementType = string | undefined;
export type ClassNameType = string | string[] | undefined;
export type StylePropertiesType = string | undefined;
export type KitClassNameType = string | string[] | undefined;
export type KitStylePropertiesType = Record<string, boolean | string> | undefined;

export type SClassProp = string | string[] | Record<string, boolean | string> | undefined;
export type SStyleProp = Record<string, boolean | string> | undefined;
