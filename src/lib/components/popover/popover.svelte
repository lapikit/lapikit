<script lang="ts">
	import { clickOutside, floating, useComponentAttrs, useElevation } from '$lib/utils';
	import type { ModelPopoverProps, PopoverProps } from './popover.types.ts';

	let {
		ref = $bindable(),
		open = $bindable(false),
		children,
		activator,
		rounded = 'md',
		position = 'bottom',
		color,
		class: className,
		style: styleAttr,
		's-class': sClass,
		's-style': sStyle,
		elevation = '2',
		density = 'default',
		...rest
	}: PopoverProps = $props();

	let attrs = $derived(
		useComponentAttrs('kit-popover-content', { className, sClass, styleAttr, sStyle, color }, rest)
	);
	let elevationState = $derived(useElevation(elevation));

	let contentRef = $state<HTMLElement | null>(null);
	let activatorRef = $state<HTMLElement | null>(null);

	const model: ModelPopoverProps = {
		toggle: (element) => {
			if (element === null) return;
			activatorRef = element;
			open = !open;
		}
	};

	$effect(() => {
		ref = contentRef;
	});

	$effect(() => {
		if (!open) return;

		const onKeydown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') open = false;
		};

		document.addEventListener('keydown', onKeydown);
		return () => document.removeEventListener('keydown', onKeydown);
	});
</script>

{@render activator?.(model)}

{#if open}
	<div
		bind:this={contentRef}
		popover="manual"
		class={attrs.class}
		style={attrs.style}
		role="dialog"
		data-rounded={rounded}
		data-density={density}
		data-elevation={elevationState.base}
		data-elevation-hover={elevationState.hover}
		data-elevation-active={elevationState.active}
		use:floating={{ anchor: activatorRef, side: position, offset: 6 }}
		use:clickOutside={{ exclude: [contentRef, activatorRef], onClose: () => (open = false) }}
		{...attrs.rest}
	>
		{@render children?.()}
	</div>
{/if}

<style lang="scss">
	@use './popover';
</style>
