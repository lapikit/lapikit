<script lang="ts">
	import { useClassName, useElevation, useStyles } from '$lib/utils/index';
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
		variant = 'filled',
		rounded = 'md',
		size = 'md',
		background,
		color,
		density = 'default',
		orientation = 'horizontal',
		elevation,
		...rest
	}: ToolbarProps = $props();

	let { classProps, styleProps, restProps } = $derived(
		makeComponentProps(rest as Record<string, unknown>)
	);

	let elevationState = $derived(useElevation(elevation));

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

	let resolvedStyle = $derived(
		[
			componentStyle,
			color ? `--kit-toolbar-fg:${color && `var(--kit-color-${color})`}` : '',
			background ? `--kit-toolbar-bg:${background && `var(--kit-color-${background})`}` : ''
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
	{...restProps}
	role="toolbar"
	data-variant={variant}
	data-density={density}
	data-orientation={orientation}
	data-rounded={rounded}
	data-size={size}
	data-elevation={elevationState.base}
	data-elevation-hover={elevationState.hover}
	data-elevation-active={elevationState.active}
>
	{#if variant === 'outline'}
		<span class="outline"></span>
	{/if}

	<div class={wrapperClass}>
		{@render children?.()}
	</div>
</svelte:element>

<style>
	.kit-toolbar {
		position: relative;
		display: inline-flex;
		max-width: 100%;
		box-sizing: border-box;
		border-radius: var(--kit-toolbar-radius);
		background: var(--kit-toolbar-bg);
		color: var(--kit-toolbar-fg);
		border: 0;
		font-size: var(--kit-toolbar-font);
		transition:
			background 140ms ease,
			color 140ms ease,
			box-shadow 140ms ease,
			translate 140ms ease;
	}

	/** 
	 * rounded
	 * @link ...
	 */
	.kit-toolbar[data-rounded='0'] {
		--kit-toolbar-radius: var(--kit-shape-none);
	}
	.kit-toolbar[data-rounded='xs'] {
		--kit-toolbar-radius: var(--kit-shape-xs);
	}
	.kit-toolbar[data-rounded='sm'] {
		--kit-toolbar-radius: var(--kit-shape-sm);
	}
	.kit-toolbar[data-rounded='md'] {
		--kit-toolbar-radius: var(--kit-shape-md);
	}
	.kit-toolbar[data-rounded='lg'] {
		--kit-toolbar-radius: var(--kit-shape-lg);
	}
	.kit-toolbar[data-rounded='xl'] {
		--kit-toolbar-radius: var(--kit-shape-xl);
	}
	.kit-toolbar[data-rounded='full'] {
		--kit-toolbar-radius: var(--kit-shape-full);
	}

	/** 
	 * density
	 * @link no links
	 */
	.kit-toolbar[data-density='compact'] {
		--kit-toolbar-density-offset: var(--kit-density-compact);
	}
	.kit-toolbar[data-density='default'] {
		--kit-toolbar-density-offset: var(--kit-density-default);
	}
	.kit-toolbar[data-density='comfortable'] {
		--kit-toolbar-density-offset: var(--kit-density-comfortable);
	}

	/** 
	 * variant
	 * @link no links...
	 */
	.kit-toolbar[data-variant='filled'] {
		--kit-toolbar-bg: var(--kit-color-surface-1);
		--kit-toolbar-fg: var(--kit-color-text);

		--kit-toolbar-hover-bg: color-mix(in oklab, var(--kit-toolbar-bg), black 10%);
		--kit-toolbar-active-bg: color-mix(in oklab, var(--kit-toolbar-bg), black 16%);
	}
	.kit-toolbar[data-variant='outline'] {
		--kit-toolbar-bg: transparent;
		--kit-toolbar-fg: var(--kit-color-text);
		--kit-toolbar-bd: var(--kit-toolbar-fg);

		--kit-toolbar-hover-bg: color-mix(in oklab, var(--kit-toolbar-fg), transparent 80%);
		--kit-toolbar-active-bg: color-mix(in oklab, var(--kit-toolbar-fg), transparent 92%);
	}
	.kit-toolbar[data-variant='text'] {
		--kit-toolbar-bg: transparent;
		--kit-toolbar-fg: var(--kit-color-text);

		--kit-toolbar-hover-bg: color-mix(in oklab, var(--kit-toolbar-fg), transparent 80%);
		--kit-toolbar-active-bg: color-mix(in oklab, var(--kit-toolbar-fg), transparent 92%);
	}

	/**
	* size
	* @link nothing...
	*/
	.kit-toolbar[data-size='xs'] {
		--kit-toolbar-h: 32px;
		--kit-toolbar-p: 8px;
		--kit-toolbar-gap: var(--kit-space-compact);
		--kit-toolbar-font: var(--kit-font-xs);
	}
	.kit-toolbar[data-size='sm'] {
		--kit-toolbar-h: 40px;
		--kit-toolbar-p: 10px;
		--kit-toolbar-gap: var(--kit-space-default);
		--kit-toolbar-font: var(--kit-font-sm);
	}
	.kit-toolbar[data-size='md'] {
		--kit-toolbar-h: 48px;
		--kit-toolbar-p: 12px;
		--kit-toolbar-gap: var(--kit-space-default);
		--kit-toolbar-font: var(--kit-font-md);
	}
	.kit-toolbar[data-size='lg'] {
		--kit-toolbar-h: 56px;
		--kit-toolbar-p: 16px;
		--kit-toolbar-gap: var(--kit-space-default);
		--kit-toolbar-font: var(--kit-font-lg);
	}
	.kit-toolbar[data-size='xl'] {
		--kit-toolbar-h: 64px;
		--kit-toolbar-p: 20px;
		--kit-toolbar-gap: var(--kit-space-comfortable);
		--kit-toolbar-font: var(--kit-font-xl);
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
		min-height: calc(var(--kit-toolbar-h) + var(--kit-toolbar-density-offset) / 2);
		padding: calc(var(--kit-toolbar-px) + var(--kit-toolbar-density-offset) / 2);
		gap: var(--kit-toolbar-gap);
		width: 100%;
		border-radius: inherit;
	}

	.kit-toolbar[data-orientation='horizontal'] {
		width: 100%;
		min-height: auto;
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
</style>
