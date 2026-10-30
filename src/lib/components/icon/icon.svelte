<script lang="ts">
	import { useComponentAttrs } from '$lib/utils';
	import { tooltip as tooltipAction } from '../tooltip/tooltip-action.svelte.ts';
	import type { IconProps } from './icon.types.ts';

	let {
		ref = $bindable(),
		is = 'i',
		children = undefined,
		class: className,
		style: styleAttr,
		's-class': sClass,
		's-style': sStyle,
		name = undefined,
		src = undefined,
		icon = undefined,
		size = 'default',
		alt = '',
		label = undefined,
		tooltip = undefined,
		decorative = true,
		loading = 'eager',
		decoding = 'async',
		color = undefined,
		colorMode = 'auto',
		imgFilter = undefined,
		...rest
	}: IconProps = $props();

	let attrs = $derived(
		useComponentAttrs('kit-icon', { className, sClass, styleAttr, sStyle, color }, rest)
	);

	let resolvedSrc = $derived(src ?? (icon?.includes('/') ? icon : undefined));
	let resolvedName = $derived(name ?? (!icon?.includes('/') ? icon : undefined));
	let hasChildren = $derived(!!children);
	let hasContent = $derived(hasChildren || !!resolvedSrc || !!resolvedName);
	let iconClass = $derived(!hasChildren && !resolvedSrc ? resolvedName : undefined);

	// an icon with a tooltip is not decorative: the tooltip names it
	let tooltipLabel = $derived(typeof tooltip === 'string' ? tooltip : tooltip ? tooltip.label : '');
	let isDecorative = $derived(decorative && !tooltipLabel);
	let iconRole = $derived(!isDecorative && (label || alt || tooltipLabel) ? 'img' : undefined);
	let iconAriaLabel = $derived(
		!isDecorative ? label || alt || tooltipLabel || undefined : undefined
	);
	let iconAriaHidden = $derived(isDecorative ? true : undefined);
	let imgAlt = $derived(decorative ? '' : alt || label || '');
	let isSvgSrc = $derived(!!resolvedSrc && /\.svg($|\?)/i.test(resolvedSrc));
	let useMaskMode = $derived(
		!!resolvedSrc && (color ? colorMode === 'mask' || (colorMode === 'auto' && isSvgSrc) : false)
	);
	let useFilterMode = $derived(
		!!resolvedSrc && !!imgFilter && (colorMode === 'filter' || colorMode === 'auto')
	);
</script>

{#if hasContent}
	<svelte:element
		this={is}
		bind:this={ref}
		class={[attrs.class, iconClass]}
		style={attrs.style}
		data-size={size}
		role={iconRole}
		aria-label={iconAriaLabel}
		aria-hidden={iconAriaHidden}
		use:tooltipAction={tooltip}
		{...attrs.rest}
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

<style lang="scss">
	@use './icon';
</style>
