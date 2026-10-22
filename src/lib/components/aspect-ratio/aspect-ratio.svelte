<script lang="ts">
	import { useComponentAttrs } from '$lib/utils';
	import type { AspectRatioProps, AspectRatioValue } from './aspect-ratio.types.ts';

	const FALLBACK_RATIO = 16 / 9;

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

	let {
		ref = $bindable(),
		is = 'div',
		children = undefined,
		class: className,
		style: styleAttr,
		's-class': sClass,
		's-style': sStyle,
		ratio = undefined,
		aspectRatio = undefined,
		fit = 'cover',
		inline = false,
		...rest
	}: AspectRatioProps = $props();

	let resolvedRatio = $derived(resolveRatio(ratio ?? aspectRatio));
	let attrs = $derived(
		useComponentAttrs(
			'kit-aspect-ratio',
			{
				className,
				sClass,
				styleAttr,
				sStyle: { '--kit-aspect-ratio': String(resolvedRatio), '--kit-aspect-fit': fit, ...sStyle }
			},
			rest
		)
	);
</script>

<svelte:element
	this={is}
	bind:this={ref}
	class={attrs.class}
	style={attrs.style}
	data-inline={inline}
	{...attrs.rest}
>
	<div class="kit-aspect-ratio__inner">
		{@render children?.()}
	</div>
</svelte:element>

<style lang="scss">
	@use './aspect-ratio';
</style>
