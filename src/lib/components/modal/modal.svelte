<script lang="ts">
	import { untrack } from 'svelte';
	import { onEscape, useComponentAttrs, elevationAttrs } from '$lib/utils';
	import { isTopModal, popModal, pushModal } from './modal.svelte.ts';
	import type { ModalProps } from './modal.types.ts';

	const modalId = $props.id();

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
	let elevationAttributes = $derived(elevationAttrs(elevation));

	$effect(() => {
		if (!open) return;
		untrack(() => pushModal(modalId));
		return () => popModal(modalId);
	});

	onEscape(
		() => open && closeWithEsc && !persistent,
		(event) => {
			if (!isTopModal(modalId)) return;
			event.preventDefault();
			open = false;
		}
	);

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
			{...elevationAttributes}
		>
			{@render children?.()}
		</dialog>
	</div>
{/if}

<style lang="scss">
	@use './modal';
</style>
