<script lang="ts">
	import { useComponentAttrs } from '$lib/utils';
	import type { SpacerProps } from './spacer.types.ts';

	let {
		is = 'div',
		class: className,
		style: styleAttr,
		's-class': sClass,
		's-style': sStyle,
		...rest
	}: SpacerProps = $props();

	let attrs = $derived(
		useComponentAttrs('kit-spacer', { className, sClass, styleAttr, sStyle }, rest)
	);
</script>

<svelte:element this={is} class={attrs.class} style={attrs.style} {...attrs.rest}></svelte:element>

<style>
	.kit-spacer {
		flex-grow: 1;
	}
</style>
