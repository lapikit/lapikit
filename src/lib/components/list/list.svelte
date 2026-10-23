<script lang="ts">
	import { useComponentAttrs } from '$lib/utils';
	import type { ListProps } from './list.types.ts';

	let {
		ref = $bindable(),
		is = 'div',
		children = undefined,
		class: className,
		style: styleAttr,
		's-class': sClass,
		's-style': sStyle,
		size = 'md',
		variant = 'filled',
		density = 'default',
		rounded = 'md',
		nav = false,
		color,
		...rest
	}: ListProps = $props();

	let attrs = $derived(
		useComponentAttrs('kit-list', { className, sClass, styleAttr, sStyle, color }, rest)
	);
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
	data-nav={nav}
	role={nav ? 'navigation' : is === 'ul' ? undefined : 'list'}
	{...attrs.rest}
>
	{@render children?.()}
</svelte:element>

<style lang="scss">
	@use './list';
</style>
