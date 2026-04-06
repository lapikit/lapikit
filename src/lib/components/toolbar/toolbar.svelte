<script lang="ts">
	import { useClassName, useStyles } from '$lib/utils/index';
	import { makeComponentProps } from '$lib/html-mapped';
	import type { ToolbarProps } from './toolbar.types.ts';

	let {
		ref = $bindable(),
		is = 'div',
		children,
		class: className = '',
		style: styleAttr = '',
		's-class': sClass,
		's-style': sStyle,
		classContent,
		variant = 'text',
		rounded,
		background,
		color,
		density = 'default',
		orientation = 'horizontal',
		location,
		...rest
	}: ToolbarProps = $props();

	let safeVariant = $derived(
		typeof variant === 'string' &&
			(variant === 'outline' || variant === 'text' || variant === 'dash')
			? variant
			: 'text'
	);

	let safeDensity = $derived(
		typeof density === 'string' &&
			(density === 'compact' || density === 'comfortable' || density === 'default')
			? density
			: 'default'
	);

	let safeOrientation = $derived(
		typeof orientation === 'string' && (orientation === 'horizontal' || orientation === 'vertical')
			? orientation
			: 'horizontal'
	);

	let safeLocation = $derived(
		typeof location === 'string' && (location === 'top' || location === 'bottom')
			? location
			: undefined
	);

	let { classProps, styleProps, restProps } = $derived(
		makeComponentProps(rest as Record<string, unknown>)
	);

	let componentClass = $derived(
		useClassName({
			baseClass: 'kit-toolbar',
			className: `${className ?? ''}`.trim(),
			sClass,
			classProps
		})
	);

	let normalizedClassContent = $derived(
		Array.isArray(classContent) ? classContent.filter(Boolean).join(' ') : classContent
	);

	let wrapperClass = $derived(
		useClassName({
			baseClass: 'kit-toolbar__wrapper',
			className: normalizedClassContent
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
			background ? `--kit-toolbar-bg:${background}` : '',
			color ? `--kit-toolbar-fg:${color}` : '',
			typeof rounded === 'string' && rounded.includes('px') ? `--kit-toolbar-radius:${rounded}` : ''
		]
			.filter(Boolean)
			.join('; ')
	);
</script>

<svelte:element
	this={is}
	bind:this={ref}
	class={componentClass}
	style={mergedStyle}
	{...restProps}
	role="toolbar"
	data-variant={safeVariant}
	data-density={safeDensity}
	data-orientation={safeOrientation}
	data-location={safeLocation}
	data-rounded={rounded}
>
	{#if safeVariant === 'outline'}
		<span class="outline"></span>
	{/if}

	<div class={wrapperClass}>
		{@render children?.()}
	</div>
</svelte:element>

<style>
	.kit-toolbar {
		--kit-toolbar-bg: var(--kit-surface-2);
		--kit-toolbar-fg: var(--kit-fg);
		--kit-toolbar-bd: color-mix(in oklab, var(--kit-toolbar-fg), transparent 82%);
		--kit-toolbar-radius: 1rem;
		--kit-toolbar-gap: 0.5rem;
		--kit-toolbar-padding-x: 0.75rem;
		--kit-toolbar-padding-y: 0.5rem;
		--kit-toolbar-size: auto;

		position: relative;
		display: inline-flex;
		max-width: 100%;
		box-sizing: border-box;
		border-radius: var(--kit-toolbar-radius);
		background: var(--kit-toolbar-bg);
		color: var(--kit-toolbar-fg);
		border: 1px solid var(--kit-toolbar-bg);
	}

	.kit-toolbar[data-density='compact'] {
		--kit-toolbar-gap: 0.375rem;
		--kit-toolbar-padding-x: 0.625rem;
		--kit-toolbar-padding-y: 0.375rem;
		--kit-toolbar-size: 2.625rem;
	}

	.kit-toolbar[data-density='default'] {
		--kit-toolbar-size: 3rem;
	}

	.kit-toolbar[data-density='comfortable'] {
		--kit-toolbar-gap: 0.625rem;
		--kit-toolbar-padding-x: 0.875rem;
		--kit-toolbar-padding-y: 0.625rem;
		--kit-toolbar-size: 3.5rem;
	}

	.kit-toolbar[data-variant='dash'] {
		border: 1px dashed var(--kit-toolbar-bd);
	}

	.kit-toolbar[data-variant='text'],
	.kit-toolbar[data-variant='outline'],
	.kit-toolbar[data-variant='dash'] {
		--kit-toolbar-bg: transparent;
		--kit-toolbar-fg: var(--kit-accent);
	}

	.kit-toolbar .outline {
		position: absolute;
		inset: 0;
		border: 1px solid var(--kit-toolbar-bd);
		border-radius: inherit;
		pointer-events: none;
	}

	.kit-toolbar__wrapper {
		position: relative;
		z-index: 1;
		display: inline-flex;
		align-items: center;
		justify-content: flex-start;
		gap: var(--kit-toolbar-gap);
		width: 100%;
		padding: var(--kit-toolbar-padding-y) var(--kit-toolbar-padding-x);
		border-radius: inherit;
	}

	.kit-toolbar[data-orientation='horizontal'] {
		width: 100%;
		min-height: var(--kit-toolbar-size);
	}

	.kit-toolbar[data-orientation='vertical'] .kit-toolbar__wrapper {
		flex-direction: column;
		align-items: stretch;
	}

	.kit-toolbar[data-orientation='vertical'] {
		width: fit-content;
		min-height: fit-content;
	}

	.kit-toolbar[data-orientation='horizontal'] .kit-toolbar__wrapper {
		flex-direction: row;
	}

	.kit-toolbar[data-rounded='0'] {
		--kit-toolbar-radius: 0;
	}

	.kit-toolbar[data-rounded='xs'] {
		--kit-toolbar-radius: 2px;
	}

	.kit-toolbar[data-rounded='sm'] {
		--kit-toolbar-radius: 4px;
	}

	.kit-toolbar[data-rounded='md'] {
		--kit-toolbar-radius: 8px;
	}

	.kit-toolbar[data-rounded='lg'] {
		--kit-toolbar-radius: 16px;
	}

	.kit-toolbar[data-rounded='xl'] {
		--kit-toolbar-radius: 99999px;
	}

	.kit-toolbar[data-location='top'] {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1004;
		width: 100%;
		border-radius: 0;
	}

	.kit-toolbar[data-location='bottom'] {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 1004;
		width: 100%;
		border-radius: 0;
	}
</style>
