<script lang="ts">
	import { onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import { splitAriaAttrs, useComponentAttrs, useElevation } from '$lib/utils';
	import { modalOpen, modalStack, popModal, pushModal, setOpenModal } from './modal.ts';
	import type { ModalProps } from './modal.types.ts';

	const modalId = $props.id();
	let wasPushed = $state(false);

	let {
		ref = $bindable(),
		children = undefined,
		class: className,
		style: styleAttr,
		's-class': sClass,
		's-style': sStyle,
		open = $bindable(false),
		contain = false,
		size = 'md',
		persistent = false,
		position = 'center',
		rounded = 'md',
		density = 'default',
		classContent,
		color,
		closeWithEsc = true,
		space,
		elevation = '2',
		...rest
	}: ModalProps = $props();

	let attrs = $derived(
		useComponentAttrs(
			'kit-modal',
			{
				className,
				sClass,
				styleAttr,
				sStyle: space ? { '--kit-modal-space': space, ...sStyle } : sStyle,
				color
			},
			rest
		)
	);
	let elevationState = $derived(useElevation(elevation));
	let split = $derived(splitAriaAttrs(attrs.rest));

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
		class={attrs.class}
		style={attrs.style}
		role="dialog"
		aria-modal={!contain}
		{...split.aria}
		data-contain={contain}
		data-density={density}
		data-rounded={rounded}
	>
		{#if contain}
			<div class="kit-modal__overlay" role="presentation" onclick={handleClose}></div>
		{/if}

		<div
			{...split.others}
			class={['kit-modal__content', classContent]}
			data-size={size}
			data-position={position}
			data-elevation={elevationState.base}
			data-elevation-hover={elevationState.hover}
			data-elevation-active={elevationState.active}
			onclick={(event: MouseEvent) => event.stopPropagation()}
		>
			{@render children?.()}
		</div>
	</div>
{/if}

<style lang="scss">
	@use './modal';
</style>
