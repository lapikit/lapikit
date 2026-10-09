import type { PropValue } from '$lib/@types';

const endsWithSeparator = /[^a-zA-Z0-9]$/;
const startsWithSeparator = /^[^a-zA-Z0-9]/;
const whitespace = /\s/;
const whitespaces = /\s+/;

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
 * Adds the classes of a value (one or several, separated by spaces) to the set.
 * The set keeps the first position of each class and drops the duplicates.
 */
export function addClasses(classes: Set<string>, value: string) {
	// Most values are a single class: no split (the costly part)
	if (!whitespace.test(value)) {
		if (value) classes.add(value);
		return;
	}
	for (const name of value.split(whitespaces)) {
		if (name) classes.add(name);
	}
}

/**
 * Adds a class value with the rules of clsx (class on an element): a string, an array (nested too),
 * or an object whose keys are added when their value is truthy. Joining an array would give "a,b"
 */
export function addClassValue(classes: Set<string>, value: unknown) {
	if (typeof value === 'string') addClasses(classes, value);
	else if (Array.isArray(value)) {
		for (const item of value) addClassValue(classes, item);
	} else if (value && typeof value === 'object') {
		for (const key in value) {
			if ((value as Record<string, unknown>)[key]) addClasses(classes, key);
		}
	}
}
