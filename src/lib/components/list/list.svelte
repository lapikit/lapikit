<script lang="ts">
	import { useComponentAttrs } from '$lib/utils';
	import { setListContext } from './list.context.ts';
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
	let role = $derived(nav ? 'navigation' : is === 'ul' ? undefined : 'list');
	let customRole = $derived(attrs.rest.role as string | undefined);

	setListContext({
		get item() {
			if (customRole) return customRole === 'list' ? 'listitem' : undefined;
			if (is === 'ul') return 'li';
			return role === 'list' ? 'listitem' : undefined;
		}
	});
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
	{role}
	{...attrs.rest}
>
	{@render children?.()}
</svelte:element>

<style lang="scss">
	@use './list';
</style>
