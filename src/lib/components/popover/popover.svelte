<script lang="ts">
	import { DEV } from 'esm-env';
	import { clickOutside, floating, useComponentAttrs, useElevation } from '$lib/utils';
	import type { PopoverProps, PopoverTriggerProps } from './popover.types.ts';

	let {
		ref = $bindable(),
		open = $bindable(false),
		children,
		trigger,
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

	$effect(() => {
		if (DEV && activator)
			console.warn('[lapikit] kit:popover: activator is removed, use the trigger snippet');
	});

	const popoverId = $props.id();

	let attrs = $derived(
		useComponentAttrs('kit-popover-content', { className, sClass, styleAttr, sStyle, color }, rest)
	);
	let elevationState = $derived(useElevation(elevation));

	let contentRef = $state<HTMLElement | null>(null);
	let triggerRef = $state<HTMLElement | null>(null);

	const focusableSelector =
		'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

	const close = (restoreFocus = false) => {
		open = false;
		if (restoreFocus) triggerRef?.focus();
	};

	let triggerProps: PopoverTriggerProps = $derived({
		'aria-haspopup': 'dialog',
		'aria-expanded': open,
		'aria-controls': popoverId,
		onclick: (event: MouseEvent) => {
			triggerRef = event.currentTarget as HTMLElement;
			open = !open;
		}
	});

	// focus leaves the popover for another element of the page
	const onFocusOut = (event: FocusEvent) => {
		const next = event.relatedTarget as Node | null;
		if (!next || contentRef?.contains(next) || triggerRef?.contains(next)) return;
		close();
	};

	$effect(() => {
		ref = contentRef;
	});

	$effect(() => {
		if (open && !triggerRef?.isConnected) {
			triggerRef = document.querySelector<HTMLElement>(
				`[aria-controls="${CSS.escape(popoverId)}"]`
			);
		}
	});

	$effect(() => {
		if (!open || !contentRef) return;
		const content = contentRef;
		const frame = requestAnimationFrame(() => {
			const first = content.querySelector<HTMLElement>(focusableSelector);
			(first ?? content).focus();
		});
		return () => cancelAnimationFrame(frame);
	});

	$effect(() => {
		if (!open) return;

		const onKeydown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') close(true);
		};

		document.addEventListener('keydown', onKeydown);
		return () => document.removeEventListener('keydown', onKeydown);
	});
</script>

{@render trigger?.(triggerProps)}

{#if open}
	<div
		bind:this={contentRef}
		id={popoverId}
		popover="manual"
		class={attrs.class}
		style={attrs.style}
		role="dialog"
		tabindex="-1"
		data-rounded={rounded}
		data-density={density}
		data-elevation={elevationState.base}
		data-elevation-hover={elevationState.hover}
		data-elevation-active={elevationState.active}
		onfocusout={onFocusOut}
		use:floating={{ anchor: triggerRef, side: position, offset: 6 }}
		use:clickOutside={{ exclude: [contentRef, triggerRef], onClose: () => close() }}
		{...attrs.rest}
	>
		{@render children?.()}
	</div>
{/if}

<style lang="scss">
	@use './popover';
</style>
