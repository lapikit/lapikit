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

export function resolveOnColor(color: string | null | undefined): string | undefined {
	const value = clean(color);
	if (!value || !paletteName.test(value)) return undefined;
	return `var(--kit-color-on-${value})`;
}

export function colorStyle(name: string, color: string | null | undefined): string {
	const value = resolveColor(color);
	if (!name || !value) return '';
	const onColor = resolveOnColor(color);
	return onColor
		? `--${name}-color: ${value}; --${name}-on-color: ${onColor}`
		: `--${name}-color: ${value}`;
}
