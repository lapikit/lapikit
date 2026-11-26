<script lang="ts">
	import { useComponentAttrs } from '$lib/utils';
	import type { SpinnerProps } from './spinner.types.ts';

	let {
		ref = $bindable(),
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

	const toLength = (value: string | number | undefined) =>
		typeof value === 'number' ? `${value}px` : (value ?? false);

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
	role={label ? 'status' : undefined}
	aria-label={label}
	aria-hidden={label ? undefined : true}
	{...attrs.rest}
></span>

<style lang="scss">
	@use './spinner';
</style>
