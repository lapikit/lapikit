const paletteName = /^[a-zA-Z][\w-]*$/;
const unsafe = /[;{}]/;

function clean(color: string | null | undefined): string | undefined {
	const value = color?.trim();
	if (!value) return undefined;
	if (unsafe.test(value)) {
		console.warn(`[lapikit] color "${value}" is ignored: it cannot hold ; { or }`);
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
