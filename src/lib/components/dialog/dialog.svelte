<script lang="ts">
	import { disabledScroll } from '$lib/@legacy/internal/helpers/scroll';
	import { makeComponentProps } from '$lib/compiler/mapped-code';
	import { useClassName, useStyles } from '$lib/utils';
	import type { DialogDensity, DialogPosition, DialogProps, DialogSize } from './dialog.types.ts';

	function resolveSize(value: DialogSize | undefined): DialogSize {
		return value === 'xs' || value === 'sm' || value === 'md' || value === 'lg' || value === 'xl'
			? value
			: 'md';
	}

	function resolvePosition(value: DialogPosition | undefined): DialogPosition {
		return value === 'top' || value === 'center' || value === 'bottom' ? value : 'center';
	}

	function resolveDensity(value: DialogDensity | undefined): DialogDensity {
		return value === 'compact' || value === 'comfortable' || value === 'default'
			? value
			: 'default';
	}

	let {
		ref = $bindable(),
		children = undefined,
		class: className = '',
		style: styleAttr = '',
		's-class': sClass,
		's-style': sStyle,
		open = $bindable(false),
		persistent = false,
		size = 'md',
		position = 'center',
		density = 'default',
		rounded = 'md',
		classContent = '',
		color = undefined,
		background = undefined,
		...rest
	}: DialogProps = $props();

	let { classProps, styleProps, restProps } = $derived(
		makeComponentProps(rest as Record<string, unknown>)
	);

	let componentClass = $derived(
		useClassName({
			baseClass: 'kit-dialog',
			className: `${className ?? ''}`.trim(),
			sClass,
			classProps
		})
	);

	let componentStyle = $derived(
		useStyles({
			styleAttr,
			sStyle,
			styleProps
		})
	);

	let contentClass = $derived(
		Array.isArray(classContent)
			? classContent.filter(Boolean).join(' ')
			: `${classContent ?? ''}`.trim()
	);

	let safeSize = $derived(resolveSize(size));
	let safePosition = $derived(resolvePosition(position));
	let safeDensity = $derived(resolveDensity(density));
	let mergedStyle = $derived(
		[
			componentStyle,
			color ? `--kit-dialog-fg:${color}` : '',
			background ? `--kit-dialog-bg:${background}` : ''
		]
			.filter(Boolean)
			.join('; ')
	);

	$effect(() => {
		if (!ref) return;

		if (open && !ref.open) {
			ref.showModal();
		}

		if (!open && ref.open) {
			ref.close();
		}

		disabledScroll(open);

		return () => {
			disabledScroll(false);
		};
	});

	function handleClose() {
		if (!persistent) {
			open = false;
			return;
		}

		if (ref && !ref.open && open) {
			ref.showModal();
		}
	}

	function handleCancel(event: Event) {
		if (persistent) {
			event.preventDefault();
			return;
		}

		open = false;
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target !== ref || persistent) return;
		open = false;
	}
</script>

<dialog
	bind:this={ref}
	class={componentClass}
	style={mergedStyle}
	data-size={safeSize}
	data-position={safePosition}
	data-persistent={persistent}
	onclose={handleClose}
	oncancel={handleCancel}
	onclick={handleBackdropClick}
>
	<div
		{...restProps}
		class={['kit-dialog__content', contentClass]}
		data-density={safeDensity}
		data-rounded={rounded}
		onclick={(event: MouseEvent) => event.stopPropagation()}
	>
		{@render children?.()}
	</div>
</dialog>

<style>
	.kit-dialog {
		--kit-dialog-bg: var(--kit-surface-1);
		--kit-dialog-fg: var(--kit-fg);
		--kit-dialog-bd: var(--kit-border);
		--kit-dialog-radius: 12px;
		--kit-dialog-px: 1rem;
		--kit-dialog-py: 1rem;
		--kit-dialog-max: min(32rem, calc(100vw - 2rem));

		border: 0;
		padding: 0;
		margin: auto;
		width: 100%;
		max-width: none;
		background: transparent;
		color: inherit;
		overflow: visible;
	}

	.kit-dialog::backdrop {
		background: rgb(15 23 42 / 0.42);
		backdrop-filter: blur(2px);
	}

	.kit-dialog[data-position='top'] {
		margin-top: 1rem;
		margin-bottom: auto;
	}

	.kit-dialog[data-position='center'] {
		margin-top: auto;
		margin-bottom: auto;
	}

	.kit-dialog[data-position='bottom'] {
		margin-top: auto;
		margin-bottom: 1rem;
	}

	.kit-dialog[data-size='xs'] {
		--kit-dialog-max: min(20rem, calc(100vw - 2rem));
	}

	.kit-dialog[data-size='sm'] {
		--kit-dialog-max: min(24rem, calc(100vw - 2rem));
	}

	.kit-dialog[data-size='md'] {
		--kit-dialog-max: min(32rem, calc(100vw - 2rem));
	}

	.kit-dialog[data-size='lg'] {
		--kit-dialog-max: min(42rem, calc(100vw - 2rem));
	}

	.kit-dialog[data-size='xl'] {
		--kit-dialog-max: min(56rem, calc(100vw - 2rem));
	}

	.kit-dialog__content {
		box-sizing: border-box;
		width: min(100%, var(--kit-dialog-max));
		max-height: calc(100dvh - 2rem);
		overflow: auto;
		padding: var(--kit-dialog-py) var(--kit-dialog-px);
		border: 1px solid var(--kit-dialog-bd);
		border-radius: var(--kit-dialog-radius);
		background: var(--kit-dialog-bg);
		color: var(--kit-dialog-fg);
		margin: 0 auto;
		box-shadow:
			0 20px 50px rgb(15 23 42 / 0.18),
			0 4px 16px rgb(15 23 42 / 0.1);
	}

	.kit-dialog__content[data-density='compact'] {
		--kit-dialog-px: 0.75rem;
		--kit-dialog-py: 0.75rem;
	}

	.kit-dialog__content[data-density='default'] {
		--kit-dialog-px: 1rem;
		--kit-dialog-py: 1rem;
	}

	.kit-dialog__content[data-density='comfortable'] {
		--kit-dialog-px: 1.25rem;
		--kit-dialog-py: 1.25rem;
	}

	.kit-dialog__content[data-rounded='0'] {
		--kit-dialog-radius: 0;
	}

	.kit-dialog__content[data-rounded='xs'] {
		--kit-dialog-radius: 2px;
	}

	.kit-dialog__content[data-rounded='sm'] {
		--kit-dialog-radius: 6px;
	}

	.kit-dialog__content[data-rounded='md'] {
		--kit-dialog-radius: 12px;
	}

	.kit-dialog__content[data-rounded='lg'] {
		--kit-dialog-radius: 18px;
	}

	.kit-dialog__content[data-rounded='xl'] {
		--kit-dialog-radius: 9999px;
	}
</style>
