<script lang="ts">
	import { useClassName, useStyles } from '$lib/utils';
	import { makeComponentProps } from '$lib/html-mapped';
	import type { SeparatorProps } from './separator.types.ts';

	let {
		ref = $bindable(),
		is = 'hr',
		inset = false,
		thickness = 'thin',
		orientation = 'horizontal',
		color,
		class: className = '',
		style: styleAttr = '',
		's-class': sClass,
		's-style': sStyle,
		...rest
	}: SeparatorProps = $props();

	let { classProps, styleProps, restProps } = $derived(
		makeComponentProps(rest as Record<string, unknown>)
	);

	let componentClass = $derived(
		useClassName({
			baseClass: 'kit-separator',
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

	const formatThickness = (value?: number | string) =>
		typeof thickness === 'number' ? `${value}px` : value;

	let mergedStyle = $derived([componentStyle].filter(Boolean).join('; '));
</script>

<svelte:element
	this={is}
	bind:this={ref}
	{...restProps}
	class={componentClass}
	style={mergedStyle}
	role="separator"
	aria-orientation={orientation || 'horizontal'}
	data-inset={inset || undefined}
	data-orientation={orientation}
	style:--kit-separator-color={color && `var(--kit-color-${color})`}
	style:--kit-separator-top-width={orientation === 'horizontal' ? formatThickness(thickness) : ''}
	style:--kit-separator-right-width={orientation === 'vertical' ? formatThickness(thickness) : ''}
/>

<style>
	.kit-separator {
		--kit-separator-color: var(--kit-color-border);
		--kit-separator-vertical-min-size: 1.5rem;

		display: block;
		flex: 1 1 100%;
		height: 0;
		max-height: 0;
		border-color: var(--kit-separator-color);
		border-style: solid;
		transition: inherit;
	}

	.kit-separator[data-inset]:not([data-orientation='vertical']) {
		max-width: calc(100% - 4.5rem);
		margin-inline-start: 4.5rem;
	}

	.kit-separator[data-inset][data-orientation='vertical'] {
		margin-block: 0.5rem;
		max-height: calc(100% - 1rem);
	}

	.kit-separator:not([data-orientation='vertical']) {
		width: 100%;
		border-width: var(--kit-separator-top-width) 0 0 0;
	}

	.kit-separator[data-orientation='vertical'] {
		align-self: stretch;
		display: inline-flex;
		width: 0;
		height: auto;
		min-height: var(--kit-separator-vertical-min-size);
		max-width: 0;
		max-height: none;
		vertical-align: text-bottom;
		border-width: 0 var(--kit-separator-right-width) 0 0;
	}
</style>
