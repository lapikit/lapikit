<script lang="ts">
	import { useClassName, useStyles } from '$lib/labs/utils/index.js';
	import { makeComponentProps } from '$lib/labs/compiler/mapped-code.js';
	import type { AspectRatioFit, AspectRatioProps, AspectRatioValue } from './aspect-ratio.types.ts';

	const FALLBACK_RATIO = 16 / 9;
	const FALLBACK_FIT: AspectRatioFit = 'cover';

	function resolveRatio(value: AspectRatioValue | undefined): number {
		if (typeof value === 'number') {
			return Number.isFinite(value) && value > 0 ? value : FALLBACK_RATIO;
		}

		if (typeof value !== 'string') {
			return FALLBACK_RATIO;
		}

		const normalized = value.trim();
		if (!normalized) {
			return FALLBACK_RATIO;
		}

		if (normalized.includes('/') || normalized.includes(':')) {
			const separator = normalized.includes('/') ? '/' : ':';
			const [w, h] = normalized.split(separator).map((part) => Number(part.trim()));

			if (Number.isFinite(w) && Number.isFinite(h) && w > 0 && h > 0) {
				return w / h;
			}
		}

		const asNumber = Number(normalized);
		return Number.isFinite(asNumber) && asNumber > 0 ? asNumber : FALLBACK_RATIO;
	}

	function resolveFit(value: AspectRatioFit | undefined): AspectRatioFit {
		return value === 'cover' || value === 'contain' || value === 'fill' ? value : FALLBACK_FIT;
	}

	let {
		ref = $bindable(),
		is = 'div',
		children = undefined,
		class: className = '',
		style: styleAttr = '',
		's-class': sClass,
		's-style': sStyle,
		ratio = undefined,
		aspectRatio = undefined,
		fit = 'cover',
		inline = false,
		...rest
	}: AspectRatioProps = $props();

	let { classProps, styleProps, restProps } = $derived(
		makeComponentProps(rest as Record<string, unknown>)
	);

	let componentClass = $derived(
		useClassName({
			baseClass: 'kit-aspect-ratio',
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

	let resolvedRatio = $derived(resolveRatio(ratio ?? aspectRatio));
	let resolvedFit = $derived(resolveFit(fit));
	let mergedStyle = $derived(
		[componentStyle, `--kit-aspect-ratio: ${resolvedRatio}`, `--kit-aspect-fit: ${resolvedFit}`]
			.filter(Boolean)
			.join('; ')
	);
</script>

<svelte:element
	this={is}
	bind:this={ref}
	class={componentClass}
	style={mergedStyle}
	data-inline={inline}
	{...restProps}
>
	<div class="kit-aspect-ratio__inner">
		{@render children?.()}
	</div>
</svelte:element>

<style>
	.kit-aspect-ratio {
		display: block;
		position: relative;
		width: 100%;
		max-width: 100%;
		overflow: hidden;
		aspect-ratio: var(--kit-aspect-ratio, 1.7777777778);
	}

	.kit-aspect-ratio[data-inline='true'] {
		display: inline-block;
		width: auto;
	}

	.kit-aspect-ratio__inner {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.kit-aspect-ratio :global(img),
	.kit-aspect-ratio :global(video),
	.kit-aspect-ratio :global(iframe),
	.kit-aspect-ratio :global(canvas),
	.kit-aspect-ratio :global(svg) {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: var(--kit-aspect-fit, cover);
	}
</style>
