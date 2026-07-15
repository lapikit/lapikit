<script lang="ts">
	import { useClassName, useElevation, useStyles } from '$lib/utils';
	import { makeComponentProps } from '$lib/html-mapped';
	import type { AppbarProps } from './appbar.types.ts';

	let {
		ref = $bindable(),
		is = 'header',
		children,
		class: className = '',
		style: styleAttr = '',
		's-class': sClass,
		's-style': sStyle,
		classContent,
		size = 'md',
		variant = 'filled',
		rounded = 0,
		background,
		color,
		density = 'default',
		elevation,
		...rest
	}: AppbarProps = $props();

	let { classProps, styleProps, restProps } = $derived(
		makeComponentProps(rest as Record<string, unknown>)
	);

	let elevationState = $derived(useElevation(elevation));

	let componentClass = $derived(
		useClassName({
			baseClass: 'kit-appbar',
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
			baseClass: 'kit-appbar__wrapper',
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
			color ? `--kit-appbar-fg:${color && `var(--kit-color-${color})`}` : '',
			background ? `--kit-appbar-bg:${background && `var(--kit-color-${background})`}` : ''
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
	data-elevation={elevationState.base}
	data-elevation-hover={elevationState.hover}
	data-elevation-active={elevationState.active}
	{...restProps}
>
	{#if variant === 'outline'}
		<span class="outline"></span>
	{/if}

	<div class={wrapperClass}>
		{@render children?.()}
	</div>
</svelte:element>

<style>
	.kit-appbar {
		display: flex;
		align-items: center;
		box-sizing: border-box;
		position: relative;
		width: 100%;
		gap: var(--kit-appbar-gap);
		min-height: calc(var(--kit-appbar-h) * var(--kit-appbar-density-h-scale));
		padding: calc(var(--kit-appbar-px) * var(--kit-appbar-density-scale));
		border-radius: var(--kit-appbar-radius);
		color: var(--kit-appbar-fg);
		background-color: var(--kit-appbar-bg);
		overflow: hidden;
		font-size: var(--kit-appbar-font);
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
	.kit-appbar[data-rounded='0'] {
		--kit-appbar-radius: var(--kit-shape-none);
	}
	.kit-appbar[data-rounded='xs'] {
		--kit-appbar-radius: var(--kit-shape-xs);
	}
	.kit-appbar[data-rounded='sm'] {
		--kit-appbar-radius: var(--kit-shape-sm);
	}
	.kit-appbar[data-rounded='md'] {
		--kit-appbar-radius: var(--kit-shape-md);
	}
	.kit-appbar[data-rounded='lg'] {
		--kit-appbar-radius: var(--kit-shape-lg);
	}
	.kit-appbar[data-rounded='xl'] {
		--kit-appbar-radius: var(--kit-shape-xl);
	}
	.kit-appbar[data-rounded='full'] {
		--kit-appbar-radius: var(--kit-shape-full);
	}

	/** 
	 * density
	 * @link no links
	 */
	.kit-appbar[data-density='none'] {
		--kit-appbar-density-scale: 0;
		--kit-appbar-density-h-scale: 0;
	}
	.kit-appbar[data-density='compact'] {
		--kit-appbar-density-scale: 0.9;
		--kit-appbar-density-h-scale: 0.92;
	}
	.kit-appbar[data-density='default'] {
		--kit-appbar-density-scale: 1;
		--kit-appbar-density-h-scale: 1;
	}
	.kit-appbar[data-density='comfortable'] {
		--kit-appbar-density-scale: 1.1;
		--kit-appbar-density-h-scale: 1.15;
	}

	/** 
	 * variant
	 * @link no links...
	 */
	.kit-appbar[data-variant='filled'] {
		--kit-appbar-bg: var(--kit-color-surface-1);
		--kit-appbar-fg: var(--kit-color-text);

		--kit-appbar-hover-bg: color-mix(in oklab, var(--kit-appbar-bg), black 10%);
		--kit-appbar-active-bg: color-mix(in oklab, var(--kit-appbar-bg), black 16%);
	}
	.kit-appbar[data-variant='outline'] {
		--kit-appbar-bg: transparent;
		--kit-appbar-fg: var(--kit-color-text);
		--kit-appbar-bd: var(--kit-appbar-fg);

		--kit-appbar-hover-bg: color-mix(in oklab, var(--kit-appbar-fg), transparent 80%);
		--kit-appbar-active-bg: color-mix(in oklab, var(--kit-appbar-fg), transparent 92%);
	}
	.kit-appbar[data-variant='text'] {
		--kit-appbar-bg: transparent;
		--kit-appbar-fg: var(--kit-color-text);

		--kit-appbar-hover-bg: color-mix(in oklab, var(--kit-appbar-fg), transparent 80%);
		--kit-appbar-active-bg: color-mix(in oklab, var(--kit-appbar-fg), transparent 92%);
	}

	/**
	* size
	* @link nothing...
	*/
	.kit-appbar[data-size='xs'] {
		--kit-appbar-h: 28px;
		--kit-appbar-px: 10px;
		--kit-appbar-gap: 4px;
		--kit-appbar-font: 0.75rem;
	}
	.kit-appbar[data-size='sm'] {
		--kit-appbar-h: 32px;
		--kit-appbar-px: 12px;
		--kit-appbar-gap: 6px;
		--kit-appbar-font: 0.875rem;
	}
	.kit-appbar[data-size='md'] {
		--kit-appbar-h: 40px;
		--kit-appbar-px: 14px;
		--kit-appbar-gap: 8px;
		--kit-appbar-font: 1rem;
	}
	.kit-appbar[data-size='lg'] {
		--kit-appbar-h: 48px;
		--kit-appbar-px: 16px;
		--kit-appbar-gap: 10px;
		--kit-appbar-font: 1.125rem;
	}
	.kit-appbar[data-size='xl'] {
		--kit-appbar-h: 56px;
		--kit-appbar-px: 18px;
		--kit-appbar-gap: 12px;
		--kit-appbar-font: 1.25rem;
	}

	.kit-appbar__wrapper {
		position: relative;
		z-index: 1;
		display: flex;
		align-items: center;
		flex-direction: row;
		gap: 0.75rem;
		width: 100%;
		margin: 0 auto;
	}

	.kit-appbar .outline {
		--outline-color: var(--kit-appbar-bd);
	}
</style>
