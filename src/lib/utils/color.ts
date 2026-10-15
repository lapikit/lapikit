import { DEV } from 'esm-env';

const paletteName = /^[a-zA-Z][\w-]*$/;
const unsafe = /[;{}]/;

function clean(color: string | null | undefined): string | undefined {
	const value = color?.trim();
	if (!value) return undefined;
	if (unsafe.test(value)) {
		if (DEV) console.warn(`[lapikit] color "${value}" is ignored: it cannot hold ; { or }`);
		return undefined;
	}
	return value;
}

export function resolveColor(color: string | null | undefined): string | undefined {
	const value = clean(color);
	if (!value) return undefined;
	return paletteName.test(value) ? `var(--kit-color-${value}, ${value})` : value;
}

export function contrastColor(value: string): string {
	const channel = 'clamp(0, (0.1791 - (0.2126 * r + 0.7152 * g + 0.0722 * b)) * 100000, 1)';
	return `color(from ${value} srgb-linear ${channel} ${channel} ${channel} / 1)`;
}

export function resolveOnColor(color: string | null | undefined): string | undefined {
	const value = clean(color);
	const resolved = resolveColor(value);
	if (!value || !resolved) return undefined;
	const auto = contrastColor(resolved);
	return paletteName.test(value) ? `var(--kit-color-on-${value}, ${auto})` : auto;
}

/**
 * colorStyle - The color variables of a component, for its style attribute.
 * The color mixin (styles/_mixins.scss) reads them: --{name}-color and --{name}-on-color.
 * @param name - The class of the component ('kit-sheet').
 * @param color - A palette name ('accent') or a CSS color ('#f00', 'oklch(...)').
 * @returns The declarations, '' when there is no color.
 */
export function colorStyle(name: string, color: string | null | undefined): string {
	const value = resolveColor(color);
	if (!name || !value) return '';
	return `--${name}-color: ${value}; --${name}-on-color: ${resolveOnColor(color)}`;
}
