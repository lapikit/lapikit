<script lang="ts">
	/**
	 * Sheet component
	 * @description A simple sheet component for experimentation for developers Lapikit. Please don't use it in production.
	 */

	import { resolveColor, resolveOnColor, useComponentAttrs, useElevation } from '$lib/utils';

	let {
		class: className,
		style: styleAttr,
		children,
		's-class': sClass,
		's-style': sStyle,
		elevation,
		rounded,
		active,
		color: colorProp,
		...rest
	} = $props();

	// states
	let attrs = $derived(
		useComponentAttrs('kit-sheet', { className, sClass, styleAttr, sStyle }, rest)
	);
	let color = $derived(colorProp);
	let elevationState = $derived(useElevation(elevation));
	let colorValue = $derived(resolveColor(color));
	let onColorValue = $derived(resolveOnColor(color));

	let resolvedStyle = $derived(
		[
			attrs.style,
			colorValue && `--kit-sheet-color: ${colorValue}`,
			onColorValue && `--kit-sheet-on-color: ${onColorValue}`
		]
			.filter(Boolean)
			.join('; ')
	);
</script>

<div
	class={attrs.class}
	style={resolvedStyle}
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
		--kit-sheet-color: var(--kit-sheet-color, var(--kit-color-surface-1));
		--kit-sheet-on-color: var(--kit-sheet-on-color, var(--kit-color-text));

		display: flex;
		background-color: var(--kit-sheet-color);
		color: var(--kit-sheet-on-color);
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
