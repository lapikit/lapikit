<script lang="ts">
	import { onDestroy } from 'svelte';
	import { DEV } from 'esm-env';
	import { floating, useComponentAttrs } from '$lib/utils';
	import type { TooltipProps, TooltipTriggerProps } from './tooltip.types.ts';

	let {
		ref = $bindable(),
		id,
		children,
		trigger,
		tooltip,
		open = $bindable(false),
		label,
		asLabel = false,
		rounded = 'xs',
		color,
		location = 'bottom',
		delayDuration = 850,
		closeDelay = 100,
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

	$effect(() => {
		if (DEV && children)
			console.warn('[lapikit] kit:tooltip: children is removed, use the trigger snippet');
	});

	const generatedId = $props.id();
	let tooltipId = $derived(id || generatedId);

	let attrs = $derived(
		useComponentAttrs('kit-tooltip', { className, sClass, styleAttr, sStyle, color }, rest)
	);

	let anchor = $state<HTMLElement | null>(null);
	let timer: ReturnType<typeof setTimeout> | null = null;
	let focused = false;
	let ariaAttribute = $derived(asLabel ? 'aria-labelledby' : 'aria-describedby');

	const clearTimer = () => {
		if (timer) clearTimeout(timer);
		timer = null;
	};

	const show = () => {
		clearTimer();
		open = true;
	};

	const hide = () => {
		clearTimer();
		open = false;
	};

	const scheduleHide = () => {
		clearTimer();
		if (focused) return;
		timer = setTimeout(hide, closeDelay);
	};

	const isFocusVisible = (element: HTMLElement) => {
		try {
			return element.matches(':focus-visible');
		} catch {
			return true;
		}
	};

	// the trigger, when open is set without a pointer or a focus event
	const findAnchor = () =>
		document.querySelector<HTMLElement>(`[${ariaAttribute}~="${CSS.escape(tooltipId)}"]`);

	let triggerProps: TooltipTriggerProps = $derived({
		[ariaAttribute]: tooltipId,
		onpointerenter: (event: PointerEvent) => {
			if (disabled || event.pointerType === 'touch') return;
			anchor = event.currentTarget as HTMLElement;
			clearTimer();
			if (open) return;
			timer = setTimeout(show, delayDuration);
		},
		onpointerleave: scheduleHide,
		onpointerdown: hide,
		onfocus: (event: FocusEvent) => {
			if (disabled) return;
			anchor = event.currentTarget as HTMLElement;
			focused = true;
			if (isFocusVisible(event.target as HTMLElement)) show();
		},
		onblur: () => {
			focused = false;
			hide();
		}
	});

	/** the handlers of the trigger, for the tooltip prop of kit:btn, kit:chip and kit:icon */
	export function triggerHandlers() {
		return triggerProps;
	}

	$effect(() => {
		if (disabled) open = false;
	});

	$effect(() => {
		if (open && !anchor?.isConnected) anchor = findAnchor();
	});

	$effect(() => {
		if (!open) return;
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') hide();
		};
		document.addEventListener('keydown', onKeyDown);
		return () => document.removeEventListener('keydown', onKeyDown);
	});

	onDestroy(clearTimer);
</script>

{@render trigger?.(triggerProps)}

{#if label || tooltip}
	<div
		bind:this={ref}
		id={tooltipId}
		popover="manual"
		role="tooltip"
		class={attrs.class}
		style={attrs.style}
		data-density={density}
		data-variant={variant}
		data-rounded={rounded}
		use:floating={{
			anchor,
			open: open && !!anchor,
			side: location,
			align: 'center',
			offset: 6,
			flip: avoidCollisions
		}}
		{...attrs.rest}
		onmouseenter={clearTimer}
		onmouseleave={scheduleHide}
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
