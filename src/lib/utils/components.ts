import { DEV } from 'esm-env';
import type {
	ColorProps,
	ComponentAttrs,
	ElevationProps,
	ElevationState,
	PropValue,
	SStyleProp,
	useStylesProps
} from '$lib/@types';
import type { ClassValue } from 'svelte/elements';
import { makeComponentProps } from '$lib/html-mapped';
import { colorStyle } from './color.js';

const endsWithSeparator = /[^a-zA-Z0-9]$/;
const startsWithSeparator = /^[^a-zA-Z0-9]/;
const propertyCache = new Map<string, string>();

function hasKeys(value: unknown): boolean {
	if (!value || typeof value !== 'object') return false;
	for (const key in value) {
		if (Object.hasOwn(value, key)) return true;
	}
	return false;
}

/**
 * The classes of the s-class_xxx directives (class:xxx on a kit tag):
 * - true gives the name (class:active -> active);
 * - a number or a text gives the name and the value, joined by a dash (class:gap={4} -> gap-4),
 *   without a dash when the name ends or the value starts with a separator (- _ : / .):
 *   s-class_gap-={4}, s-class_variant="-primary" and s-class_state=":active" keep working;
 * - false, null, undefined and '' give nothing.
 */
export function directiveClasses(classProps: Record<string, PropValue> | undefined): string[] {
	const classes: string[] = [];
	if (!classProps) return classes;

	for (const key in classProps) {
		const value = classProps[key];
		// 8 = 's-class_'.length
		const base = key.slice(8);

		if (value === true) classes.push(base);
		else if ((typeof value === 'string' && value) || typeof value === 'number') {
			const text = String(value);
			const dash = endsWithSeparator.test(base) || startsWithSeparator.test(text) ? '' : '-';
			classes.push(`${base}${dash}${text}`);
		}
	}
	return classes;
}

/**
 * useIsInteractive - Utility to determine whether a component should behave as interactive:
 * either explicitly flagged, rendered as an interactive tag (e.g. 'a', 'button'), or given
 * one of the standard interactive event handlers (onclick, onpointerdown, onkeydown).
 * @param props - The rest/spread props object of a component.
 * @param tag - The resolved element tag the component renders as.
 * @param interactiveTags - The tags considered interactive for this component (e.g. ['a', 'button']).
 * @param interactive - Explicit interactive flag passed to the component.
 * @returns True if the component should behave as interactive.
 */
const interactiveEventKeys = ['onclick', 'onpointerdown', 'onkeydown'] as const;

export function useIsInteractive(
	props: Record<string, unknown>,
	tag: string,
	interactiveTags: readonly string[],
	interactive = false
): boolean {
	return (
		interactive ||
		interactiveTags.includes(tag) ||
		interactiveEventKeys.some((key) => typeof props[key] === 'function')
	);
}

/**
 * The CSS name of a property: backgroundColor gives background-color.
 * A custom property (--x) or a name already in kebab-case is kept as it is.
 */
function toCssProperty(name: string): string {
	if (name.startsWith('--') || !/[A-Z]/.test(name)) return name;

	let property = propertyCache.get(name);
	if (property === undefined) {
		property = name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
		// Vendor prefixes: WebkitMask gives -webkit-mask
		if (/^(webkit|moz|ms)-/.test(property)) property = `-${property}`;
		propertyCache.set(name, property);
	}
	return property;
}

/**
 * The declaration of a style value, or undefined to skip it:
 * - a number (0 included) or a non empty string is kept;
 * - null, undefined, false, true and '' are skipped (true is not a CSS value);
 * - a value holding ; { or } is refused: it could add other declarations (CSS injection).
 */
function toDeclaration(name: string, value: unknown): string | undefined {
	if (typeof value === 'number') {
		return Number.isFinite(value) ? `${toCssProperty(name)}: ${value}` : undefined;
	}
	if (typeof value !== 'string' || !value) return undefined;

	if (/[;{}]/.test(value)) {
		if (DEV) {
			console.warn(
				`[lapikit] the style value of "${name}" is ignored: it contains ; { or } ("${value}")`
			);
		}
		return undefined;
	}
	return `${toCssProperty(name)}: ${value}`;
}

/**
 * useStyles - Utility to compute style declarations for a component (pure function).
 * @param styleAttr - Inline style attribute as a string (raw CSS, kept as it is).
 * @param sStyle - The s-style property: an object of property / value pairs (camelCase or kebab-case).
 * @param styleProps - An object containing s-style_xxx directives.
 * @returns A computed style string; the style attribute comes last, so it wins.
 */
export function useStyles({ styleAttr, sStyle, styleProps }: useStylesProps = {}): string {
	// Fast path, the most common case: nothing to merge
	if (!hasKeys(sStyle) && !hasKeys(styleProps)) return styleAttr ?? '';

	const styles: string[] = [];

	if (sStyle && typeof sStyle === 'object') {
		for (const key in sStyle) {
			const declaration = toDeclaration(key, sStyle[key]);
			if (declaration) styles.push(declaration);
		}
	}

	if (styleProps) {
		for (const key in styleProps) {
			// 8 = 's-style_'.length
			const declaration = toDeclaration(key.slice(8), styleProps[key]);
			if (declaration) styles.push(declaration);
		}
	}

	if (styleAttr) styles.push(styleAttr);

	return styles.join('; ');
}

/**
 * useElevation - Utility to resolve the `elevation` prop into its base/hover/active states.
 * @param elevation - Either a single elevation value applied as `base`, or an object with
 * independent `base`, `hover` and `active` values (each key is optional).
 * @returns An object with `base`, `hover` and `active` keys, `undefined` when not provided.
 */
export function useElevation(elevation?: ElevationProps | null): ElevationState {
	if (elevation === undefined || elevation === null) {
		return { base: undefined, hover: undefined, active: undefined };
	}

	if (typeof elevation === 'string') {
		return { base: elevation, hover: undefined, active: undefined };
	}

	return {
		base: elevation.base,
		hover: elevation.hover,
		active: elevation.active
	};
}

/**
 * useComponentAttrs - The class, style and other attributes of a labs component, in one call.
 *
 * The class is left to Svelte (clsx): class and s-class follow the same rules as class on an element,
 * a string, an array, or an object whose keys are added when their value is truthy
 * ({ active: isActive } -> active). The s-class_xxx directives (class:xxx on a kit tag) keep their
 * rule: class:gap={4} -> gap-4.
 *
 * @param baseClass - The class of the component ('kit-btn'), '' for none.
 * The color prop gives the --{baseClass}-color / --{baseClass}-on-color variables, read by the
 * color mixin; they come before the style, so the style attribute still wins.
 * With { base, active }, active picks the color of the active state.
 *
 * @param props - The class, s-class, style, s-style, color and active props of the component.
 * @param rest - The rest of the props: the s-class_xxx / s-style_xxx directives are taken out of it.
 */
export function useComponentAttrs(
	baseClass: string,
	{
		className,
		sClass,
		styleAttr,
		sStyle,
		color,
		active
	}: {
		className?: ClassValue;
		sClass?: ClassValue;
		styleAttr?: string;
		sStyle?: SStyleProp;
		color?: ColorProps | null;
		active?: boolean;
	},
	rest: Record<string, unknown>
): ComponentAttrs {
	const { classProps, styleProps, restProps } = makeComponentProps(rest);

	return {
		class: [baseClass, sClass, directiveClasses(classProps), className],
		style: [colorStyle(baseClass, color, active), useStyles({ styleAttr, sStyle, styleProps })]
			.filter(Boolean)
			.join('; '),
		rest: restProps
	};
}

/**
 * splitAriaAttrs - Separates the aria-* attributes from the other attributes, for a component whose
 * role is on another element than its content (dialog, modal).
 * @param rest - The rest of the props of the component.
 */
export function splitAriaAttrs(rest: Record<string, unknown>) {
	const aria: Record<string, unknown> = {};
	const others: Record<string, unknown> = {};

	for (const key in rest) {
		if (key.startsWith('aria-')) aria[key] = rest[key];
		else others[key] = rest[key];
	}
	return { aria, others };
}
