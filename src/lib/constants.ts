export const lapikitImportsRef = 'lapikit/components';
export const lapikitImportsLabsRef = 'lapikit/labs/components';

export const lapikitComponentPaths: Readonly<Record<string, string>> = {
	app: 'app/app.svelte',
	appbar: 'appbar/appbar.svelte',
	btn: 'btn/btn.svelte',
	icon: 'icon/icon.svelte',
	avatar: 'avatar/avatar.svelte',
	dropdown: 'dropdown/dropdown.svelte',
	popover: 'popover/popover.svelte',
	tooltip: 'tooltip/tooltip.svelte',
	textfield: 'textfield/textfield.svelte',
	toolbar: 'toolbar/toolbar.svelte',
	list: 'list/list.svelte',
	'list-item': 'list/modules/list-item.svelte',
	dialog: 'dialog/dialog.svelte',
	modal: 'modal/modal.svelte',
	accordion: 'accordion/accordion.svelte',
	'accordion-item': 'accordion/modules/accordion-item.svelte',
	alert: 'alert/alert.svelte',
	'aspect-ratio': 'aspect-ratio/aspect-ratio.svelte',
	spacer: 'spacer/spacer.svelte',
	separator: 'separator/separator.svelte',
	chip: 'chip/chip.svelte',
	card: 'card/card.svelte',
	'card-title': 'card/modules/card-title.svelte',
	'card-content': 'card/modules/card-content.svelte',
	'card-media': 'card/modules/card-media.svelte',
	'card-actions': 'card/modules/card-actions.svelte',
	'card-container': 'card/modules/card-container.svelte'
};

export const lapikitLabsComponentPaths: Readonly<Record<string, string>> = {
	sheet: 'sheet/sheet.svelte'
};

export const lapikitComponents: readonly string[] = Object.keys(lapikitComponentPaths);

export const lapikitLabsComponents: readonly string[] = Object.keys(lapikitLabsComponentPaths);

export const lapikitPlugins = {
	repl: {
		components: ['repl'],
		ref: '@lapikit/repl'
	}
} as const;
