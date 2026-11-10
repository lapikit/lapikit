import type { PropValue } from '$lib/@types';

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
