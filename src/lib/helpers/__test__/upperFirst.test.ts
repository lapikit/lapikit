import { describe, it, expect } from 'vitest';
import { upperFirst } from '../upperFirst';

describe('upperFirst', () => {
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
	])('upperFirst(%j) → %j', (input, expected) => {
		expect(upperFirst(input)).toBe(expected);
	});
});
