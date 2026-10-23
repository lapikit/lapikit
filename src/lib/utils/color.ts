import { DEV } from 'esm-env';
import type { ColorProps } from '$lib/@types';

const paletteName = /^[a-zA-Z][\w-]*$/;
const unsafe = /[;{}]/;

function clean(color: unknown): string | undefined {
	// color={isActive && 'accent'} gives false: only a string is a color
	const value = typeof color === 'string' ? color.trim() : undefined;
	if (!value) return undefined;
	if (unsafe.test(value)) {
		if (DEV) console.warn(`[lapikit] color "${value}" is ignored: it cannot hold ; { or }`);
		return undefined;
	}
	return value;
}

export function resolveColor(color: string | false | null | undefined): string | undefined {
	const value = clean(color);
	if (!value) return undefined;
	return paletteName.test(value) ? `var(--kit-color-${value}, ${value})` : value;
}

export function resolveOnColor(color: string | false | null | undefined): string | undefined {
	const value = clean(color);
	if (!value || !paletteName.test(value)) return undefined;
	return `var(--kit-color-on-${value})`;
}

export function colorStyle(
	name: string,
	color: ColorProps | null | undefined,
	active = false
): string {
	const exact = active && typeof color === 'object' && !!clean(color?.active);
	const current = typeof color === 'object' ? (exact ? color?.active : color?.base) : color;

	const value = resolveColor(current);
	if (!name || !value) return '';

	const styles = [`--${name}-color: ${value}`];
	const onColor = resolveOnColor(current);
	if (onColor) styles.push(`--${name}-on-color: ${onColor}`);
	if (exact) styles.push(`--${name}-active-shade: 0%`);
	return styles.join('; ');
}
