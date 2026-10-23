<script lang="ts">
	import { useComponentAttrs } from '$lib/utils';
	import type { AccordionProps } from './accordion.types.ts';

	let {
		ref = $bindable(),
		is = 'div',
		children,
		class: className,
		style: styleAttr,
		's-class': sClass,
		's-style': sStyle,
		size = 'md',
		variant = 'filled',
		density = 'default',
		rounded = 'md',
		text,
		color,
		spacer,
		hideIcon,
		...rest
	}: AccordionProps = $props();

	let attrs = $derived(
		useComponentAttrs('kit-accordion', { className, sClass, styleAttr, sStyle, color }, rest)
	);
</script>

<svelte:element
	this={is}
	bind:this={ref}
	class={attrs.class}
	style={attrs.style}
	data-text={text ? true : undefined}
	data-spacer={spacer}
	data-hide-icon={hideIcon}
	data-size={size}
	data-variant={variant}
	data-density={density}
	data-rounded={rounded}
	{...attrs.rest}
>
	{@render children?.()}
</svelte:element>

<style lang="scss">
	@use './accordion';
</style>
