<script lang="ts">
	import { useClassName, useElevation, useIsInteractive, useStyles } from '$lib/utils';
	import { makeComponentProps } from '$lib/html-mapped';
	import { ripple } from '$lib/animations';
	import type { CardProps } from './card.types.ts';

	let {
		ref = $bindable(),
		is = 'div',
		children,
		class: className = '',
		style: styleAttr = '',
		's-class': sClass,
		's-style': sStyle,
		href,
		type,
		variant = 'filled',
		density = 'default',
		rounded = 'md',
		interactive = false,
		active = false,
		disabled = false,
		noRipple,
		color,
		background,
		elevation,
		...rest
	}: CardProps = $props();

	let tag = $derived((href && 'a') || is);
	let isInteractive = $derived(useIsInteractive(rest, tag, ['a', 'button'], interactive));
	let isDisabled = $derived(!!disabled);
	let resolvedHref = $derived(tag === 'a' && !isDisabled ? href : undefined);
	let resolvedType = $derived(tag === 'button' ? (type ?? 'button') : undefined);
	let resolvedDisabled = $derived(tag === 'button' ? isDisabled : undefined);
	let resolvedTabIndex = $derived(tag === 'a' && isDisabled ? -1 : undefined);

	let { classProps, styleProps, restProps } = $derived(makeComponentProps(rest));

	let elevationState = $derived(useElevation(elevation));

	let componentClass = $derived(
		useClassName({
			baseClass: 'kit-card',
			className: `${className ?? ''}`.trim(),
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

<svelte:element
	this={tag}
	bind:this={ref}
	class={componentClass}
	style={componentStyle}
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
		disabled: noRipple || disabled || !isInteractive
	}}
	style:--kit-card-fg={color && `var(--kit-color-${color})`}
	style:--kit-card-bg={background && `var(--kit-color-${background})`}
	{...restProps}
>
	{#if variant === 'outline'}
		<span class="outline"></span>
	{/if}

	{@render children?.()}
</svelte:element>

<style>
	.kit-card {
		display: flex;
		position: relative;
		flex-direction: column;
		gap: var(--kit-card-gap);
		background: var(--kit-card-bg);
		color: var(--kit-card-fg);
		border-radius: var(--kit-card-radius);
		border: 0;
		box-sizing: border-box;
		transition:
			background 140ms ease,
			color 140ms ease,
			box-shadow 140ms ease,
			translate 140ms ease;
	}

	a.kit-card {
		text-decoration: none;
	}

	button.kit-card {
		appearance: none;
		border: 0;
		background: none;
		font: inherit;
		text-align: inherit;
	}

	/** 
	 * rounded
	 * @link ...
	 */
	.kit-card[data-rounded='0'] {
		--kit-card-radius: var(--kit-shape-none);
	}
	.kit-card[data-rounded='xs'] {
		--kit-card-radius: var(--kit-shape-xs);
	}
	.kit-card[data-rounded='sm'] {
		--kit-card-radius: var(--kit-shape-sm);
	}
	.kit-card[data-rounded='md'] {
		--kit-card-radius: var(--kit-shape-md);
	}
	.kit-card[data-rounded='lg'] {
		--kit-card-radius: var(--kit-shape-lg);
	}
	.kit-card[data-rounded='xl'] {
		--kit-card-radius: var(--kit-shape-xl);
	}

	/** 
	 * density
	 * @link https://lapikit.dev/docs/components/card#density 
	 */
	.kit-card[data-density='none'] {
		padding: 0;
	}
	.kit-card[data-density='compact'] {
		--kit-card-gap: var(--kit-space-compact);
		padding: var(--kit-space-compact);
	}
	.kit-card[data-density='default'] {
		--kit-card-gap: var(--kit-space-default);
		padding: var(--kit-space-default);
	}
	.kit-card[data-density='comfortable'] {
		--kit-card-gap: var(--kit-space-comfortable);
		padding: var(--kit-space-comfortable);
	}

	/** 
	 * variant
	 * @link https://lapikit.dev/docs/components/card#variants
	 */
	.kit-card[data-variant='filled'] {
		--kit-card-bg: var(--kit-color-surface-1);
		--kit-card-fg: var(--kit-color-text);

		--kit-card-hover-bg: color-mix(in oklab, var(--kit-card-bg), black 10%);
		--kit-card-active-bg: color-mix(in oklab, var(--kit-card-bg), black 16%);
	}
	.kit-card[data-variant='outline'] {
		--kit-card-bg: transparent;
		--kit-card-fg: var(--kit-color-text);
		--kit-card-bd: var(--kit-card-fg);

		--kit-card-hover-bg: color-mix(in oklab, var(--kit-card-fg), transparent 80%);
		--kit-card-active-bg: color-mix(in oklab, var(--kit-card-fg), transparent 92%);
	}
	.kit-card[data-variant='text'] {
		--kit-card-bg: transparent;
		--kit-card-fg: var(--kit-color-text);

		--kit-card-hover-bg: color-mix(in oklab, var(--kit-card-fg), transparent 80%);
		--kit-card-active-bg: color-mix(in oklab, var(--kit-card-fg), transparent 92%);
	}

	.kit-card[data-interactive='true'][data-disabled='false'] {
		cursor: pointer;
	}

	.kit-card[data-interactive='true'][data-disabled='false']:hover {
		translate: 0 -1px;
		background: var(--kit-card-hover-bg);
		/* box-shadow: 0 10px 28px hsl(220 35% 8% / 0.12); */
	}

	.kit-card[data-variant='text'][data-interactive='true'][data-disabled='false']:hover {
		background: var(--kit-card-hover-bg);
	}

	.kit-card[data-interactive='true'][data-active='true'][data-disabled='false'],
	.kit-card[data-interactive='true'][data-disabled='false']:active {
		translate: 0 0;
		background: var(--kit-card-active-bg);
		/* box-shadow: 0 4px 14px hsl(220 35% 8% / 0.1); */
	}

	.kit-card[data-variant='text'][data-interactive='true'][data-active='true'][data-disabled='false'],
	.kit-card[data-variant='text'][data-interactive='true'][data-disabled='false']:active {
		background: var(--kit-card-active-bg);
	}

	.kit-card[data-interactive='true'][data-disabled='false']:focus-visible {
		outline: 2px solid var(--kit-focus);
		outline-offset: 2px;
	}

	.kit-card[data-disabled='true'] {
		opacity: var(--kit-disabled-opacity, 0.55);
		pointer-events: none;
	}

	.kit-card .outline {
		--outline-color: var(--kit-card-bd);
	}
</style>
