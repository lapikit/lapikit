<script lang="ts">
	import { useComponentAttrs } from '$lib/utils';
	import type { ProgressProps } from './progress.types.ts';

	let {
		ref = $bindable(),
		value,
		max = 100,
		label,
		color,
		thickness,
		rounded = 'full',
		class: className,
		style: styleAttr,
		's-class': sClass,
		's-style': sStyle,
		...rest
	}: ProgressProps = $props();

	let isIndeterminate = $derived(typeof value !== 'number' || !Number.isFinite(value));
	let safeMax = $derived(Number.isFinite(max) && max > 0 ? max : 100);
	let clampedValue = $derived(
		isIndeterminate ? 0 : Math.min(Math.max(value as number, 0), safeMax)
	);
	let percent = $derived((clampedValue / safeMax) * 100);

	let attrs = $derived(
		useComponentAttrs(
			'kit-progress',
			{
				className,
				sClass,
				styleAttr,
				sStyle: {
					'--kit-progress-thickness':
						typeof thickness === 'number' ? `${thickness}px` : (thickness ?? false),
					'--kit-progress-value': isIndeterminate ? false : `${percent}%`,
					...sStyle
				},
				color
			},
			rest
		)
	);
</script>

<div
	bind:this={ref}
	class={attrs.class}
	style={attrs.style}
	role="progressbar"
	aria-label={label}
	aria-valuemin={isIndeterminate ? undefined : 0}
	aria-valuemax={isIndeterminate ? undefined : safeMax}
	aria-valuenow={isIndeterminate ? undefined : clampedValue}
	data-indeterminate={isIndeterminate}
	data-rounded={rounded}
	{...attrs.rest}
>
	<span class="kit-progress__bar"></span>
</div>

<style lang="scss">
	@use './progress';
</style>
