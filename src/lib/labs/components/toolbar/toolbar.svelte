<script lang="ts">
	import { useClassName, useStyles } from '$lib/labs/utils/index.js';
	import { makeComponentProps } from '$lib/labs/compiler/mapped-code.js';
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
		light = false,
		dark = false,
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
			background ? `--kit-toolbar-background:${background}` : '',
			color ? `--kit-toolbar-color:${color}` : '',
			typeof rounded === 'string' && rounded.includes('px')
				? `--kit-toolbar-radius:${rounded}`
				: ''
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
	data-light={light || undefined}
	data-dark={dark || undefined}
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
		--kit-toolbar-background: var(--kit-surface-2);
		--kit-toolbar-color: var(--kit-fg);
		--kit-toolbar-border: color-mix(in oklab, var(--kit-toolbar-color), transparent 82%);
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
		background: var(--kit-toolbar-background);
		color: var(--kit-toolbar-color);
		border: 1px solid var(--kit-toolbar-background);
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
		border: 1px dashed var(--kit-toolbar-border);
	}

	.kit-toolbar[data-variant='text'],
	.kit-toolbar[data-variant='outline'],
	.kit-toolbar[data-variant='dash'] {
		--kit-toolbar-background: transparent;
		--kit-toolbar-color: var(--kit-accent);
	}

	.kit-toolbar[data-light='true'] {
		--kit-toolbar-background: color-mix(in oklab, white 88%, var(--kit-surface-1));
		--kit-toolbar-color: var(--kit-fg);
	}

	.kit-toolbar[data-dark='true'] {
		--kit-toolbar-background: color-mix(in oklab, black 72%, var(--kit-surface-3));
		--kit-toolbar-color: white;
		--kit-toolbar-border: color-mix(in oklab, white, transparent 72%);
	}

	.kit-toolbar .outline {
		position: absolute;
		inset: 0;
		border: 1px solid var(--kit-toolbar-border);
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
