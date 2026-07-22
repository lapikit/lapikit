<script lang="ts">
	import { makeComponentProps } from '$lib/html-mapped';
	import { useClassName, useStyles } from '$lib/utils';
	import type { ListProps } from './list.types.ts';

	let {
		ref = $bindable(),
		is = 'div',
		children = undefined,
		class: className = '',
		style: styleAttr = '',
		's-class': sClass,
		's-style': sStyle,
		size = 'md',
		variant = 'filled',
		density = 'default',
		rounded = 'md',
		nav = false,
		color,
		background,
		...rest
	}: ListProps = $props();

	let { classProps, styleProps, restProps } = $derived(
		makeComponentProps(rest as Record<string, unknown>)
	);

	let componentClass = $derived(
		useClassName({
			baseClass: 'kit-list',
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

	let resolvedStyle = $derived(
		[
			componentStyle,
			color ? `--kit-list-item-fg:${color && `var(--kit-color-${color})`}` : '',
			background ? `--kit-list-item-bg:${background && `var(--kit-color-${background})`}` : ''
		]
			.filter(Boolean)
			.join('; ')
	);
</script>

<svelte:element
	this={is}
	bind:this={ref}
	class={componentClass}
	style={resolvedStyle}
	data-size={size}
	data-variant={variant}
	data-density={density}
	data-rounded={rounded}
	data-nav={nav}
	role={nav ? 'navigation' : is === 'ul' ? undefined : 'list'}
	{...restProps}
>
	{@render children?.()}
</svelte:element>

<style>
	.kit-list {
		width: 100%;
		display: flex;
		position: relative;
		flex-direction: column;
		gap: 0;
		border: 0;
		box-sizing: border-box;
		transition:
			background 140ms ease,
			color 140ms ease,
			box-shadow 140ms ease,
			translate 140ms ease;
	}

	.kit-list[data-variant='text']
		:global(.kit-list-item[data-interactive='true'][data-active='true'][data-disabled='false']),
	.kit-list[data-variant='text']
		:global(.kit-list-item[data-interactive='true'][data-disabled='false']:active) {
		background: var(--kit-list-item-active-bg);
	}

	/** 
	 * density
	 * @link https://lapikit.dev/docs/components/list#density 
	 */
	.kit-list[data-density='compact'] {
		--kit-list-density-offset: var(--kit-space-compact);
	}
	.kit-list[data-density='default'] {
		--kit-list-density-offset: var(--kit-space-default);
	}
	.kit-list[data-density='comfortable'] {
		--kit-list-density-offset: var(--kit-space-comfortable);
	}

	/** 
	 * rounded
	 * @link ...
	 */
	.kit-list[data-rounded='0'] :global(.kit-list-item) {
		--kit-list-item-radius: var(--kit-shape-none);
	}
	.kit-list[data-rounded='xs'] :global(.kit-list-item) {
		--kit-list-item-radius: var(--kit-shape-xs);
	}
	.kit-list[data-rounded='sm'] :global(.kit-list-item) {
		--kit-list-item-radius: var(--kit-shape-sm);
	}
	.kit-list[data-rounded='md'] :global(.kit-list-item) {
		--kit-list-item-radius: var(--kit-shape-md);
	}
	.kit-list[data-rounded='lg'] :global(.kit-list-item) {
		--kit-list-item-radius: var(--kit-shape-lg);
	}
	.kit-list[data-rounded='xl'] :global(.kit-list-item) {
		--kit-list-item-radius: var(--kit-shape-xl);
	}
	.kit-list[data-rounded='full'] :global(.kit-list-item) {
		--kit-list-item-radius: var(--kit-shape-full);
	}

	/** 
	 * variant
	 * @link https://lapikit.dev/docs/components/list#variants
	 */
	.kit-list[data-variant='filled'] :global(.kit-list-item) {
		--kit-list-item-bg: var(--kit-color-surface-2);
		--kit-list-item-fg: var(--kit-color-text);

		--kit-list-item-hover-bg: color-mix(in oklab, var(---kit-list-item-bg), black 10%);
		--kit-list-item-active-bg: color-mix(in oklab, var(--kit-list-item-bg), black 16%);
	}
	.kit-list[data-variant='outline'] :global(.kit-list-item) {
		--kit-list-item-bg: transparent;
		--kit-list-item-fg: var(--kit-color-text);
		--kit-list-item-bd: var(--kit-list-item-fg);

		--kit-list-item-hover-bg: color-mix(in oklab, var(--kit-list-item-fg), transparent 80%);
		--kit-list-item-active-bg: color-mix(in oklab, var(--kit-list-item-fg), transparent 92%);
	}
	.kit-list[data-variant='text'] :global(.kit-list-item) {
		--kit-list-item-bg: transparent;
		--kit-list-item-fg: var(--kit-color-text);

		--kit-list-item-hover-bg: color-mix(in oklab, var(--kit-list-item-fg), transparent 80%);
		--kit-list-item-active-bg: color-mix(in oklab, var(--kit-list-item-fg), transparent 92%);
	}
	.kit-list[data-variant='text'] :global(.kit-list-item .outline),
	.kit-list[data-variant='filled'] :global(.kit-list-item .outline) {
		display: none;
	}

	/** 
	 * nav
	 * @link https://lapikit.dev/docs/components/list#nav 
	 */
	.kit-list[data-nav='true'] {
		padding: calc(var(--kit-space-default) + var(--kit-list-density-offset) / 2);
	}
	.kit-list[data-nav='true'] :global(.kit-list-item) {
		border-radius: var(--kit-list-item-radius);
	}
	.kit-list:not([data-nav='true']) :global(.kit-list-item:first-child) {
		border-top-left-radius: var(--kit-list-item-radius);
		border-top-right-radius: var(--kit-list-item-radius);
	}
	.kit-list:not([data-nav='true']) :global(.kit-list-item:last-child) {
		border-bottom-left-radius: var(--kit-list-item-radius);
		border-bottom-right-radius: var(--kit-list-item-radius);
	}
	.kit-list:not([data-nav='true']) :global(.kit-list-item:not(:first-child):not(:last-child)) {
		--kit-list-item-radius: 0;
	}

	/**
	* size
	* @link nothing...
	*/
	.kit-list[data-size='xs'] :global(.kit-list-item) {
		--kit-list-item-h: 28px;
		--kit-list-item-p: 12px;
		--kit-list-item-gap: var(--kit-space-compact);
		--kit-list-item-font: var(--kit-font-xs);
	}
	.kit-list[data-size='sm'] :global(.kit-list-item) {
		--kit-list-item-h: 36px;
		--kit-list-item-p: 14px;
		--kit-list-item-gap: var(--kit-space-default);
		--kit-list-item-font: var(--kit-font-sm);
	}
	.kit-list[data-size='md'] :global(.kit-list-item) {
		--kit-list-item-h: 44px;
		--kit-list-item-p: 16px;
		--kit-list-item-gap: var(--kit-space-default);
		--kit-list-item-font: var(--kit-font-md);
	}
	.kit-list[data-size='lg'] :global(.kit-list-item) {
		--kit-list-item-h: 52px;
		--kit-list-item-p: 20px;
		--kit-list-item-gap: var(--kit-space-default);
		--kit-list-item-font: var(--kit-font-lg);
	}
	.kit-list[data-size='xl'] :global(.kit-list-item) {
		--kit-list-item-h: 60px;
		--kit-list-item-p: 24px;
		--kit-list-item-gap: var(--kit-space-comfortable);
		--kit-list-item-font: var(--kit-font-xl);
	}
</style>
