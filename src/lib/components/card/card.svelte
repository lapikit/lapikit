<script lang="ts">
	import { useComponentAttrs, useElevation, useIsInteractive } from '$lib/utils';
	import { ripple } from '$lib/animations';
	import type { CardProps } from './card.types.ts';

	let {
		ref = $bindable(),
		is = 'div',
		children,
		class: className,
		style: styleAttr,
		's-class': sClass,
		's-style': sStyle,
		href,
		type,
		variant = 'filled',
		density = 'default',
		rounded = 'md',
		interactive,
		active = false,
		disabled = false,
		noRipple,
		color,
		elevation,
		...rest
	}: CardProps = $props();

	let tag = $derived((href && 'a') || is);
	let isInteractive = $derived(interactive ?? useIsInteractive(rest, tag, ['a', 'button']));
	let isDisabled = $derived(!!disabled);
	let resolvedHref = $derived(tag === 'a' && !isDisabled ? href : undefined);
	let resolvedType = $derived(tag === 'button' ? (type ?? 'button') : undefined);
	let resolvedDisabled = $derived(tag === 'button' ? isDisabled : undefined);
	let resolvedTabIndex = $derived(tag === 'a' && isDisabled ? -1 : undefined);

	let attrs = $derived(
		useComponentAttrs('kit-card', { className, sClass, styleAttr, sStyle, color, active }, rest)
	);
	let elevationState = $derived(useElevation(elevation));
	let hasOutline = $derived(variant === 'outline' || variant === 'surface');
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
	data-variant={variant}
	data-density={density}
	data-rounded={rounded}
	data-elevation={elevationState.base}
	data-elevation-hover={elevationState.hover}
	data-elevation-active={elevationState.active}
	data-interactive={isInteractive}
	data-active={active}
	data-disabled={isDisabled}
	aria-disabled={isDisabled || undefined}
	use:ripple={{
		component: 'card',
		disabled: noRipple || isDisabled || !isInteractive
	}}
	{...attrs.rest}
>
	{#if hasOutline}
		<span class="outline"></span>
	{/if}

	{@render children?.()}
</svelte:element>

<style lang="scss">
	@use './card';
</style>
