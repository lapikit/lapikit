export function capitalize(value: string, full: boolean): string {
	if (!value) return value;
	if (full) return value.toUpperCase();
	return value.charAt(0).toUpperCase() + value.slice(1);
}
