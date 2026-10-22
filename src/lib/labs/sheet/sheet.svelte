<script lang="ts">
	/**
	 * Sheet component
	 * @description A simple sheet component for experimentation for developers Lapikit. Please don't use it in production.
	 */
	import { useComponentAttrs, useElevation, useIsInteractive } from '$lib/utils';
	import { ripple } from '$lib/animations';
	import type { SheetProps } from './sheet.types.ts';

	let {
		ref = $bindable(),
		is = 'div',
		href,
		type,
		class: className,
		style: styleAttr,
		children,
		's-class': sClass,
		's-style': sStyle,
		elevation,
		rounded,
		density = 'default',
		variant = 'filled',
		active,
		color,
		interactive,
		disabled = false,
		noRipple,
		...rest
	}: SheetProps = $props();

	// states
	let attrs = $derived(
		useComponentAttrs('kit-sheet', { className, sClass, styleAttr, sStyle, color, active }, rest)
	);
	let elevationState = $derived(useElevation(elevation));
	let tag = $derived((href && 'a') || is);
	// undefined: detected (a, button, onclick...), true: forced, false: no visual feedback (still clickable)
	let isInteractive = $derived(interactive ?? useIsInteractive(rest, tag, ['a', 'button']));
	let isDisabled = $derived(!!disabled);
	let resolvedHref = $derived(tag === 'a' && !isDisabled ? href : undefined);
	let resolvedType = $derived(tag === 'button' ? (type ?? 'button') : undefined);
	let resolvedDisabled = $derived(tag === 'button' ? isDisabled : undefined);
	let resolvedTabIndex = $derived(tag === 'a' && isDisabled ? -1 : undefined);
</script>

<svelte:element
	this={tag}
	bind:this={ref}
	class={attrs.class}
	style={attrs.style}
	href={resolvedHref}
	type={resolvedType}
	disabled={resolvedDisabled}
	tabindex={resolvedTabIndex}
	data-rounded={rounded}
	data-density={density}
	data-variant={variant}
	data-elevation={elevationState.base}
	data-elevation-hover={elevationState.hover}
	data-elevation-active={elevationState.active}
	data-active={active}
	data-interactive={isInteractive}
	data-disabled={isDisabled}
	aria-disabled={isDisabled || undefined}
	use:ripple={{
		component: 'sheet',
		disabled: noRipple || isDisabled || !isInteractive
	}}
	{...attrs.rest}
>
	{@render children?.()}
</svelte:element>

<style lang="scss">
	@use '$lib/styles' as *;

	.kit-sheet {
		@include color(kit-sheet, var(--kit-color-surface-1), var(--kit-color-text));

		--kit-sheet-p: 12px;

		display: flex;
		position: relative;
		gap: calc(var(--kit-space-default) + var(--kit-sheet-density-offset) / 2);
		padding: calc(var(--kit-sheet-p) + var(--kit-sheet-density-offset) / 2);
		background-color: var(--kit-sheet-bg);
		color: var(--kit-sheet-fg);
		border-radius: var(--kit-sheet-radius);
		@include color-transition((background-color, color, border-color, box-shadow));
	}

	/* native resets: no background here, it would beat the background of .kit-sheet */
	a.kit-sheet {
		text-decoration: none;
	}

	button.kit-sheet {
		appearance: none;
		border: 0;
		padding: 0;
		font: inherit;
		text-align: inherit;
	}

	.kit-sheet[data-variant='tonal'] {
		@include color-variant(kit-sheet, tonal);
	}

	.kit-sheet[data-variant='text'] {
		@include color-variant(kit-sheet, text);
	}

	.kit-sheet[data-variant='plain'] {
		@include color-variant(kit-sheet, plain);
	}

	.kit-sheet[data-variant='outline'] {
		@include color-variant(kit-sheet, outline);
		border: var(--kit-outline-weight) solid var(--kit-sheet-border);
	}

	.kit-sheet[data-variant='surface'] {
		@include color-variant(kit-sheet, surface);
		border: var(--kit-outline-weight) solid var(--kit-sheet-border);
	}

	.kit-sheet[data-active='true'] {
		@include color-active(kit-sheet);
	}

	/**
	 * interactive: hover, pressed, focus-visible and disabled
	 */
	@include interactive(kit-sheet);

	/** 
	 * rounded
	 * @link https://lapikit.dev/docs/customize
	 */
	@include rounded(kit-sheet, (0, xs, sm, md, lg, xl, full));

	/**
	 * density
	 * @link https://lapikit.dev/docs/customize
	 */
	@include density(kit-sheet);
</style>
