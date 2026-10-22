<script module lang="ts">
	let uid = 0;
</script>

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

	const tooltipId = `kit-tooltip-${++uid}`;

	let attrs = $derived(
		useComponentAttrs('kit-tooltip', { className, sClass, styleAttr, sStyle, color }, rest)
	);

	let triggerRef = $state<HTMLElement | null>(null);
	let timer: ReturnType<typeof setTimeout> | null = null;
	let mounted = $derived(open || forceMount || !!tooltip);

	const clearTimer = () => {
		if (timer) clearTimeout(timer);
		timer = null;
	};

	const handleHoverOpen = () => {
		if (disabled) return;
		clearTimer();
		timer = setTimeout(() => {
			open = true;
			timer = null;
		}, delayDuration);
	};

	const handleFocusOpen = () => {
		if (disabled) return;
		clearTimer();
		open = true;
	};

	const handleClose = () => {
		clearTimer();
		open = false;
	};

	$effect(() => {
		if (disabled) open = false;
	});

	$effect(() => {
		ref = triggerRef;
	});

	onDestroy(clearTimer);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<span
	bind:this={triggerRef}
	class="kit-tooltip-trigger"
	aria-describedby={open ? tooltipId : undefined}
	onmouseenter={handleHoverOpen}
	onmouseleave={handleClose}
	onfocusin={handleFocusOpen}
	onfocusout={handleClose}
	onkeydown={(event) => event.key === 'Escape' && handleClose()}
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
