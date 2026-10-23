<script lang="ts">
	import { useComponentAttrs, useElevation } from '$lib/utils';
	import type { ToolbarProps } from './toolbar.types.ts';

	let {
		ref = $bindable(),
		is = 'div',
		children,
		class: className,
		style: styleAttr,
		's-class': sClass,
		's-style': sStyle,
		classContent,
		variant = 'filled',
		rounded = 'md',
		size = 'md',
		color,
		density = 'default',
		orientation = 'horizontal',
		elevation,
		...rest
	}: ToolbarProps = $props();

	let attrs = $derived(
		useComponentAttrs('kit-toolbar', { className, sClass, styleAttr, sStyle, color }, rest)
	);
	let elevationState = $derived(useElevation(elevation));
	let hasOutline = $derived(variant === 'outline' || variant === 'surface');
</script>

<svelte:element
	this={is}
	bind:this={ref}
	class={attrs.class}
	style={attrs.style}
	role="toolbar"
	aria-orientation={orientation}
	data-variant={variant}
	data-density={density}
	data-orientation={orientation}
	data-rounded={rounded}
	data-size={size}
	data-elevation={elevationState.base}
	data-elevation-hover={elevationState.hover}
	data-elevation-active={elevationState.active}
	{...attrs.rest}
>
	{#if hasOutline}
		<span class="outline"></span>
	{/if}

	<div class={['kit-toolbar__wrapper', classContent]}>
		{@render children?.()}
	</div>
</svelte:element>

<style lang="scss">
	@use './toolbar';
</style>
