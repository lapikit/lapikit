<script lang="ts">
	import type { CardActionsProps } from '../card.types';
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
	}: CardActionsProps = $props();

	let attrs = $derived(
		useComponentAttrs('kit-card-actions', { className, sClass, styleAttr, sStyle }, rest)
	);
</script>

<svelte:element this={is} bind:this={ref} class={attrs.class} style={attrs.style} {...attrs.rest}>
	{@render children?.()}
</svelte:element>

<style lang="scss">
	.kit-card-actions {
		display: inline-flex;
		align-items: center;
		gap: var(--kit-card-gap);
	}
</style>
