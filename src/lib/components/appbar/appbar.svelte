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
		min-height: calc(var(--kit-appbar-h) + var(--kit-appbar-density-offset) / 2);
		padding: calc(var(--kit-appbar-p) + var(--kit-appbar-density-offset) / 2);
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
	.kit-appbar[data-density='compact'] {
		--kit-appbar-density-offset: var(--kit-density-compact);
	}
	.kit-appbar[data-density='default'] {
		--kit-appbar-density-offset: var(--kit-density-default);
	}
	.kit-appbar[data-density='comfortable'] {
		--kit-appbar-density-offset: var(--kit-density-comfortable);
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
		--kit-appbar-h: 32px;
		--kit-appbar-p: 8px;
		--kit-appbar-gap: var(--kit-space-compact);
		--kit-appbar-font: var(--kit-font-xs);
	}
	.kit-appbar[data-size='sm'] {
		--kit-appbar-h: 40px;
		--kit-appbar-p: 10px;
		--kit-appbar-gap: var(--kit-space-default);
		--kit-appbar-font: var(--kit-font-sm);
	}
	.kit-appbar[data-size='md'] {
		--kit-appbar-h: 48px;
		--kit-appbar-p: 12px;
		--kit-appbar-gap: var(--kit-space-default);
		--kit-appbar-font: var(--kit-font-md);
	}
	.kit-appbar[data-size='lg'] {
		--kit-appbar-h: 56px;
		--kit-appbar-p: 16px;
		--kit-appbar-gap: var(--kit-space-default);
		--kit-appbar-font: var(--kit-font-lg);
	}
	.kit-appbar[data-size='xl'] {
		--kit-appbar-h: 64px;
		--kit-appbar-p: 20px;
		--kit-appbar-gap: var(--kit-space-comfortable);
		--kit-appbar-font: var(--kit-font-xl);
	}

	.kit-appbar__wrapper {
		position: relative;
		z-index: 1;
		display: flex;
		align-items: center;
		flex-direction: row;
		gap: var(--kit-appbar-gap);
		width: 100%;
		margin: 0 auto;
	}

	.kit-appbar .outline {
		--outline-color: var(--kit-appbar-bd);
	}
</style>
