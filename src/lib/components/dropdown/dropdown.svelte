<script lang="ts">
	import { onDestroy } from 'svelte';
	import {
		clickOutside,
		floating,
		useComponentAttrs,
		useElevation,
		type FloatingAnchor
	} from '$lib/utils';
	import type { DropdownProps, ModelDropdownProps } from './dropdown.types.ts';

	let {
		ref = $bindable(),
		children,
		activator,
		rounded = 'md',
		position = 'bottom',
		closeOnClick = false,
		openOnHover = false,
		color,
		density = 'default',
		class: className,
		style: styleAttr,
		's-class': sClass,
		's-style': sStyle,
		elevation,
		...rest
	}: DropdownProps = $props();

	let attrs = $derived(
		useComponentAttrs('kit-dropdown-content', { className, sClass, styleAttr, sStyle, color }, rest)
	);
	let elevationState = $derived(useElevation(elevation));

	let contentRef = $state<HTMLElement | null>(null);
	let activatorRef = $state<HTMLElement | PointerEvent | null>(null);
	let open = $state(false);
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	// a pointer event opens the menu at the position of the pointer (context menu)
	let anchor = $derived<FloatingAnchor | null>(
		activatorRef instanceof HTMLElement
			? activatorRef
			: activatorRef
				? { x: activatorRef.clientX, y: activatorRef.clientY }
				: null
	);

	const clearHoverTimeout = () => {
		if (timeoutId) clearTimeout(timeoutId);
		timeoutId = null;
	};

	const handleToggle = (element: HTMLElement | PointerEvent | null) => {
		if (element === null) return;
		activatorRef = element;
		open = !open;
	};

	const handleClose = () => {
		clearHoverTimeout();
		open = false;
	};

	const handleMouseEvent = (
		state: 'open' | 'close',
		element: HTMLElement | PointerEvent | null
	) => {
		if (!openOnHover) return;

		if (state === 'open') {
			clearHoverTimeout();
			if (element) activatorRef = element;
			open = true;
			return;
		}

		timeoutId = setTimeout(() => {
			open = false;
			timeoutId = null;
		}, 150);
	};

	const model: ModelDropdownProps = {
		get open() {
			return open;
		},
		close: handleClose,
		toggle: handleToggle
	};

	$effect(() => {
		ref = contentRef;
	});

	$effect(() => {
		if (!open) return;

		const onKeydown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') handleClose();
		};

		document.addEventListener('keydown', onKeydown);
		return () => document.removeEventListener('keydown', onKeydown);
	});

	onDestroy(clearHoverTimeout);
</script>

{@render activator?.(model, (state, element) => handleMouseEvent(state, element))}

{#if open}
	<div
		bind:this={contentRef}
		popover="manual"
		class={attrs.class}
		style={attrs.style}
		role="menu"
		data-rounded={rounded}
		data-density={density}
		data-elevation={elevationState.base}
		data-elevation-hover={elevationState.hover}
		data-elevation-active={elevationState.active}
		onmouseover={() => handleMouseEvent('open', activatorRef)}
		onmouseleave={() => handleMouseEvent('close', activatorRef)}
		onclick={(event) => {
			event.stopPropagation();
			if (closeOnClick) handleClose();
		}}
		use:floating={{ anchor, side: position, offset: 0 }}
		use:clickOutside={{ exclude: [contentRef, activatorRef], onClose: handleClose }}
		{...attrs.rest}
	>
		{@render children?.()}
	</div>
{/if}

<style lang="scss">
	@use './dropdown';
</style>
