<script lang="ts">
	import { onDestroy } from 'svelte';
	import { floating, useComponentAttrs } from '$lib/utils';
	import type { TooltipProps } from './tooltip.types.ts';

	let {
		ref = $bindable(),
		children,
		tooltip,
		open = $bindable(false),
		forceMount = false,
		label,
		rounded = 'xs',
		color,
		location = 'bottom',
		delayDuration = 850,
		density = 'default',
		variant,
		disabled = false,
		avoidCollisions = true,
		class: className,
		style: styleAttr,
		's-class': sClass,
		's-style': sStyle,
		...rest
	}: TooltipProps = $props();

	const tooltipId = $props.id();

	let attrs = $derived(
		useComponentAttrs('kit-tooltip', { className, sClass, styleAttr, sStyle, color }, rest)
	);

	let triggerRef = $state<HTMLElement | null>(null);
	let timer: ReturnType<typeof setTimeout> | null = null;
	let focused = false;
	let mounted = $derived(open || forceMount || !!tooltip);

	const clearTimer = () => {
		if (timer) clearTimeout(timer);
		timer = null;
	};

	const handleHoverOpen = () => {
		if (disabled) return;
		clearTimer();
		if (open) return;
		timer = setTimeout(() => {
			open = true;
			timer = null;
		}, delayDuration);
	};

	const handleFocusOpen = () => {
		if (disabled) return;
		focused = true;
		clearTimer();
		open = true;
	};

	const handleClose = () => {
		clearTimer();
		open = false;
	};

	const handleHoverClose = () => {
		clearTimer();
		if (focused) return;
		timer = setTimeout(handleClose, 100);
	};

	const handleFocusClose = () => {
		focused = false;
		handleClose();
	};

	$effect(() => {
		if (disabled) open = false;
	});

	$effect(() => {
		ref = triggerRef;
	});

	$effect(() => {
		if (!open) return;
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') handleClose();
		};
		document.addEventListener('keydown', onKeyDown);
		return () => document.removeEventListener('keydown', onKeyDown);
	});

	onDestroy(clearTimer);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<span
	bind:this={triggerRef}
	class="kit-tooltip-trigger"
	aria-describedby={open ? tooltipId : undefined}
	onmouseenter={handleHoverOpen}
	onmouseleave={handleHoverClose}
	onfocusin={handleFocusOpen}
	onfocusout={handleFocusClose}
>
	{@render children?.()}
</span>

{#if mounted}
	<div
		id={tooltipId}
		popover="manual"
		role="tooltip"
		aria-label={label}
		class={attrs.class}
		style={attrs.style}
		data-density={density}
		data-variant={variant}
		data-rounded={rounded}
		use:floating={{
			anchor: triggerRef,
			open,
			side: location,
			align: 'center',
			offset: 6,
			flip: avoidCollisions
		}}
		{...attrs.rest}
		onmouseenter={clearTimer}
		onmouseleave={handleHoverClose}
	>
		{#if tooltip}
			{@render tooltip()}
		{:else}
			{label}
		{/if}
	</div>
{/if}

<style lang="scss">
	@use './tooltip';
</style>
