<script lang="ts">
	import { onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import { makeComponentProps } from '$lib/labs/compiler/mapped-code.js';
	import { useClassName, useStyles } from '$lib/labs/utils/index.js';
	import { modalOpen, modalStack, popModal, pushModal, setOpenModal } from '$lib/stores/index.js';
	import type { ModalDensity, ModalPosition, ModalProps, ModalSize } from './modal.types.ts';

	function resolveSize(value: ModalSize | undefined): ModalSize {
		return value === 'xs' ||
			value === 'sm' ||
			value === 'md' ||
			value === 'lg' ||
			value === 'xl' ||
			value === 'full'
			? value
			: 'md';
	}

	function resolvePosition(value: ModalPosition | undefined): ModalPosition {
		return value === 'top' || value === 'center' || value === 'bottom' ? value : 'center';
	}

	function resolveDensity(value: ModalDensity | undefined): ModalDensity {
		return value === 'compact' || value === 'comfortable' || value === 'default' ? value : 'default';
	}

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
		color = undefined,
		background = undefined,
		closeWithEsc = true,
		...rest
	}: ModalProps = $props();

	let { classProps, styleProps, restProps } = $derived(
		makeComponentProps(rest as Record<string, unknown>)
	);

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
		Array.isArray(classContent) ? classContent.filter(Boolean).join(' ') : `${classContent ?? ''}`.trim()
	);

	let safeSize = $derived(resolveSize(size));
	let safePosition = $derived(resolvePosition(position));
	let safeDensity = $derived(resolveDensity(density));
	let mergedStyle = $derived(
		[
			componentStyle,
			color ? `--kit-modal-fg:${color}` : '',
			background ? `--kit-modal-bg:${background}` : ''
		]
			.filter(Boolean)
			.join('; ')
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
		style={mergedStyle}
		role="dialog"
		aria-modal={!contain}
		data-contain={contain}
	>
		{#if contain}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<div class="kit-modal__overlay" onclick={handleClose}></div>
		{/if}

		<div
			{...restProps}
			class={['kit-modal__content', contentClass]}
			data-size={safeSize}
			data-position={safePosition}
			data-density={safeDensity}
			data-rounded={rounded}
			onclick={(event: MouseEvent) => event.stopPropagation()}
		>
			{@render children?.()}
		</div>
	</div>
{/if}

<style>
	.kit-modal {
		--kit-modal-bg: var(--kit-surface-1);
		--kit-modal-fg: var(--kit-fg);
		--kit-modal-bd: var(--kit-border);
		--kit-modal-radius: 12px;
		--kit-modal-px: 1rem;
		--kit-modal-py: 1rem;
		--kit-modal-max: min(32rem, calc(100vw - 2rem));
		--kit-modal-top: 50%;
		--kit-modal-bottom: auto;
		--kit-modal-translate-y: -50%;

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
		background: rgb(15 23 42 / 0.42);
		backdrop-filter: blur(2px);
		pointer-events: auto;
	}

	.kit-modal__content {
		position: fixed;
		left: 50%;
		top: var(--kit-modal-top);
		bottom: var(--kit-modal-bottom);
		translate: -50% var(--kit-modal-translate-y);
		box-sizing: border-box;
		width: min(calc(100vw - 2rem), var(--kit-modal-max));
		max-height: calc(100dvh - 2rem);
		overflow: auto;
		padding: var(--kit-modal-py) var(--kit-modal-px);
		border: 1px solid var(--kit-modal-bd);
		border-radius: var(--kit-modal-radius);
		background: var(--kit-modal-bg);
		color: var(--kit-modal-fg);
		box-shadow:
			0 20px 50px rgb(15 23 42 / 0.18),
			0 4px 16px rgb(15 23 42 / 0.1);
		pointer-events: auto;
	}

	.kit-modal[data-contain='true'] .kit-modal__content {
		position: absolute;
	}

	.kit-modal__content[data-size='xs'] {
		--kit-modal-max: min(20rem, calc(100vw - 2rem));
	}

	.kit-modal__content[data-size='sm'] {
		--kit-modal-max: min(24rem, calc(100vw - 2rem));
	}

	.kit-modal__content[data-size='md'] {
		--kit-modal-max: min(32rem, calc(100vw - 2rem));
	}

	.kit-modal__content[data-size='lg'] {
		--kit-modal-max: min(42rem, calc(100vw - 2rem));
	}

	.kit-modal__content[data-size='xl'] {
		--kit-modal-max: min(56rem, calc(100vw - 2rem));
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

	.kit-modal__content[data-position='top'] {
		--kit-modal-top: 1rem;
		--kit-modal-bottom: auto;
		--kit-modal-translate-y: 0;
	}

	.kit-modal__content[data-position='center'] {
		--kit-modal-top: 50%;
		--kit-modal-bottom: auto;
		--kit-modal-translate-y: -50%;
	}

	.kit-modal__content[data-position='bottom'] {
		--kit-modal-top: auto;
		--kit-modal-bottom: 1rem;
		--kit-modal-translate-y: 0;
	}

	.kit-modal__content[data-density='compact'] {
		--kit-modal-px: 0.75rem;
		--kit-modal-py: 0.75rem;
	}

	.kit-modal__content[data-density='default'] {
		--kit-modal-px: 1rem;
		--kit-modal-py: 1rem;
	}

	.kit-modal__content[data-density='comfortable'] {
		--kit-modal-px: 1.25rem;
		--kit-modal-py: 1.25rem;
	}

	.kit-modal__content[data-rounded='0'] {
		--kit-modal-radius: 0;
	}

	.kit-modal__content[data-rounded='xs'] {
		--kit-modal-radius: 2px;
	}

	.kit-modal__content[data-rounded='sm'] {
		--kit-modal-radius: 6px;
	}

	.kit-modal__content[data-rounded='md'] {
		--kit-modal-radius: 12px;
	}

	.kit-modal__content[data-rounded='lg'] {
		--kit-modal-radius: 18px;
	}

	.kit-modal__content[data-rounded='xl'] {
		--kit-modal-radius: 9999px;
	}
</style>
