<script lang="ts">
	import { useComponentAttrs, useElevation, useIsInteractive } from '$lib/utils';
	import { ripple } from '$lib/animations';
	import type { CardProps } from './card.types.ts';

	let {
		ref = $bindable(),
		is = 'div',
		children,
		class: className,
		style: styleAttr,
		's-class': sClass,
		's-style': sStyle,
		href,
		type,
		variant = 'filled',
		density = 'default',
		rounded = 'md',
		interactive,
		active = false,
		disabled = false,
		noRipple,
		color,
		elevation,
		...rest
	}: CardProps = $props();

	let tag = $derived((href && 'a') || is);
	// undefined: detected (a, button, onclick...), true: forced, false: no visual feedback (still clickable)
	let isInteractive = $derived(interactive ?? useIsInteractive(rest, tag, ['a', 'button']));
	let isDisabled = $derived(!!disabled);
	let resolvedHref = $derived(tag === 'a' && !isDisabled ? href : undefined);
	let resolvedType = $derived(tag === 'button' ? (type ?? 'button') : undefined);
	let resolvedDisabled = $derived(tag === 'button' ? isDisabled : undefined);
	let resolvedTabIndex = $derived(tag === 'a' && isDisabled ? -1 : undefined);

	let attrs = $derived(
		useComponentAttrs('kit-card', { className, sClass, styleAttr, sStyle, color, active }, rest)
	);
	let elevationState = $derived(useElevation(elevation));
	// the border is drawn over the content, so the outline and surface variants keep the same box
	let hasOutline = $derived(variant === 'outline' || variant === 'surface');
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
	data-variant={variant}
	data-density={density}
	data-rounded={rounded}
	data-elevation={elevationState.base}
	data-elevation-hover={elevationState.hover}
	data-elevation-active={elevationState.active}
	data-interactive={isInteractive}
	data-active={active}
	data-disabled={isDisabled}
	aria-disabled={isDisabled || undefined}
	use:ripple={{
		component: 'card',
		disabled: noRipple || isDisabled || !isInteractive
	}}
	{...attrs.rest}
>
	{#if hasOutline}
		<span class="outline"></span>
	{/if}

	{@render children?.()}
</svelte:element>

<style lang="scss">
	@use '$lib/styles' as *;

	.kit-card {
		@include color(kit-card, var(--kit-color-surface-1), var(--kit-color-text));

		// modules vars
		--kit-card-gap: calc(var(--kit-space-default) + var(--kit-card-density-offset) / 2);
		--kit-card-padding: calc(10px + var(--kit-card-density-offset) / 2);

		display: flex;
		position: relative;
		flex-direction: column;
		gap: var(--kit-card-gap);
		background-color: var(--kit-card-bg);
		color: var(--kit-card-fg);
		border-radius: var(--kit-card-radius);
		border: 0;
		box-sizing: border-box;
		padding: var(--kit-card-padding);
		@include color-transition((background-color, color, border-color, box-shadow));
	}

	/* native resets: no background here, it would beat the background of .kit-card */
	a.kit-card {
		text-decoration: none;
	}

	button.kit-card {
		appearance: none;
		border: 0;
		font: inherit;
		text-align: inherit;
	}

	/**
	 * variant
	 * @link https://lapikit.dev/docs/components/card#variants
	 */
	.kit-card[data-variant='tonal'] {
		@include color-variant(kit-card, tonal);
	}

	.kit-card[data-variant='text'] {
		@include color-variant(kit-card, text);
	}

	.kit-card[data-variant='plain'] {
		@include color-variant(kit-card, plain);
	}

	.kit-card[data-variant='outline'] {
		@include color-variant(kit-card, outline);
	}

	.kit-card[data-variant='surface'] {
		@include color-variant(kit-card, surface);
	}

	.kit-card .outline {
		--outline-color: var(--kit-card-border);
	}

	.kit-card[data-active='true'] {
		@include color-active(kit-card);
	}

	/**
	 * interactive: hover, pressed, focus-visible and disabled
	 */
	@include interactive(kit-card);

	/**
	 * rounded
	 * @link https://lapikit.dev/docs/customize
	 */
	@include rounded(kit-card, (0, xs, sm, md, lg, xl));

	/**
	 * density
	 * @link https://lapikit.dev/docs/components/card#density
	 */
	@include density(kit-card);
</style>
