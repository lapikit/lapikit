<script lang="ts">
	import type { CardTitleProps } from '../card.types';
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
	}: CardTitleProps = $props();

	let attrs = $derived(
		useComponentAttrs('kit-card-title', { className, sClass, styleAttr, sStyle, color }, rest)
	);
</script>

<svelte:element this={is} bind:this={ref} class={attrs.class} style={attrs.style} {...attrs.rest}>
	{@render children?.()}
</svelte:element>

<style lang="scss">
	.kit-card-title {
		--kit-card-title-color: initial;

		display: flex;
		align-items: center;
		gap: var(--kit-card-gap);
		color: var(--kit-card-title-color, currentColor);
		font-weight: 600;
		line-height: 1.3;
	}

	.kit-card-title > :global(*) {
		margin: 0;
	}
</style>
