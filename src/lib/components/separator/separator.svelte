<script lang="ts">
	import { useClassName, useStyles } from '$lib/utils';
	import { makeComponentProps } from '$lib/html-mapped';
	import type { SeparatorProps } from './separator.types.ts';

	let {
		ref = $bindable(),
		is = 'hr',
		inset = false,
		thickness,
		orientation = 'horizontal',
		opacity,
		color,
		class: className = '',
		style: styleAttr = '',
		's-class': sClass,
		's-style': sStyle,
		...rest
	}: SeparatorProps = $props();

	let safeOrientation = $derived(
		typeof orientation === 'string' && (orientation === 'horizontal' || orientation === 'vertical')
			? orientation
			: 'horizontal'
	);

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

	let mergedStyle = $derived(
		[
			componentStyle,
			color ? `--kit-separator-color:${color}` : '',
			opacity !== undefined ? `--kit-separator-opacity:${opacity}` : '',
			thickness !== undefined && safeOrientation === 'horizontal'
				? `--kit-separator-top-width:${typeof thickness === 'number' ? `${thickness}px` : thickness}`
				: '',
			thickness !== undefined && safeOrientation === 'vertical'
				? `--kit-separator-right-width:${typeof thickness === 'number' ? `${thickness}px` : thickness}`
				: ''
		]
			.filter(Boolean)
			.join('; ')
	);
</script>

<svelte:element
	this={is}
	bind:this={ref}
	{...restProps}
	class={componentClass}
	style={mergedStyle}
	role="separator"
	aria-orientation={safeOrientation}
	data-inset={inset || undefined}
	data-orientation={safeOrientation}
/>

<style>
	.kit-separator {
		--kit-separator-color: var(--kit-fg);
		--kit-separator-opacity: 0.12;
		--kit-separator-top-width: thin;
		--kit-separator-right-width: thin;
		--kit-separator-vertical-min-size: 1.5rem;

		display: block;
		flex: 1 1 100%;
		height: 0;
		max-height: 0;
		opacity: var(--kit-separator-opacity);
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
