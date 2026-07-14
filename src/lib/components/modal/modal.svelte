<script lang="ts">
	import { onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import { makeComponentProps } from '$lib/html-mapped';
	import { useClassName, useElevation, useStyles } from '$lib/utils';
	import { modalOpen, modalStack, popModal, pushModal, setOpenModal } from './modal.ts';
	import type { ModalProps } from './modal.types.ts';

	const modalId = crypto.randomUUID();
	let wasPushed = $state(false);

	let {
		ref = $bindable(),
		children = undefined,
		class: className = '',
		style: styleAttr = '',
		's-class': sClass,
		's-style': sStyle,
		open = $bindable(false),
		contain = false,
		size = 'md',
		persistent = false,
		position = 'center',
		rounded = 'md',
		density = 'default',
		classContent = '',
		color,
		background,
		closeWithEsc = true,
		space,
		elevation = '2',
		...rest
	}: ModalProps = $props();

	let { classProps, styleProps, restProps } = $derived(
		makeComponentProps(rest as Record<string, unknown>)
	);

	let elevationState = $derived(useElevation(elevation));

	let componentClass = $derived(
		useClassName({
			baseClass: 'kit-modal',
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
		if (open && !wasPushed) {
			pushModal(modalId);
			wasPushed = true;
		} else if (!open && wasPushed) {
			popModal(modalId);
			wasPushed = false;
		}
	});

	$effect(() => {
		if (open !== undefined && !contain) {
			setOpenModal(open ? (persistent ? 'persistent' : true) : false);
		}
	});

	$effect(() => {
		if ($modalOpen === false && !contain) {
			open = false;
		}
	});

	$effect(() => {
		if (!open || !closeWithEsc || persistent) return;

		const onKeyDown = (event: KeyboardEvent) => {
			const stack = get(modalStack);
			const isTop = stack[stack.length - 1] === modalId;

			if (event.key === 'Escape' && isTop) {
				event.preventDefault();
				open = false;
			}
		};

		document.addEventListener('keydown', onKeyDown);
		return () => {
			document.removeEventListener('keydown', onKeyDown);
		};
	});

	onDestroy(() => {
		if (wasPushed) popModal(modalId);
	});

	function handleClose() {
		if (!persistent) open = false;
	}
</script>

{#if open}
	<div
		bind:this={ref}
		class={componentClass}
		style={componentStyle}
		role="dialog"
		aria-modal={!contain}
		data-contain={contain}
	>
		{#if contain}
			<div class="kit-modal__overlay" role="presentation" onclick={handleClose}></div>
		{/if}

		<div
			{...restProps}
			class={['kit-modal__content', contentClass]}
			data-size={size}
			data-position={position}
			data-density={density}
			data-rounded={rounded}
			data-elevation={elevationState.base}
			data-elevation-hover={elevationState.hover}
			data-elevation-active={elevationState.active}
			onclick={(event: MouseEvent) => event.stopPropagation()}
			style:--kit-modal-fg={color && `var(--kit-color-${color})`}
			style:--kit-modal-bg={background && `var(--kit-color-${background})`}
			style:--kit-modal-space={space}
		>
			{@render children?.()}
		</div>
	</div>
{/if}

<style>
	.kit-modal {
		--kit-modal-max: min(32rem, calc(100vw - 2rem));

		position: fixed;
		inset: 0;
		z-index: 9100;
		pointer-events: none;
	}

	.kit-modal[data-contain='true'] {
		position: absolute;
	}

	.kit-modal__overlay {
		position: absolute;
		inset: 0;
		background: color-mix(in oklab, var(--kit-color-shadow), transparent 70%);
		backdrop-filter: blur(2px);
		pointer-events: auto;
	}

	.kit-modal__content {
		--kit-modal-bg: var(--kit-color-surface-1);
		--kit-modal-fg: var(--kit-color-text);

		position: fixed;
		left: var(--kit-modal-left);
		right: var(--kit-modal-right);
		top: var(--kit-modal-top);
		bottom: var(--kit-modal-bottom);
		translate: var(--kit-modal-translate-x) var(--kit-modal-translate-y);
		box-sizing: border-box;
		width: min(calc(100vw - 2rem), var(--kit-modal-max));
		max-height: calc(100dvh - 2rem);
		overflow: auto;
		padding: calc(var(--kit-modal-px) * var(--kit-modal-density-scale));
		border: 0;
		border-radius: var(--kit-modal-radius);
		background: var(--kit-modal-bg);
		color: var(--kit-modal-fg);
		pointer-events: auto;
	}

	.kit-modal[data-contain='true'] .kit-modal__content {
		position: absolute;
	}

	/**
	* size
	* @link nothing...
	*/
	.kit-modal__content[data-size='xs'] {
		--kit-modal-max: 20rem;
		--kit-modal-px: 10px;
	}

	.kit-modal__content[data-size='sm'] {
		--kit-modal-max: 24rem;
		--kit-modal-px: 12px;
	}

	.kit-modal__content[data-size='md'] {
		--kit-modal-max: 32rem;
		--kit-modal-px: 16px;
	}

	.kit-modal__content[data-size='lg'] {
		--kit-modal-max: 42rem;
		--kit-modal-px: 20px;
	}

	.kit-modal__content[data-size='xl'] {
		--kit-modal-max: 56rem;
		--kit-modal-px: 24px;
	}

	.kit-modal__content[data-size='full'] {
		top: auto;
		bottom: 0;
		left: 0;
		translate: 0 0;
		width: 100%;
		max-width: 100%;
		max-height: 100dvh;
		height: min(100dvh, 100%);
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}

	/** 
	 * density
	 * @link no links
	 */
	.kit-modal__content[data-density='none'] {
		--kit-modal-density-scale: 0;
	}
	.kit-modal__content[data-density='compact'] {
		--kit-modal-density-scale: 0.9;
	}
	.kit-modal__content[data-density='default'] {
		--kit-modal-density-scale: 1;
	}
	.kit-modal__content[data-density='comfortable'] {
		--kit-modal-density-scale: 1.1;
	}

	/** 
	 * rounded
	 * @link ...
	 */
	.kit-modal__content[data-rounded='0'] {
		--kit-modal-radius: var(--kit-shape-none);
	}
	.kit-modal__content[data-rounded='xs'] {
		--kit-modal-radius: var(--kit-shape-xs);
	}
	.kit-modal__content[data-rounded='sm'] {
		--kit-modal-radius: var(--kit-shape-sm);
	}
	.kit-modal__content[data-rounded='md'] {
		--kit-modal-radius: var(--kit-shape-md);
	}
	.kit-modal__content[data-rounded='lg'] {
		--kit-modal-radius: var(--kit-shape-lg);
	}
	.kit-modal__content[data-rounded='xl'] {
		--kit-modal-radius: var(--kit-shape-xl);
	}

	/**
	* position
	* @link nothing...
	*/

	.kit-modal__content[data-position='top'],
	.kit-modal__content[data-position='center'],
	.kit-modal__content[data-position='bottom'] {
		--kit-modal-translate-x: -50%;
		--kit-modal-left: 50%;
	}
	.kit-modal__content[data-position='top'],
	.kit-modal__content[data-position='top-left'],
	.kit-modal__content[data-position='top-right'] {
		--kit-modal-top: var(--kit-modal-space, 1rem);
		--kit-modal-bottom: auto;
		--kit-modal-translate-y: 0;
	}
	.kit-modal__content[data-position='center'],
	.kit-modal__content[data-position='center-left'],
	.kit-modal__content[data-position='center-right'] {
		--kit-modal-top: 50%;
		--kit-modal-bottom: auto;
		--kit-modal-translate-y: -50%;
	}

	.kit-modal__content[data-position='bottom'],
	.kit-modal__content[data-position='bottom-left'],
	.kit-modal__content[data-position='bottom-right'] {
		--kit-modal-top: auto;
		--kit-modal-bottom: var(--kit-modal-space, 1rem);
		--kit-modal-translate-y: 0;
	}
	.kit-modal__content[data-position='top-left'],
	.kit-modal__content[data-position='center-left'],
	.kit-modal__content[data-position='bottom-left'] {
		--kit-modal-left: var(--kit-modal-space, 1rem);
		--kit-modal-translate-x: 0;
	}
	.kit-modal__content[data-position='top-right'],
	.kit-modal__content[data-position='center-right'],
	.kit-modal__content[data-position='bottom-right'] {
		--kit-modal-right: var(--kit-modal-space, 1rem);
	}
</style>
