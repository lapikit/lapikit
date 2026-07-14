<script lang="ts">
	import { makeComponentProps } from '$lib/html-mapped';
	import { useClassName, useStyles, disabledScroll, useElevation } from '$lib/utils';
	import type { DialogProps } from './dialog.types.ts';

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
		color,
		background,
		elevation = '2',
		space,
		...rest
	}: DialogProps = $props();

	let { classProps, styleProps, restProps } = $derived(
		makeComponentProps(rest as Record<string, unknown>)
	);

	let elevationState = $derived(useElevation(elevation));

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
	style={componentStyle}
	data-size={size}
	data-position={position}
	data-persistent={persistent}
	onclose={handleClose}
	oncancel={handleCancel}
	onclick={handleBackdropClick}
>
	<div
		{...restProps}
		class={['kit-dialog__content', contentClass]}
		data-density={density}
		data-rounded={rounded}
		data-elevation={elevationState.base}
		data-elevation-hover={elevationState.hover}
		data-elevation-active={elevationState.active}
		onclick={(event: MouseEvent) => event.stopPropagation()}
		style:--kit-dialog-fg={color && `var(--kit-color-${color})`}
		style:--kit-dialog-bg={background && `var(--kit-color-${background})`}
		style:--kit-dialog-space={space}
	>
		{@render children?.()}
	</div>
</dialog>

<style>
	.kit-dialog {
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
		background: color-mix(in oklab, var(--kit-color-shadow), transparent 70%);
		backdrop-filter: blur(2px);
	}

	/**
	* position
	* @link nothing...
	*/
	.kit-dialog[data-position='top'],
	.kit-dialog[data-position='top-left'],
	.kit-dialog[data-position='top-right'] {
		margin-top: var(--kit-dialog-space, 1rem);
		margin-bottom: auto;
	}
	.kit-dialog[data-position='center'],
	.kit-dialog[data-position='center-left'],
	.kit-dialog[data-position='center-right'] {
		margin-top: auto;
		margin-bottom: auto;
	}
	.kit-dialog[data-position='bottom'],
	.kit-dialog[data-position='bottom-left'],
	.kit-dialog[data-position='bottom-right'] {
		margin-top: auto;
		margin-bottom: var(--kit-dialog-space, 1rem);
	}
	.kit-dialog[data-position='top-left'] .kit-dialog__content,
	.kit-dialog[data-position='center-left'] .kit-dialog__content,
	.kit-dialog[data-position='bottom-left'] .kit-dialog__content {
		margin-left: var(--kit-dialog-space, 1rem);
	}
	.kit-dialog[data-position='top-right'] .kit-dialog__content,
	.kit-dialog[data-position='center-right'] .kit-dialog__content,
	.kit-dialog[data-position='bottom-right'] .kit-dialog__content {
		margin-right: var(--kit-dialog-space, 1rem);
	}

	/**
	* size
	* @link nothing...
	*/
	.kit-dialog[data-size='xs'] {
		--kit-dialog-max: 20rem;
		--kit-dialog-px: 10px;
	}

	.kit-dialog[data-size='sm'] {
		--kit-dialog-max: 24rem;
		--kit-dialog-px: 12px;
	}

	.kit-dialog[data-size='md'] {
		--kit-dialog-max: 32rem;
		--kit-dialog-px: 16px;
	}

	.kit-dialog[data-size='lg'] {
		--kit-dialog-max: 42rem;
		--kit-dialog-px: 20px;
	}

	.kit-dialog[data-size='xl'] {
		--kit-dialog-max: 56rem;
		--kit-dialog-px: 24px;
	}

	.kit-dialog__content {
		--kit-dialog-fg: var(--kit-color-text);
		--kit-dialog-bg: var(--kit-color-surface-1);

		box-sizing: border-box;
		width: min(100%, min(var(--kit-dialog-max), calc(100vw - 2rem)));
		max-height: calc(100dvh - 2rem);
		overflow: auto;
		padding: calc(var(--kit-dialog-px) * var(--kit-dialog-density-scale));
		border: 0;
		border-radius: var(--kit-dialog-radius);
		background: var(--kit-dialog-bg);
		color: var(--kit-dialog-fg);
		margin: 0 auto;
	}

	/** 
	 * density
	 * @link no links
	 */
	.kit-dialog__content[data-density='none'] {
		--kit-dialog-density-scale: 0;
	}
	.kit-dialog__content[data-density='compact'] {
		--kit-dialog-density-scale: 0.9;
	}
	.kit-dialog__content[data-density='default'] {
		--kit-dialog-density-scale: 1;
	}
	.kit-dialog__content[data-density='comfortable'] {
		--kit-dialog-density-scale: 1.1;
	}

	/** 
	 * rounded
	 * @link ...
	 */
	.kit-dialog__content[data-rounded='0'] {
		--kit-dialog-radius: var(--kit-shape-none);
	}
	.kit-dialog__content[data-rounded='xs'] {
		--kit-dialog-radius: var(--kit-shape-xs);
	}
	.kit-dialog__content[data-rounded='sm'] {
		--kit-dialog-radius: var(--kit-shape-sm);
	}
	.kit-dialog__content[data-rounded='md'] {
		--kit-dialog-radius: var(--kit-shape-md);
	}
	.kit-dialog__content[data-rounded='lg'] {
		--kit-dialog-radius: var(--kit-shape-lg);
	}
	.kit-dialog__content[data-rounded='xl'] {
		--kit-dialog-radius: var(--kit-shape-xl);
	}
</style>
