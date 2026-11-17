import { describe, it, expect } from 'vitest';
import { formatNumber } from '../formatNumber';

describe('formatNumber', () => {
	describe('numbers below 1000', () => {
		it.each([
			[0, '0'],
			[1, '1'],
			[9, '9'],
			[54, '54'],
			[99, '99'],
			[100, '100'],
			[999, '999']
		])('formatNumber(%j) → %j', (input, expected) => {
			expect(formatNumber(input)).toBe(expected);
		});
	});

	describe('thousands (k)', () => {
		it.each([
			[1000, '1k'],
			[1001, '1k'],
			[1500, '1.5k'],
			[10000, '10k'],
			[10500, '10.5k'],
			[23000, '23k'],
			[23456, '23.5k'],
			[100000, '100k'],
			[149000, '149k']
		])('formatNumber(%j) → %j', (input, expected) => {
			expect(formatNumber(input)).toBe(expected);
		});

		it('uses a lowercase k', () => {
			expect(formatNumber(1000)).not.toContain('K');
		});
	});

	describe('millions, billions, trillions (M, B, T)', () => {
		it.each([
			[1_000_000, '1M'],
			[1_234_567, '1.2M'],
			[1_500_000, '1.5M'],
			[1_000_000_000, '1B'],
			[2_500_000_000, '2.5B'],
			[1_000_000_000_000, '1T'],
			[1_500_000_000_000, '1.5T']
		])('formatNumber(%j) → %j', (input, expected) => {
			expect(formatNumber(input)).toBe(expected);
		});

		it('stays in T above one trillion', () => {
			expect(formatNumber(1e15)).toBe('1000T');
		});
	});

	describe('rounding', () => {
		it.each([
			[1049, '1k'], // rounds down
			[1050, '1.1k'], // rounds up from .5
			[1099, '1.1k'],
			[149_999, '150k'],
			[12.34, '12.3'],
			[999.94, '999.9']
		])('formatNumber(%j) → %j', (input, expected) => {
			expect(formatNumber(input)).toBe(expected);
		});

		it('drops trailing zeros', () => {
			expect(formatNumber(1000)).toBe('1k');
			expect(formatNumber(1_000_000)).toBe('1M');
		});
	});

	describe('unit change when rounding', () => {
		it.each([
			[999.95, '1k'],
			[9999, '10k'],
			[99_999, '100k'],
			[999_999, '1M'],
			[999_999_999, '1B']
		])('formatNumber(%j) → %j (never 1000k)', (input, expected) => {
			expect(formatNumber(input)).toBe(expected);
		});
	});

	describe('negative numbers', () => {
		it.each([
			[-1, '-1'],
			[-999, '-999'],
			[-1000, '-1k'],
			[-23_456, '-23.5k'],
			[-1_500_000, '-1.5M']
		])('formatNumber(%j) → %j', (input, expected) => {
			expect(formatNumber(input)).toBe(expected);
		});

		it('never shows -0', () => {
			expect(formatNumber(-0)).toBe('0');
			expect(formatNumber(-0.04)).toBe('0');
		});
	});

	describe('decimals', () => {
		it.each([
			[0.1, '0.1'],
			[0.15, '0.2'],
			[0.04, '0'],
			[999.5, '999.5']
		])('formatNumber(%j) → %j', (input, expected) => {
			expect(formatNumber(input)).toBe(expected);
		});
	});

	describe('special values', () => {
		it.each([
			[NaN, 'NaN'],
			[Infinity, '∞'],
			[-Infinity, '-∞']
		])('formatNumber(%j) → %j', (input, expected) => {
			expect(formatNumber(input)).toBe(expected);
		});
	});

	describe('nullish values', () => {
		it.each([
			[null, undefined],
			[undefined, undefined]
		])('formatNumber(%j) → %j', (input, expected) => {
			expect(formatNumber(input)).toBe(expected);
		});
	});
});
