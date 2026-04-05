<script lang="ts">
	import { useClassName, useStyles } from '$lib/utils';
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
		...rest
	}: CardProps = $props();

	let safeVariant = $derived(
		variant === 'filled' || variant === 'outline' || variant === 'text' ? variant : 'filled'
	);

	let safeDensity = $derived(
		density === 'compact' || density === 'default' || density === 'comfortable'
			? density
			: 'default'
	);

	let safeIs = $derived(
		is === 'div' ||
			is === 'article' ||
			is === 'section' ||
			is === 'aside' ||
			is === 'a' ||
			is === 'button'
			? is
			: 'article'
	);
	let tag = $derived((href && 'a') || safeIs || 'article');
	let hasEventHandler = $derived(
		typeof rest.onclick === 'function' ||
			typeof rest.onpointerdown === 'function' ||
			typeof rest.onkeydown === 'function'
	);
	let isInteractive = $derived(interactive || tag === 'a' || tag === 'button' || hasEventHandler);
	let isDisabled = $derived(!!disabled);
	let resolvedHref = $derived(tag === 'a' && !isDisabled ? href : undefined);
	let resolvedType = $derived(tag === 'button' ? (type ?? 'button') : undefined);
	let resolvedDisabled = $derived(tag === 'button' ? isDisabled : undefined);
	let resolvedTabIndex = $derived(tag === 'a' && isDisabled ? -1 : undefined);

	let { classProps, styleProps, restProps } = $derived(
		makeComponentProps(rest as Record<string, unknown>)
	);

	let componentClass = $derived(
		useClassName({
			baseClass: 'kit-card',
			className: `${className ?? ''} kit-card--${safeVariant}`.trim(),
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
	data-density={safeDensity}
	data-rounded={rounded}
	data-interactive={isInteractive}
	data-active={active}
	data-disabled={isDisabled}
	aria-disabled={isDisabled || undefined}
	use:ripple={{
		component: 'card',
		disabled: noRipple || disabled || !isInteractive
	}}
	{...restProps}
>
	{#if safeVariant === 'outline'}
		<span class="outline"></span>
	{/if}

	{@render children?.()}
</svelte:element>

<style>
	.kit-card {
		--kit-card-bg: var(--kit-surface-2);
		--kit-card-fg: var(--kit-fg);
		--kit-card-bd: var(--kit-border);
		--kit-card-radius: var(--kit-radius-2);
		--kit-card-padding-compact: var(--kit-space-1);
		--kit-card-padding-default: var(--kit-space-2);
		--kit-card-padding-comfortable: var(--kit-space-3);
		--kit-card-hover-bg: color-mix(in oklab, var(--kit-card-bg), var(--kit-card-fg) 6%);
		--kit-card-active-bg: color-mix(in oklab, var(--kit-card-bg), var(--kit-card-fg) 10%);

		display: flex;
		flex-direction: column;
		gap: var(--kit-space-2);
		background: var(--kit-card-bg);
		color: var(--kit-card-fg);
		border: 0;
		border-radius: var(--kit-card-radius);
		box-sizing: border-box;
		position: relative;
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

	.kit-card[data-rounded='0'] {
		--kit-card-radius: 0;
	}
	.kit-card[data-rounded='xs'] {
		--kit-card-radius: 4px;
	}
	.kit-card[data-rounded='sm'] {
		--kit-card-radius: 6px;
	}
	.kit-card[data-rounded='md'] {
		--kit-card-radius: 10px;
	}
	.kit-card[data-rounded='lg'] {
		--kit-card-radius: 14px;
	}
	.kit-card[data-rounded='xl'] {
		--kit-card-radius: 18px;
	}

	.kit-card[data-density='compact'] {
		padding: var(--kit-card-padding-compact);
	}
	.kit-card[data-density='default'] {
		padding: var(--kit-card-padding-default);
	}
	.kit-card[data-density='comfortable'] {
		padding: var(--kit-card-padding-comfortable);
	}

	.kit-card--outline {
		--kit-card-bg: transparent;
		--kit-card-fg: var(--kit-accent);
		--kit-card-bd: var(--kit-accent);
		--kit-card-hover-bg: color-mix(in oklab, var(--kit-card-fg), transparent 80%);
		--kit-card-active-bg: color-mix(in oklab, var(--kit-card-fg), transparent 92%);
	}

	.kit-card--filled {
		--kit-card-bg: var(--kit-accent);
		--kit-card-fg: white;
		--kit-card-hover-bg: color-mix(in oklab, var(--kit-card-bg), black 10%);
		--kit-card-active-bg: color-mix(in oklab, var(--kit-card-bg), black 16%);
	}

	.kit-card--text {
		--kit-card-bg: transparent;
		--kit-card-fg: var(--kit-accent);
		--kit-card-hover-bg: color-mix(in oklab, var(--kit-card-fg), transparent 80%);
		--kit-card-active-bg: color-mix(in oklab, var(--kit-card-fg), transparent 92%);
	}

	.kit-card[data-interactive='true'][data-disabled='false'] {
		cursor: pointer;
	}

	.kit-card[data-interactive='true'][data-disabled='false']:hover {
		translate: 0 -1px;
		background: var(--kit-card-hover-bg);
		box-shadow: 0 10px 28px hsl(220 35% 8% / 0.12);
	}

	.kit-card--text[data-interactive='true'][data-disabled='false']:hover {
		background: var(--kit-card-hover-bg);
	}

	.kit-card[data-interactive='true'][data-active='true'][data-disabled='false'],
	.kit-card[data-interactive='true'][data-disabled='false']:active {
		translate: 0 0;
		background: var(--kit-card-active-bg);
		box-shadow: 0 4px 14px hsl(220 35% 8% / 0.1);
	}

	.kit-card--text[data-interactive='true'][data-active='true'][data-disabled='false'],
	.kit-card--text[data-interactive='true'][data-disabled='false']:active {
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

	.kit-card__media {
		overflow: hidden;
		border-radius: calc(var(--kit-card-radius) - 2px);
	}

	.kit-card__header {
		font-weight: 600;
		line-height: 1.3;
	}

	.kit-card__body {
		display: block;
		line-height: 1.45;
	}

	.kit-card__footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--kit-space-2);
		flex-wrap: wrap;
	}

	.kit-card__footer-content {
		color: var(--kit-muted);
	}

	.kit-card__actions {
		display: inline-flex;
		align-items: center;
		gap: var(--kit-space-1);
	}
</style>
