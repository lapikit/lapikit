import { describe, expect, it } from 'vitest';
import { colorStyle, resolveColor, resolveOnColor } from '../color';
import { useComponentAttrs } from '../components';

describe('resolveColor', () => {
	it('should return undefined when there is no color', () => {
		expect(resolveColor(undefined)).toBeUndefined();
		expect(resolveColor(null)).toBeUndefined();
		expect(resolveColor('')).toBeUndefined();
		expect(resolveColor('   ')).toBeUndefined();
	});

	it('should give the palette variable for a name, with the name as fallback', () => {
		expect(resolveColor('accent')).toBe('var(--kit-color-accent, accent)');
		expect(resolveColor('surface-1')).toBe('var(--kit-color-surface-1, surface-1)');
		expect(resolveColor('red')).toBe('var(--kit-color-red, red)');
	});

	it('should keep a CSS color as it is', () => {
		expect(resolveColor('#ff0000')).toBe('#ff0000');
		expect(resolveColor('oklch(70% 0.1 200)')).toBe('oklch(70% 0.1 200)');
		expect(resolveColor('var(--my-color)')).toBe('var(--my-color)');
	});

	it('should trim the value', () => {
		expect(resolveColor('  accent  ')).toBe('var(--kit-color-accent, accent)');
	});

	it('should refuse a value holding ; { or } (CSS injection)', () => {
		expect(resolveColor('red; display: none')).toBeUndefined();
		expect(resolveColor('red}')).toBeUndefined();
		expect(resolveColor('{red')).toBeUndefined();
	});
});

describe('resolveOnColor', () => {
	it('should return undefined when there is no color', () => {
		expect(resolveOnColor(undefined)).toBeUndefined();
		expect(resolveOnColor('')).toBeUndefined();
		expect(resolveOnColor('red;')).toBeUndefined();
	});

	it('should give the on- palette variable, without fallback (the mixin computes the contrast)', () => {
		expect(resolveOnColor('accent')).toBe('var(--kit-color-on-accent)');
		expect(resolveOnColor('red')).toBe('var(--kit-color-on-red)');
	});

	it('should return undefined for a CSS color (the mixin computes the contrast)', () => {
		expect(resolveOnColor('#ff0000')).toBeUndefined();
		expect(resolveOnColor('oklch(70% 0.1 200)')).toBeUndefined();
	});
});

describe('colorStyle', () => {
	it('should return an empty string when there is no color', () => {
		expect(colorStyle('kit-sheet', undefined)).toBe('');
		expect(colorStyle('kit-sheet', '')).toBe('');
		expect(colorStyle('kit-sheet', 'red;')).toBe('');
		expect(colorStyle('kit-sheet', false)).toBe('');
		expect(colorStyle('kit-sheet', 0 as never)).toBe('');
		expect(colorStyle('kit-sheet', { base: false }, true)).toBe('');
	});

	it('should return an empty string when there is no name', () => {
		expect(colorStyle('', 'accent')).toBe('');
	});

	it('should give the color and on-color variables for a palette name', () => {
		expect(colorStyle('kit-sheet', 'accent')).toBe(
			'--kit-sheet-color: var(--kit-color-accent, accent); --kit-sheet-on-color: var(--kit-color-on-accent)'
		);
	});

	it('should give only the color variable for a CSS color', () => {
		expect(colorStyle('kit-sheet', '#ff0000')).toBe('--kit-sheet-color: #ff0000');
	});
});

describe('colorStyle with { base, active }', () => {
	it('should be the same as a string for { base }', () => {
		expect(colorStyle('kit-sheet', { base: 'accent' })).toBe(colorStyle('kit-sheet', 'accent'));
		expect(colorStyle('kit-sheet', { base: 'accent' }, true)).toBe(
			colorStyle('kit-sheet', 'accent', true)
		);
	});

	it('should ignore the active color while the component is not active', () => {
		expect(colorStyle('kit-sheet', { active: 'warning' })).toBe('');
		expect(colorStyle('kit-sheet', { base: 'info', active: 'warning' })).toBe(
			colorStyle('kit-sheet', 'info')
		);
	});

	it('should give the active color as it is while the component is active', () => {
		expect(colorStyle('kit-sheet', { active: 'warning' }, true)).toBe(
			'--kit-sheet-color: var(--kit-color-warning, warning); --kit-sheet-on-color: var(--kit-color-on-warning); --kit-sheet-active-shade: 0%'
		);
		expect(colorStyle('kit-sheet', { base: 'info', active: '#ff8800' }, true)).toBe(
			'--kit-sheet-color: #ff8800; --kit-sheet-active-shade: 0%'
		);
	});

	it('should keep the stronger shade of a string color while active', () => {
		expect(colorStyle('kit-sheet', 'accent', true)).toBe(colorStyle('kit-sheet', 'accent'));
	});

	it('should fall back to base when the active color is refused', () => {
		expect(colorStyle('kit-sheet', { base: 'info', active: 'red;' }, true)).toBe(
			colorStyle('kit-sheet', 'info')
		);
		expect(colorStyle('kit-sheet', { base: 'info', active: '  ' }, true)).toBe(
			colorStyle('kit-sheet', 'info')
		);
	});

	it('should return an empty string for an empty object', () => {
		expect(colorStyle('kit-sheet', {}, true)).toBe('');
	});
});

describe('useComponentAttrs color', () => {
	it('should pick the active color with the active prop', () => {
		expect(
			useComponentAttrs('kit-sheet', { color: { active: 'warning' }, active: true }, {}).style
		).toBe(colorStyle('kit-sheet', { active: 'warning' }, true));
		expect(useComponentAttrs('kit-sheet', { color: { active: 'warning' } }, {}).style).toBe('');
	});

	it('should keep the style as it is when there is no color', () => {
		expect(useComponentAttrs('kit-sheet', { styleAttr: 'margin: 0' }, {}).style).toBe('margin: 0');
		expect(useComponentAttrs('kit-sheet', {}, {}).style).toBe('');
	});

	it('should add the color variables', () => {
		expect(useComponentAttrs('kit-sheet', { color: 'accent' }, {}).style).toBe(
			colorStyle('kit-sheet', 'accent')
		);
	});

	it('should put the style after the color variables, so the style wins', () => {
		const { style } = useComponentAttrs(
			'kit-sheet',
			{ color: 'accent', styleAttr: '--kit-sheet-color: red' },
			{}
		);
		expect(style).toBe(`${colorStyle('kit-sheet', 'accent')}; --kit-sheet-color: red`);
	});
});
