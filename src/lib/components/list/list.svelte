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

	let mergedStyle = $derived([componentStyle].filter(Boolean).join('; '));
</script>

<svelte:element
	this={is}
	bind:this={ref}
	class={componentClass}
	style={mergedStyle}
	data-size={size}
	data-variant={variant}
	data-density={density}
	data-rounded={rounded}
	data-nav={nav}
	role={nav ? 'navigation' : is === 'ul' ? undefined : 'list'}
	style:--kit-list-item-fg={color && `var(--kit-color-${color})`}
	style:--kit-list-item-bg={background && `var(--kit-color-${background})`}
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
	.kit-list[data-density='none'] {
		--kit-list-density-scale: 0;
		--kit-list-density-h-scale: 0;
	}
	.kit-list[data-density='compact'] {
		--kit-list-density-scale: 0.9;
		--kit-list-density-h-scale: 0.92;
	}
	.kit-list[data-density='default'] {
		--kit-list-density-scale: 1;
		--kit-list-density-h-scale: 1;
	}
	.kit-list[data-density='comfortable'] {
		--kit-list-density-scale: 1.1;
		--kit-list-density-h-scale: 1.15;
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
		--kit-list-item-bg: var(--kit-surface-3);
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
		padding: 0.5rem;
	}

	/**
	* size
	* @link nothing...
	*/
	.kit-list[data-size='xs'] :global(.kit-list-item) {
		--kit-list-item-h: 28px;
		--kit-list-item-px: 10px;
		--kit-list-item-gap: 4px;
		--kit-list-item-font: 0.75rem;
	}
	.kit-list[data-size='sm'] :global(.kit-list-item) {
		--kit-list-item-h: 32px;
		--kit-list-item-px: 12px;
		--kit-list-item-gap: 6px;
		--kit-list-item-font: 0.875rem;
	}
	.kit-list[data-size='md'] :global(.kit-list-item) {
		--kit-list-item-h: 40px;
		--kit-list-item-px: 16px;
		--kit-list-item-gap: 8px;
		--kit-list-item-font: 1rem;
	}
	.kit-list[data-size='lg'] :global(.kit-list-item) {
		--kit-list-item-h: 48px;
		--kit-list-item-px: 20px;
		--kit-list-item-gap: 10px;
		--kit-list-item-font: 1.125rem;
	}
	.kit-list[data-size='xl'] :global(.kit-list-item) {
		--kit-list-item-h: 56px;
		--kit-list-item-px: 24px;
		--kit-list-item-gap: 12px;
		--kit-list-item-font: 1.25rem;
	}
</style>
