<script lang="ts">
	import { onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import { useComponentAttrs, useElevation } from '$lib/utils';
	import { modalStack, popModal, pushModal } from './modal.ts';
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

	function show(node: HTMLDialogElement) {
		node.show();
		return {
			destroy() {
				node.close();
			}
		};
	}
</script>

{#if open}
	<div
		class={attrs.class}
		style={attrs.style}
		data-contain={contain}
		data-density={density}
		data-rounded={rounded}
	>
		{#if contain}
			<div class="kit-modal__overlay" role="presentation" onclick={handleClose}></div>
		{/if}

		<dialog
			bind:this={ref}
			use:show
			{...attrs.rest}
			class={['kit-modal__content', classContent]}
			data-size={size}
			data-position={position}
			data-elevation={elevationState.base}
			data-elevation-hover={elevationState.hover}
			data-elevation-active={elevationState.active}
		>
			{@render children?.()}
		</dialog>
	</div>
{/if}

<style lang="scss">
	@use './modal';
</style>
