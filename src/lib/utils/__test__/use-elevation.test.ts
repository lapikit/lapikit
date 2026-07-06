import { describe, expect, it } from 'vitest';
import { useElevation } from '../components';

describe('useElevation', () => {
	describe('no value', () => {
		it('should return all undefined when elevation is undefined', () => {
			const result = useElevation(undefined);
			expect(result).toEqual({ base: undefined, hover: undefined, active: undefined });
		});

		it('should return all undefined when elevation is null', () => {
			const result = useElevation(null);
			expect(result).toEqual({ base: undefined, hover: undefined, active: undefined });
		});

		it('should return all undefined when called with no arguments', () => {
			const result = useElevation();
			expect(result).toEqual({ base: undefined, hover: undefined, active: undefined });
		});
	});

	describe('string value', () => {
		it('should apply the value to base and leave hover/active undefined', () => {
			const result = useElevation('3');
			expect(result).toEqual({ base: '3', hover: undefined, active: undefined });
		});

		it('should handle "0"', () => {
			const result = useElevation('0');
			expect(result).toEqual({ base: '0', hover: undefined, active: undefined });
		});
	});

	describe('object value', () => {
		it('should return each key when all are present', () => {
			const result = useElevation({ base: '1', hover: '2', active: '3' });
			expect(result).toEqual({ base: '1', hover: '2', active: '3' });
		});

		it('should return undefined for missing keys', () => {
			const result = useElevation({ base: '1' });
			expect(result).toEqual({ base: '1', hover: undefined, active: undefined });
		});

		it('should return undefined for every key on an empty object', () => {
			const result = useElevation({});
			expect(result).toEqual({ base: undefined, hover: undefined, active: undefined });
		});

		it('should handle only hover and active being present', () => {
			const result = useElevation({ hover: '4', active: '5' });
			expect(result).toEqual({ base: undefined, hover: '4', active: '5' });
		});
	});
});
