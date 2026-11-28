export type CompactNumberOptions = {
	locale?: string | string[];
	maximumFractionDigits?: number;
};

const formatters = new Map<string, { format: Intl.NumberFormat; lowercaseK: boolean }>();

function getFormatter(locale: string | string[], maximumFractionDigits: number) {
	const key = `${[locale].flat().join(',')}|${maximumFractionDigits}`;
	let formatter = formatters.get(key);

	if (!formatter) {
		const format = new Intl.NumberFormat(locale, {
			notation: 'compact',
			maximumFractionDigits,
			signDisplay: 'negative'
		});
		formatter = { format, lowercaseK: format.resolvedOptions().locale.startsWith('en') };
		formatters.set(key, formatter);
	}

	return formatter;
}

export function compactNumber(
	value: number | null | undefined,
	{ locale = 'en', maximumFractionDigits = 1 }: CompactNumberOptions = {}
): string | undefined {
	if (value == null) return undefined;

	const { format, lowercaseK } = getFormatter(locale, maximumFractionDigits);
	if (!lowercaseK) return format.format(value);

	return format
		.formatToParts(value)
		.map(({ type, value: part }) => (type === 'compact' && part === 'K' ? 'k' : part))
		.join('');
}
