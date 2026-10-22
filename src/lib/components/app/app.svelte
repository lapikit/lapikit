<script lang="ts">
	import { useComponentAttrs } from '$lib/utils';
	import type { AppProps } from './app.types';

	let {
		ref = $bindable(),
		children,
		class: className,
		style: styleAttr,
		's-class': sClass,
		's-style': sStyle,
		...rest
	}: AppProps = $props();

	let attrs = $derived(
		useComponentAttrs('kit-application', { className, sClass, styleAttr, sStyle }, rest)
	);
</script>

<div id="kit-app" bind:this={ref} class={attrs.class} style={attrs.style} {...attrs.rest}>
	{@render children?.()}
</div>

<style lang="scss">
	@use './app';
</style>
