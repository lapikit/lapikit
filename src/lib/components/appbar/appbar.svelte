<script lang="ts">
	import { useClassName, useStyles } from '$lib/utils';
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
		variant = 'filled',
		rounded = 0,
		background,
		color,
		density = 'default',
		...rest
	}: AppbarProps = $props();

	let safeVariant = $derived(
		typeof variant === 'string' && (variant === 'outline' || variant === 'text')
			? variant
			: 'filled'
	);

	let safeDensity = $derived(
		typeof density === 'string' &&
			(density === 'compact' || density === 'comfortable' || density === 'default')
			? density
			: 'default'
	);

	let { classProps, styleProps, restProps } = $derived(
		makeComponentProps(rest as Record<string, unknown>)
	);

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

	let mergedStyle = $derived(
		[
			componentStyle,
			background ? `--kit-appbar-bg:${background}` : '',
			color ? `--kit-appbar-fg:${color}` : '',
			typeof rounded === 'string' && rounded.includes('px') ? `--kit-appbar-radius:${rounded}` : ''
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
	data-variant={safeVariant}
	data-density={safeDensity}
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
	.kit-appbar {
		--kit-appbar-bg: var(--kit-surface-2);
		--kit-appbar-fg: var(--kit-fg);
		--kit-appbar-radius: 1rem;
		--kit-appbar-size: 4rem;
		--kit-appbar-padding-x: 1rem;
		--kit-appbar-padding-wrapper: 0;
		--kit-appbar-bd: color-mix(in oklab, var(--kit-appbar-fg), transparent 88%);

		display: flex;
		align-items: center;
		box-sizing: border-box;
		position: relative;
		width: 100%;
		min-height: var(--kit-appbar-size);
		padding-inline: var(--kit-appbar-padding-x);
		border-radius: var(--kit-appbar-radius);
		color: var(--kit-appbar-fg);
		background-color: var(--kit-appbar-bg);
		overflow: hidden;
	}

	.kit-appbar[data-variant='text'] {
		--kit-appbar-bd: transparent;
	}

	.kit-appbar[data-density='compact'] {
		--kit-appbar-size: 3.5rem;
		--kit-appbar-padding-x: 0.75rem;
	}

	.kit-appbar[data-density='default'] {
		--kit-appbar-size: 4rem;
		--kit-appbar-padding-x: 1rem;
	}

	.kit-appbar[data-density='comfortable'] {
		--kit-appbar-size: 4.5rem;
		--kit-appbar-padding-x: 1.5rem;
	}

	.kit-appbar[data-rounded='0'] {
		--kit-appbar-radius: 0;
	}

	.kit-appbar[data-rounded='xs'] {
		--kit-appbar-radius: 2px;
	}

	.kit-appbar[data-rounded='sm'] {
		--kit-appbar-radius: 4px;
	}

	.kit-appbar[data-rounded='md'] {
		--kit-appbar-radius: 8px;
	}

	.kit-appbar[data-rounded='lg'] {
		--kit-appbar-radius: 16px;
	}

	.kit-appbar[data-rounded='xl'] {
		--kit-appbar-radius: 99999px;
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

		pointer-events: none;
	}
</style>
