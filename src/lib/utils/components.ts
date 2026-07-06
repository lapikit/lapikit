import type {
	ElevationProps,
	ElevationState,
	useClassNameProps,
	useStylesProps
} from '$lib/@types';

/**
 * useClassName - Utility to compute class names for a component.
 * @param baseClass - The base class name for the component.
 * @param className - Additional class names as a string.
 * @param sClass - The s-class property which can be a string, array, or object.
 * @param classProps - An object containing s-class_xxx directives.
 * @returns A computed class string.
 */
export function useClassName({
	baseClass = '',
	className,
	sClass,
	classProps
}: useClassNameProps = {}): string {
	const classes: string[] = [];

	if (baseClass) {
		classes.push(baseClass);
	}

	if (typeof sClass === 'string' && sClass) {
		classes.push(sClass);
	}

	if (Array.isArray(sClass)) {
		for (const value of sClass) {
			if (typeof value === 'string' && value) {
				classes.push(value);
			}
		}
	}

	if (sClass && typeof sClass === 'object' && !Array.isArray(sClass)) {
		const entries = Object.entries(sClass);
		if (entries.length > 0) {
			for (const [key, value] of entries) {
				if (value === true) {
					classes.push(key);
				} else if (typeof value === 'string' && value) {
					classes.push(value);
				}
			}
		}
	}

	if (classProps) {
		const entries = Object.entries(classProps);
		if (entries.length > 0) {
			for (const [key, value] of entries) {
				// Use slice instead of replace for better performance (8 = 's-class_'.length)
				const base = key.slice(8);

				if (value === true) {
					classes.push(base);
				} else if (typeof value === 'string' && value) {
					classes.push(`${base}${value}`);
				}
			}
		}
	}

	if (className) {
		classes.push(className);
	}

	return classes.filter(Boolean).join(' ');
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
 * useStyles - Utility to compute style declarations for a component (optimized pure function).
 * @param styleAttr - Inline style attribute as a string.
 * @param sStyle - The s-style property which is an object of style key-value pairs.
 * @param styleProps - An object containing s-style_xxx directives.
 * @returns A computed style string.
 */
export function useStyles({ styleAttr, sStyle, styleProps }: useStylesProps = {}): string {
	const styles: string[] = [];

	if (sStyle && typeof sStyle === 'object') {
		const entries = Object.entries(sStyle);
		if (entries.length > 0) {
			for (const [key, value] of entries) {
				if (value) {
					styles.push(`${key}: ${value}`);
				}
			}
		}
	}

	if (styleProps) {
		const entries = Object.entries(styleProps);
		if (entries.length > 0) {
			for (const [key, value] of entries) {
				// Use slice instead of replace for better performance (8 = 's-style_'.length)
				const base = key.slice(8);
				if (value) {
					styles.push(`${base}: ${value}`);
				}
			}
		}
	}

	if (styleAttr) {
		styles.push(styleAttr);
	}

	return styles.filter(Boolean).join('; ');
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
