import type { PropValue, SClassProp, SStyleProp } from '$lib/@types';
import { useClassName, useStyles } from '$lib/utils/components.js';

/**
 * Computes a string of class names based on the provided sClass and classDirectiveProps.
 * @param sClass - The s-class property which can be a string, array, or object.
 * @param classDirectiveProps - An object containing s-class_xxx directives.
 * @returns A string of class names.
 */
export function computeSClasses(
	sClass: SClassProp,
	classDirectiveProps: Record<string, unknown>
): string {
	return useClassName({ sClass, classProps: classDirectiveProps as Record<string, PropValue> });
}

/**
 * Computes a string of style declarations based on the provided sStyle and styleDirectiveProps.
 * @param sStyle - The s-style property which is an object of style key-value pairs.
 * @param styleDirectiveProps - An object containing s-style_xxx directives.
 * @returns A string of style declarations.
 */
export function computeSStyles(
	sStyle: SStyleProp,
	styleDirectiveProps: Record<string, unknown>
): string {
	return useStyles({ sStyle, styleProps: styleDirectiveProps as Record<string, PropValue> });
}

/**
 * Makes component props by separating s-class and s-style directives from other props.
 * Optimized to use a single pass instead of three separate iterations.
 * @param props The original props object containing all props.
 * @returns An object containing separated classProps, styleProps, and restProps.
 */
export function makeComponentProps(props: Record<string, unknown>): {
	classProps: Record<string, PropValue>;
	styleProps: Record<string, PropValue>;
	restProps: Record<string, unknown>;
} {
	const classProps: Record<string, PropValue> = {};
	const styleProps: Record<string, PropValue> = {};
	const restProps: Record<string, unknown> = {};

	for (const [key, value] of Object.entries(props)) {
		if (key.startsWith('s-class_')) {
			classProps[key] = value as PropValue;
		} else if (key.startsWith('s-style_')) {
			styleProps[key] = value as PropValue;
		} else if (key !== 's-class' && key !== 's-style') {
			// Only the exact s-class / s-style are left out: a prop like s-classic is kept
			restProps[key] = value;
		}
	}

	return { classProps, styleProps, restProps };
}
