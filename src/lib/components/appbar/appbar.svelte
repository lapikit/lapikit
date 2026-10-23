<script lang="ts">
	import { useComponentAttrs, useElevation } from '$lib/utils';
	import type { AppbarProps } from './appbar.types.ts';

	let {
		ref = $bindable(),
		is = 'header',
		children,
		class: className,
		style: styleAttr,
		's-class': sClass,
		's-style': sStyle,
		classContent,
		size = 'md',
		variant = 'filled',
		rounded = 0,
		color,
		density = 'default',
		elevation,
		...rest
	}: AppbarProps = $props();

	let attrs = $derived(
		useComponentAttrs('kit-appbar', { className, sClass, styleAttr, sStyle, color }, rest)
	);
	let elevationState = $derived(useElevation(elevation));
	let hasOutline = $derived(variant === 'outline' || variant === 'surface');
</script>

<svelte:element
	this={is}
	bind:this={ref}
	class={attrs.class}
	style={attrs.style}
	data-size={size}
	data-variant={variant}
	data-density={density}
	data-rounded={rounded}
	data-elevation={elevationState.base}
	data-elevation-hover={elevationState.hover}
	data-elevation-active={elevationState.active}
	{...attrs.rest}
>
	{#if hasOutline}
		<span class="outline"></span>
	{/if}

	<div class={['kit-appbar__wrapper', classContent]}>
		{@render children?.()}
	</div>
</svelte:element>

<style lang="scss">
	@use './appbar';
</style>
