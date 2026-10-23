import { describe, it, expect } from 'vitest';
import type { PropValue, SStyleProp } from '$lib/@types';
import { useStyles } from '$lib/utils/components';

// s-style (object) and s-style_xxx (directives) of a component, as useComponentAttrs merges them
const styles = (sStyle: SStyleProp, styleProps: Record<string, PropValue>) =>
	useStyles({ sStyle, styleProps });

describe('s-style and s-style_xxx directives', () => {
	describe('sStyle as object', () => {
		it('should convert object to CSS style string', () => {
			const result = styles(
				{
					color: 'red',
					'font-size': '16px'
				},
				{}
			);
			expect(result).toBe('color: red; font-size: 16px');
		});

		it('should filter out falsy values', () => {
			const result = styles(
				{
					color: 'red',
					display: false,
					margin: ''
				},
				{}
			);
			expect(result).toBe('color: red');
		});

		it('should skip boolean true values (not a CSS value)', () => {
			const result = styles(
				{
					color: 'blue',
					visible: true
				},
				{}
			);
			expect(result).toBe('color: blue');
		});

		it('should return empty string for empty object', () => {
			const result = styles({}, {});
			expect(result).toBe('');
		});

		it('should handle undefined sStyle', () => {
			const result = styles(undefined, {});
			expect(result).toBe('');
		});

		it('should handle CSS properties with units', () => {
			const result = styles(
				{
					width: '100px',
					height: '50%',
					padding: '1rem'
				},
				{}
			);
			expect(result).toBe('width: 100px; height: 50%; padding: 1rem');
		});
	});

	describe('styleDirectiveProps (s-style_xxx)', () => {
		it('should add styles from directives', () => {
			const result = styles(
				{},
				{
					's-style_color': 'red',
					's-style_background': 'blue'
				}
			);
			expect(result).toBe('color: red; background: blue');
		});

		it('should filter out falsy directive values', () => {
			const result = styles(
				{},
				{
					's-style_color': 'red',
					's-style_display': false,
					's-style_margin': ''
				}
			);
			expect(result).toBe('color: red');
		});

		it('should handle boolean true values in directives', () => {
			const result = styles(
				{},
				{
					's-style_visible': true,
					's-style_color': 'green'
				}
			);
			// true is not a CSS value: skipped
			expect(result).toBe('color: green');
		});

		it('should handle hyphenated CSS properties', () => {
			const result = styles(
				{},
				{
					's-style_font-size': '14px',
					's-style_text-align': 'center'
				}
			);
			expect(result).toBe('font-size: 14px; text-align: center');
		});
	});

	describe('combined scenarios', () => {
		it('should combine sStyle object and styleDirectiveProps', () => {
			const result = styles(
				{
					color: 'red',
					'font-size': '16px'
				},
				{
					's-style_margin': '10px',
					's-style_padding': '5px'
				}
			);
			expect(result).toBe('color: red; font-size: 16px; margin: 10px; padding: 5px');
		});

		it('should filter falsy values from both sources', () => {
			const result = styles(
				{
					color: 'red',
					display: false
				},
				{
					's-style_margin': '10px',
					's-style_padding': ''
				}
			);
			expect(result).toBe('color: red; margin: 10px');
		});

		it('should return empty string when everything is empty', () => {
			const result = styles({}, {});
			expect(result).toBe('');
		});

		it('should handle mixed boolean and string values', () => {
			const result = styles(
				{
					color: 'blue',
					visible: true
				},
				{
					's-style_display': 'block',
					's-style_active': true
				}
			);
			// true is skipped: "visible: true" was invalid CSS
			expect(result).toBe('color: blue; display: block');
		});
	});

	describe('edge cases', () => {
		it('should preserve order of styles', () => {
			const result = styles(
				{
					'z-index': '999',
					'a-property': 'value'
				},
				{
					's-style_m-property': 'test'
				}
			);
			expect(result).toBe('z-index: 999; a-property: value; m-property: test');
		});

		it('should handle CSS custom properties (variables)', () => {
			const result = styles(
				{
					'--primary-color': '#ff0000',
					'--spacing': '1rem'
				},
				{}
			);
			expect(result).toBe('--primary-color: #ff0000; --spacing: 1rem');
		});

		it('should handle calc and other CSS functions', () => {
			const result = styles(
				{
					width: 'calc(100% - 20px)',
					transform: 'rotate(45deg)'
				},
				{}
			);
			expect(result).toBe('width: calc(100% - 20px); transform: rotate(45deg)');
		});

		it('should handle numeric values', () => {
			const result = styles(
				{
					opacity: '0.5',
					'z-index': '10'
				},
				{}
			);
			expect(result).toBe('opacity: 0.5; z-index: 10');
		});

		it('should handle color formats', () => {
			const result = styles(
				{
					color: 'rgb(255, 0, 0)',
					background: '#ff0000',
					border: 'rgba(0, 0, 0, 0.5)'
				},
				{}
			);
			expect(result).toBe('color: rgb(255, 0, 0); background: #ff0000; border: rgba(0, 0, 0, 0.5)');
		});
	});
});
