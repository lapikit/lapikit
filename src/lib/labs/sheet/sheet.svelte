<script lang="ts">
	/**
	 * Sheet component
	 * @description A simple sheet component for experimentation for developers Lapikit. Please don't use it in production.
	 */

	import { useClassName, useElevation, useStyles } from '$lib/utils';
	import { makeComponentProps } from '$lib/html-mapped';

	let {
		class: className,
		style: styleAttr,
		children,
		's-class': sClass,
		's-style': sStyle,
		elevation,
		...rest
	} = $props();

	let { classProps, styleProps, restProps } = $derived(
		makeComponentProps(rest as Record<string, unknown>)
	);

	let elevationState = $derived(useElevation(elevation));

	let componentClass = $derived(
		useClassName({
			baseClass: 'kit-sheet',
			className,
			sClass,
			classProps
		})
	);

	let componentStyle = $derived(
		useStyles({
			styleAttr,
			sStyle,
			styleProps
		})
	);
</script>

<div
	class={componentClass}
	style={componentStyle}
	data-elevation={elevationState.base}
	data-elevation-hover={elevationState.hover}
	data-elevation-active={elevationState.active}
	{...restProps}
>
	{@render children()}
</div>

<style lang="scss">
	@use '$lib/styles' as *;

	.kit-sheet {
		background-color: var(--kit-color-surface-1);
		color: var(--kit-color-text);
		border-radius: var(--kit-sheet-radius);
	}

	/** 
	 * rounded
	 * @link https://lapikit.dev/docs/customize
	 */
	@include rounded(kit-sheet, (none, xs, sm, md, lg, xl, full));
</style>
