export function upperFirst(value: string | null | undefined): string | undefined {
	if (value == null) return undefined;
	if (!value) return value;

	const first = String.fromCodePoint(value.codePointAt(0)!);
	return first.toUpperCase() + value.slice(first.length);
}
