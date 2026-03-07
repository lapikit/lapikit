<script lang="ts">
	import { useClassName, useStyles } from '$lib/labs/utils/index.js';
	import { makeComponentProps } from '$lib/labs/compiler/mapped-code.js';
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

	let safeSize = $derived(
		size === 'default' || size === undefined
			? undefined
			: size === 'xs' || size === 'sm' || size === 'md' || size === 'lg' || size === 'xl'
				? size
				: 'md'
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

	let safeLoading = $derived(loading === 'lazy' || loading === 'eager' ? loading : 'eager');
	let safeDecoding = $derived(
		decoding === 'async' || decoding === 'sync' || decoding === 'auto' ? decoding : 'async'
	);
	let safeColorMode = $derived(
		colorMode === 'auto' || colorMode === 'none' || colorMode === 'mask' || colorMode === 'filter'
			? colorMode
			: 'auto'
	);

	let iconRole = $derived(!decorative && (label || alt) ? 'img' : undefined);
	let iconAriaLabel = $derived(!decorative ? label || alt || undefined : undefined);
	let iconAriaHidden = $derived(decorative ? true : undefined);
	let imgAlt = $derived(decorative ? '' : alt || label || '');
	let isSvgSrc = $derived(!!resolvedSrc && /\.svg($|\?)/i.test(resolvedSrc));
	let useMaskMode = $derived(
		!!resolvedSrc &&
			(color ? safeColorMode === 'mask' || (safeColorMode === 'auto' && isSvgSrc) : false)
	);
	let useFilterMode = $derived(
		!!resolvedSrc && !!imgFilter && (safeColorMode === 'filter' || safeColorMode === 'auto')
	);
	let mergedStyle = $derived(
		[componentStyle, color ? `color:${color}` : '', color ? `--kit-icon-color:${color}` : '']
			.filter(Boolean)
			.join('; ')
	);
</script>

{#if hasContent}
	<svelte:element
		this={is}
		bind:this={ref}
		class={classWithIconName}
		style={mergedStyle}
		data-size={safeSize}
		role={iconRole}
		aria-label={iconAriaLabel}
		aria-hidden={iconAriaHidden}
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
					loading={safeLoading}
					decoding={safeDecoding}
					style={useFilterMode ? `filter:${imgFilter}` : undefined}
				/>
			{/if}
		{/if}
	</svelte:element>
{/if}

<style>
	.kit-icon {
		--kit-icon-size-xs: 0.875rem;
		--kit-icon-size-sm: 1rem;
		--kit-icon-size-md: 1.125rem;
		--kit-icon-size-lg: 1.25rem;
		--kit-icon-size-xl: 1.375rem;
		--kit-icon-current-size: var(--kit-icon-size-md);

		display: inline-flex;
		align-items: center;
		justify-content: center;
		text-indent: 0;
		line-height: 1;
		font-size: var(--kit-icon-current-size);
		vertical-align: middle;
	}

	.kit-icon[data-size='xs'] {
		--kit-icon-current-size: var(--kit-icon-size-xs);
	}
	.kit-icon[data-size='sm'] {
		--kit-icon-current-size: var(--kit-icon-size-sm);
	}
	.kit-icon[data-size='md'] {
		--kit-icon-current-size: var(--kit-icon-size-md);
	}
	.kit-icon[data-size='lg'] {
		--kit-icon-current-size: var(--kit-icon-size-lg);
	}
	.kit-icon[data-size='xl'] {
		--kit-icon-current-size: var(--kit-icon-size-xl);
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
</style>
