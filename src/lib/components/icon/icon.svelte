<script lang="ts">
	import { useClassName, useStyles } from '$lib/utils';
	import { makeComponentProps } from '$lib/html-mapped';
	import type { IconProps } from './icon.types.ts';

	let {
		ref = $bindable(),
		is = 'i',
		children = undefined,
		class: className = '',
		style: styleAttr = '',
		's-class': sClass,
		's-style': sStyle,
		name = undefined,
		src = undefined,
		icon = undefined,
		size = 'default',
		alt = '',
		label = undefined,
		decorative = true,
		loading = 'eager',
		decoding = 'async',
		color = undefined,
		colorMode = 'auto',
		imgFilter = undefined,
		...rest
	}: IconProps = $props();

	let { classProps, styleProps, restProps } = $derived(
		makeComponentProps(rest as Record<string, unknown>)
	);

	let componentClass = $derived(
		useClassName({
			baseClass: 'kit-icon',
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

	let resolvedSrc = $derived(src ?? (icon?.includes('/') ? icon : undefined));
	let resolvedName = $derived(name ?? (!icon?.includes('/') ? icon : undefined));
	let hasChildren = $derived(!!children);
	let hasContent = $derived(hasChildren || !!resolvedSrc || !!resolvedName);
	let classWithIconName = $derived(
		!hasChildren && !resolvedSrc && resolvedName
			? `${componentClass} ${resolvedName}`.trim()
			: componentClass
	);

	let iconRole = $derived(!decorative && (label || alt) ? 'img' : undefined);
	let iconAriaLabel = $derived(!decorative ? label || alt || undefined : undefined);
	let iconAriaHidden = $derived(decorative ? true : undefined);
	let imgAlt = $derived(decorative ? '' : alt || label || '');
	let isSvgSrc = $derived(!!resolvedSrc && /\.svg($|\?)/i.test(resolvedSrc));
	let useMaskMode = $derived(
		!!resolvedSrc && (color ? colorMode === 'mask' || (colorMode === 'auto' && isSvgSrc) : false)
	);
	let useFilterMode = $derived(
		!!resolvedSrc && !!imgFilter && (colorMode === 'filter' || colorMode === 'auto')
	);
	let mergedStyle = $derived([componentStyle].filter(Boolean).join('; '));
</script>

{#if hasContent}
	<svelte:element
		this={is}
		bind:this={ref}
		class={classWithIconName}
		style={mergedStyle}
		data-size={size}
		role={iconRole}
		aria-label={iconAriaLabel}
		aria-hidden={iconAriaHidden}
		style:--kit-icon-color={color && `var(--kit-color-${color})`}
		style:color={color && `var(--kit-color-${color})`}
		{...restProps}
	>
		{#if hasChildren}
			{@render children?.()}
		{:else if resolvedSrc}
			{#if useMaskMode}
				<span
					class="kit-icon__mask"
					style={`--kit-icon-mask-image: url("${resolvedSrc}")`}
					aria-hidden="true"
				></span>
			{:else}
				<img
					src={resolvedSrc}
					alt={imgAlt}
					{loading}
					{decoding}
					style={useFilterMode ? `filter:${imgFilter}` : undefined}
				/>
			{/if}
		{/if}
	</svelte:element>
{/if}

<style>
	.kit-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		text-indent: 0;
		line-height: 1;
		font-size: var(--kit-icon-current-size);
		vertical-align: middle;
	}

	.kit-icon :global(svg),
	.kit-icon img,
	.kit-icon .kit-icon__mask {
		width: var(--kit-icon-current-size);
		height: var(--kit-icon-current-size);
		flex-shrink: 0;
		display: block;
	}

	.kit-icon .kit-icon__mask {
		display: inline-block;
		background-color: var(--kit-icon-color, currentColor);
		mask-image: var(--kit-icon-mask-image);
		mask-repeat: no-repeat;
		mask-size: contain;
		mask-position: center;
		-webkit-mask-image: var(--kit-icon-mask-image);
		-webkit-mask-repeat: no-repeat;
		-webkit-mask-size: contain;
		-webkit-mask-position: center;
	}

	/** 
	 * size
	 * @link https://lapikit.dev/docs/components/icon#size 
	 */
	.kit-icon[data-size='xs'] {
		--kit-icon-current-size: 0.875rem;
	}
	.kit-icon[data-size='sm'] {
		--kit-icon-current-size: 1rem;
	}
	.kit-icon[data-size='md'] {
		--kit-icon-current-size: 1.125rem;
	}
	.kit-icon[data-size='lg'] {
		--kit-icon-current-size: 1.25rem;
	}
	.kit-icon[data-size='xl'] {
		--kit-icon-current-size: 1.375rem;
	}
</style>
