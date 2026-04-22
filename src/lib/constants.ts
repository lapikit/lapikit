export const lapikitImportsRef = 'lapikit/labs/components';
export const lapikitImportsLabsRef = 'lapikit/labs/labs/components';

export const lapikitComponents: readonly string[] = [
	'app',
	'btn',
	'icon',
	'avatar',
	'dropdown',
	'popover',
	'tooltip',
	'textfield',
	'appbar',
	'btn',
	'icon',
	'avatar',
	'toolbar',
	'btn',
	'icon',
	'avatar',
	'list',
	'list-item',
	'dialog',
	'modal',
	'accordion',
	'accordion-item',
	'alert',
	'aspect-ratio',
	'spacer',
	'separator',
	'chip',
	'card'
] as const;

export const lapikitLabsComponents: readonly string[] = ['sheet'] as const;

export const lapikitPlugins = {
	repl: {
		components: ['repl'],
		ref: '@lapikit/repl'
	}
} as const;
