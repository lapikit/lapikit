<script lang="ts">
	import { makeComponentProps } from '$lib/html-mapped';
	import { useClassName, useStyles } from '$lib/utils';
	import type { ListDensity, ListProps, ListVariant } from './list.types.ts';

	function resolveVariant(value: ListVariant | undefined): ListVariant {
		return value === 'filled' || value === 'outline' || value === 'text' ? value : 'filled';
	}

	function resolveDensity(value: ListDensity | undefined): ListDensity {
		return value === 'compact' || value === 'comfortable' || value === 'default'
			? value
			: 'default';
	}

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
		color = undefined,
		background = undefined,
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

	let safeVariant = $derived(resolveVariant(variant));
	let safeDensity = $derived(resolveDensity(density));
	let safeSize = $derived(
		size === 'default'
			? 'md'
			: size === 'xs' || size === 'sm' || size === 'md' || size === 'lg' || size === 'xl'
				? size
				: 'md'
	);
	let mergedStyle = $derived(
		[
			componentStyle,
			color ? `--kit-list-fg:${color}` : '',
			background ? `--kit-list-bg:${background}` : ''
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
	data-size={safeSize}
	data-variant={safeVariant}
	data-density={safeDensity}
	data-rounded={rounded}
	data-nav={nav}
	role={nav ? 'navigation' : is === 'ul' ? undefined : 'list'}
	{...restProps}
>
	{@render children?.()}
</svelte:element>

<style>
	.kit-list {
		--kit-list-bg: var(--kit-surface-1);
		--kit-list-fg: var(--kit-fg);
		--kit-list-bd: var(--kit-border);
		--kit-list-radius: 10px;
		--kit-list-item-h: 2.75rem;
		--kit-list-item-px: 0.875rem;
		--kit-list-item-gap: 0.625rem;
		--kit-list-item-font: 0.9375rem;

		display: flex;
		flex-direction: column;
		width: 100%;
		padding: 0.25rem;
		gap: 0.125rem;
		color: var(--kit-list-fg);
		background: transparent;
		border-radius: var(--kit-list-radius);
	}

	.kit-list[data-nav='true'] {
		padding: 0.5rem;
	}

	.kit-list[data-size='xs'] {
		--kit-list-item-h: 2.125rem;
		--kit-list-item-px: 0.625rem;
		--kit-list-item-gap: 0.5rem;
		--kit-list-item-font: 0.75rem;
	}

	.kit-list[data-size='sm'] {
		--kit-list-item-h: 2.375rem;
		--kit-list-item-px: 0.75rem;
		--kit-list-item-gap: 0.5rem;
		--kit-list-item-font: 0.875rem;
	}

	.kit-list[data-size='md'] {
		--kit-list-item-h: 2.75rem;
		--kit-list-item-px: 0.875rem;
		--kit-list-item-gap: 0.625rem;
		--kit-list-item-font: 0.9375rem;
	}

	.kit-list[data-size='lg'] {
		--kit-list-item-h: 3.125rem;
		--kit-list-item-px: 1rem;
		--kit-list-item-gap: 0.75rem;
		--kit-list-item-font: 1rem;
	}

	.kit-list[data-size='xl'] {
		--kit-list-item-h: 3.5rem;
		--kit-list-item-px: 1.125rem;
		--kit-list-item-gap: 0.875rem;
		--kit-list-item-font: 1.0625rem;
	}

	.kit-list[data-density='compact'] {
		--kit-list-item-h: calc(var(--kit-list-item-h) - 0.25rem);
	}

	.kit-list[data-density='comfortable'] {
		--kit-list-item-h: calc(var(--kit-list-item-h) + 0.25rem);
	}

	.kit-list[data-rounded='0'] {
		--kit-list-radius: 0;
	}

	.kit-list[data-rounded='xs'] {
		--kit-list-radius: 2px;
	}

	.kit-list[data-rounded='sm'] {
		--kit-list-radius: 6px;
	}

	.kit-list[data-rounded='md'] {
		--kit-list-radius: 10px;
	}

	.kit-list[data-rounded='lg'] {
		--kit-list-radius: 16px;
	}

	.kit-list[data-rounded='xl'] {
		--kit-list-radius: 9999px;
	}

	.kit-list[data-variant='filled'] {
		background: color-mix(in oklab, var(--kit-list-bg), transparent 12%);
	}

	.kit-list[data-variant='outline'] {
		border: 1px solid var(--kit-list-bd);
	}
</style>
