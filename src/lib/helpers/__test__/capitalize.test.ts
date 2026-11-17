import { describe, it, expect } from 'vitest';
import { capitalize } from '../capitalize';

describe('capitalize', () => {
	it.each([
		['', ''],
		['a', 'A'],
		['hello', 'Hello'],
		['Hello', 'Hello'],
		['hELLO', 'HELLO'],
		['éléphant', 'Éléphant'],
		['123abc', '123abc'],
		['🎉party', '🎉party'],
		['𐐨abc', '𐐀abc'], // char without BMP
		[' hello', ' hello'],
		[null, undefined],
		[undefined, undefined]
	])('capitalize(%j) → %j', (input, expected) => {
		expect(capitalize(input)).toBe(expected);
	});
});
