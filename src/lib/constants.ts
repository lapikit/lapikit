export const lapikitImportsRef = 'lapikit/components';

export const lapikitComponents: readonly string[] = [
	'sheet',
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
	'accordionItem',
	'alert',
	'aspect-ratio',
	'spacer',
	'separator',
	'chip',
	'card'
] as const;

export const lapikitPlugins = {
	repl: {
		components: ['repl'],
		ref: '@lapikit/repl'
	}
} as const;
