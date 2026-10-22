<script lang="ts">
	import { useComponentAttrs } from '$lib/utils';
	import type { SeparatorProps } from './separator.types.ts';

	let {
		ref = $bindable(),
		is = 'hr',
		inset = false,
		thickness = 'thin',
		orientation = 'horizontal',
		color,
		class: className,
		style: styleAttr,
		's-class': sClass,
		's-style': sStyle,
		...rest
	}: SeparatorProps = $props();

	let resolvedThickness = $derived(typeof thickness === 'number' ? `${thickness}px` : thickness);
	let attrs = $derived(
		useComponentAttrs(
			'kit-separator',
			{
				className,
				sClass,
				styleAttr,
				sStyle: { '--kit-separator-thickness': resolvedThickness, ...sStyle },
				color
			},
			rest
		)
	);
</script>

<svelte:element
	this={is}
	bind:this={ref}
	class={attrs.class}
	style={attrs.style}
	role={is === 'hr' ? undefined : 'separator'}
	aria-orientation={orientation}
	data-inset={inset || undefined}
	data-orientation={orientation}
	{...attrs.rest}
/>

<style lang="scss">
	@use './separator';
</style>
