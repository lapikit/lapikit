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
		variant = 'filled',
		active,
		color,
		...rest
	} = $props();

	// states
	let attrs = $derived(
		useComponentAttrs('kit-sheet', { className, sClass, styleAttr, sStyle, color }, rest)
	);
	let elevationState = $derived(useElevation(elevation));
</script>

<div
	class={attrs.class}
	style={attrs.style}
	data-rounded={rounded}
	data-variant={variant}
	data-elevation={elevationState.base}
	data-elevation-hover={elevationState.hover}
	data-elevation-active={elevationState.active}
	data-active={active}
	{...attrs.rest}
>
	{@render children?.()}
</div>

<style lang="scss">
	@use '$lib/styles' as *;

	.kit-sheet {
		@include color(kit-sheet, var(--kit-color-surface-1), var(--kit-color-text));

		display: flex;
		background-color: var(--kit-sheet-bg);
		color: var(--kit-sheet-fg);
		border-radius: var(--kit-sheet-radius);
	}

	.kit-sheet[data-variant='tonal'] {
		@include color-variant(kit-sheet, tonal);
	}

	.kit-sheet[data-variant='outline'] {
		@include color-variant(kit-sheet, outline);
		border: 1px solid var(--kit-sheet-border);
	}

	.kit-sheet[data-active='true'] {
		@include color-active(kit-sheet);
	}

	/** 
	 * rounded
	 * @link https://lapikit.dev/docs/customize
	 */
	@include rounded(kit-sheet, (none, xs, sm, md, lg, xl, full));
</style>
