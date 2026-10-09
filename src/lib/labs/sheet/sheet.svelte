<script lang="ts">
	/**
	 * Sheet component
	 * @description A simple sheet component for experimentation for developers Lapikit. Please don't use it in production.
	 */

	import { useComponentAttrs, useElevation } from '$lib/utils';

	let {
		class: className,
		style: styleAttr,
		children,
		's-class': sClass,
		's-style': sStyle,
		elevation,
		rounded,
		active,
		...rest
	} = $props();

	let attrs = $derived(
		useComponentAttrs('kit-sheet', { className, sClass, styleAttr, sStyle }, rest)
	);

	let elevationState = $derived(useElevation(elevation));
</script>

<div
	class={attrs.class}
	style={attrs.style}
	data-rounded={rounded}
	data-elevation={elevationState.base}
	data-elevation-hover={elevationState.hover}
	data-elevation-active={elevationState.active}
	data-active={active}
	{...attrs.rest}
>
	{@render children()}
</div>

<style lang="scss">
	@use '$lib/styles' as *;

	.kit-sheet {
		display: flex;
		background-color: var(--kit-color-surface-1);
		color: var(--kit-color-text);
		border-radius: var(--kit-sheet-radius);
	}

	.kit-sheet[data-active='true'] {
		background: var(--kit-color-accent);
		color: var(--kit-on-accent);
	}

	/** 
	 * rounded
	 * @link https://lapikit.dev/docs/customize
	 */
	@include rounded(kit-sheet, (none, xs, sm, md, lg, xl, full));
</style>
