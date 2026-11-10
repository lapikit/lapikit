<script lang="ts">
	import { useComponentAttrs, elevationAttrs } from '$lib/utils';
	import type { AvatarProps } from './avatar.types.ts';

	let {
		ref = $bindable(),
		children = undefined,
		class: className,
		style: styleAttr,
		's-class': sClass,
		's-style': sStyle,
		label = undefined,
		size = 'md',
		density = 'default',
		rounded = 'full',
		elevation,
		color,
		...rest
	}: AvatarProps = $props();

	let attrs = $derived(
		useComponentAttrs('kit-avatar', { className, sClass, styleAttr, sStyle, color }, rest)
	);
	let elevationAttributes = $derived(elevationAttrs(elevation));
	let displayLabel = $derived(label?.trim() ?? '');
</script>

<div
	bind:this={ref}
	class={attrs.class}
	style={attrs.style}
	data-type={displayLabel ? 'label' : 'content'}
	data-size={size}
	data-density={density}
	data-rounded={rounded}
	{...elevationAttributes}
	{...attrs.rest}
>
	{#if displayLabel}
		<span class="kit-avatar__label">{displayLabel}</span>
	{:else}
		{@render children?.()}
	{/if}
</div>

<style lang="scss">
	@use './avatar';
</style>
