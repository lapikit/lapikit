<script lang="ts">
	import type { CardMediaProps } from '../card.types';
	import { useComponentAttrs } from '$lib/utils';

	let {
		ref = $bindable(),
		is = 'div',
		children,
		class: className,
		style: styleAttr,
		's-class': sClass,
		's-style': sStyle,
		...rest
	}: CardMediaProps = $props();

	let attrs = $derived(
		useComponentAttrs('kit-card-media', { className, sClass, styleAttr, sStyle }, rest)
	);
</script>

<svelte:element this={is} bind:this={ref} class={attrs.class} style={attrs.style} {...attrs.rest}>
	{@render children?.()}
</svelte:element>

<style lang="scss">
	.kit-card-media {
		overflow: hidden;
		// concentric with the card (radius - padding), never sharper than xs nor rounder than the card
		border-radius: min(
			var(--kit-card-radius),
			max(calc(var(--kit-card-radius) - var(--kit-card-padding)), var(--kit-shape-xs))
		);
	}
</style>
