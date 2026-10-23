import { describe, it, expect } from 'vitest';
import { directiveClasses } from '$lib/utils/components';

describe('directiveClasses (s-class_xxx)', () => {
	it('should return no class without directives', () => {
		expect(directiveClasses(undefined)).toEqual([]);
		expect(directiveClasses({})).toEqual([]);
	});

	it('should add the class name when the value is true', () => {
		expect(directiveClasses({ 's-class_btn': true, 's-class_primary': true })).toEqual([
			'btn',
			'primary'
		]);
	});

	it('should ignore false, null, undefined and empty strings', () => {
		expect(
			directiveClasses({
				's-class_btn': true,
				's-class_disabled': false,
				's-class_color': '',
				's-class_size': null,
				's-class_variant': undefined
			})
		).toEqual(['btn']);
	});

	it('should join the name and a text value with a dash', () => {
		expect(directiveClasses({ 's-class_theme': 'dark', 's-class_size': 'lg' })).toEqual([
			'theme-dark',
			'size-lg'
		]);
	});

	it('should join the name and a number value with a dash', () => {
		expect(directiveClasses({ 's-class_gap': 4, 's-class_p': 0 })).toEqual(['gap-4', 'p-0']);
	});

	it('should not add a dash when the value starts with a separator', () => {
		expect(
			directiveClasses({
				's-class_btn': '-primary',
				's-class_size': '-large',
				's-class_theme': '--dark',
				's-class_state': ':active'
			})
		).toEqual(['btn-primary', 'size-large', 'theme--dark', 'state:active']);
	});

	it('should not add a dash when the name ends with a separator', () => {
		expect(directiveClasses({ 's-class_gap-': 4, 's-class_icon_': 'sm' })).toEqual([
			'gap-4',
			'icon_sm'
		]);
	});

	it('should keep the order of the directives', () => {
		expect(
			directiveClasses({
				's-class_active': true,
				's-class_variant': '-primary',
				's-class_size': '-lg'
			})
		).toEqual(['active', 'variant-primary', 'size-lg']);
	});
});
