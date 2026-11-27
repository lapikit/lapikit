<script lang="ts">
	import { useComponentAttrs } from '$lib/utils';
	import type { SpinnerProps } from './spinner.types.ts';

	let {
		ref = $bindable(),
		value,
		max = 100,
		size,
		thickness,
		label,
		color,
		class: className,
		style: styleAttr,
		's-class': sClass,
		's-style': sStyle,
		...rest
	}: SpinnerProps = $props();

	const toLength = (length: string | number | undefined) =>
		typeof length === 'number' ? `${length}px` : (length ?? false);

	let isDeterminate = $derived(typeof value === 'number' && Number.isFinite(value));
	let safeMax = $derived(Number.isFinite(max) && max > 0 ? max : 100);
	let clampedValue = $derived(isDeterminate ? Math.min(Math.max(value as number, 0), safeMax) : 0);

	let attrs = $derived(
		useComponentAttrs(
			'kit-spinner',
			{
				className,
				sClass,
				styleAttr,
				sStyle: {
					'--kit-spinner-size': toLength(size),
					'--kit-spinner-thickness': toLength(thickness),
					'--kit-spinner-value': isDeterminate ? `${(clampedValue / safeMax) * 100}%` : false,
					...sStyle
				},
				color
			},
			rest
		)
	);
</script>

<span
	bind:this={ref}
	class={attrs.class}
	style={attrs.style}
	role={isDeterminate ? 'progressbar' : label ? 'status' : undefined}
	aria-label={label}
	aria-hidden={isDeterminate || label ? undefined : true}
	aria-valuemin={isDeterminate ? 0 : undefined}
	aria-valuemax={isDeterminate ? safeMax : undefined}
	aria-valuenow={isDeterminate ? clampedValue : undefined}
	data-determinate={isDeterminate}
	{...attrs.rest}
></span>

<style lang="scss">
	@use './spinner';
</style>
