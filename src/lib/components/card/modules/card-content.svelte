<script lang="ts">
	import type { CardContentProps } from '../card.types';
	import { useComponentAttrs } from '$lib/utils';

	let {
		ref = $bindable(),
		is = 'div',
		children,
		class: className,
		style: styleAttr,
		's-class': sClass,
		's-style': sStyle,
		color,
		...rest
	}: CardContentProps = $props();

	let attrs = $derived(
		useComponentAttrs('kit-card-content', { className, sClass, styleAttr, sStyle, color }, rest)
	);
</script>

<svelte:element this={is} bind:this={ref} class={attrs.class} style={attrs.style} {...attrs.rest}>
	{@render children?.()}
</svelte:element>

<style lang="scss">
	.kit-card-content {
		--kit-card-content-color: initial;

		color: var(--kit-card-content-color, currentColor);
		display: block;
		line-height: 1.45;
	}

	.kit-card-content > :global(*) {
		margin: 0;
	}
</style>
