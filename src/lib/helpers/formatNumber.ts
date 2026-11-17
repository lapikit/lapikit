const formatter = new Intl.NumberFormat('en', {
	notation: 'compact',
	maximumFractionDigits: 1,
	signDisplay: 'negative'
});

export function formatNumber(value: number | null | undefined): string | undefined {
	if (value == null) return undefined;

	return formatter
		.formatToParts(value)
		.map(({ type, value: part }) => (type === 'compact' && part === 'K' ? 'k' : part))
		.join('');
}
