import { describe, expect, it } from 'vitest';
import { useComponentAttrs } from '../components';

// The class is left to Svelte (clsx): useComponentAttrs gives the values in their order
describe('useComponentAttrs class', () => {
	it('should give the base class first', () => {
		expect(useComponentAttrs('kit-btn', {}, {}).class).toEqual([
			'kit-btn',
			undefined,
			[],
			undefined
		]);
	});

	it('should put s-class, the directives and class in this order', () => {
		const { class: classes } = useComponentAttrs(
			'kit-btn',
			{ sClass: 'primary', className: 'custom' },
			{ 's-class_active': true }
		);
		expect(classes).toEqual(['kit-btn', 'primary', ['active'], 'custom']);
	});

	it('should keep the arrays and the objects of s-class and class for Svelte', () => {
		const sClass = ['primary', { large: true, disabled: false }];
		const className = { custom: true };
		const { class: classes } = useComponentAttrs('kit-btn', { sClass, className }, {});
		expect(classes).toEqual(['kit-btn', sClass, [], className]);
	});

	it('should resolve the s-class_xxx directives', () => {
		const { class: classes } = useComponentAttrs(
			'kit-btn',
			{},
			{
				's-class_rounded': true,
				's-class_shadow': '-md',
				's-class_gap': 4,
				's-class_disabled': false
			}
		);
		expect(classes).toEqual(['kit-btn', undefined, ['rounded', 'shadow-md', 'gap-4'], undefined]);
	});

	it('should accept an empty base class', () => {
		expect(useComponentAttrs('', { className: 'custom' }, {}).class).toEqual([
			'',
			undefined,
			[],
			'custom'
		]);
	});

	it('should take the directives out of the rest of the props', () => {
		const { rest } = useComponentAttrs(
			'kit-btn',
			{},
			{ 's-class_active': true, 's-style_color': 'red', 'aria-label': 'Save', onclick: undefined }
		);
		expect(rest).toEqual({ 'aria-label': 'Save', onclick: undefined });
	});
});
