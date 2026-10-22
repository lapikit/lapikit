<script lang="ts">
	/**
	 * Sheet component
	 * @description A simple sheet component for experimentation for developers Lapikit. Please don't use it in production.
	 */
	import { useComponentAttrs, useElevation, useIsInteractive } from '$lib/utils';
	import { ripple } from '$lib/animations';
	import type { SheetProps } from './sheet.types.ts';

	let {
		ref = $bindable(),
		is = 'div',
		href,
		type,
		class: className,
		style: styleAttr,
		children,
		's-class': sClass,
		's-style': sStyle,
		elevation,
		rounded,
		density = 'default',
		variant = 'filled',
		active,
		color,
		interactive,
		disabled = false,
		noRipple,
		...rest
	}: SheetProps = $props();

	// states
	let attrs = $derived(
		useComponentAttrs('kit-sheet', { className, sClass, styleAttr, sStyle, color, active }, rest)
	);
	let elevationState = $derived(useElevation(elevation));
	let tag = $derived((href && 'a') || is);
	// undefined: detected (a, button, onclick...), true: forced, false: no visual feedback (still clickable)
	let isInteractive = $derived(interactive ?? useIsInteractive(rest, tag, ['a', 'button']));
	let isDisabled = $derived(!!disabled);
	let resolvedHref = $derived(tag === 'a' && !isDisabled ? href : undefined);
	let resolvedType = $derived(tag === 'button' ? (type ?? 'button') : undefined);
	let resolvedDisabled = $derived(tag === 'button' ? isDisabled : undefined);
	let resolvedTabIndex = $derived(tag === 'a' && isDisabled ? -1 : undefined);
</script>

<svelte:element
	this={tag}
	bind:this={ref}
	class={attrs.class}
	style={attrs.style}
	href={resolvedHref}
	type={resolvedType}
	disabled={resolvedDisabled}
	tabindex={resolvedTabIndex}
	data-rounded={rounded}
	data-density={density}
	data-variant={variant}
	data-elevation={elevationState.base}
	data-elevation-hover={elevationState.hover}
	data-elevation-active={elevationState.active}
	data-active={active}
	data-interactive={isInteractive}
	data-disabled={isDisabled}
	aria-disabled={isDisabled || undefined}
	use:ripple={{
		component: 'sheet',
		disabled: noRipple || isDisabled || !isInteractive
	}}
	{...attrs.rest}
>
	{@render children?.()}
</svelte:element>

<style lang="scss">
	@use './sheet';
</style>
