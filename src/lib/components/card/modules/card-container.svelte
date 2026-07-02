<script lang="ts">
	import type { CardContainerProps } from '../card.types';
	import { makeComponentProps } from '$lib/html-mapped';
	import { useClassName, useStyles } from '$lib/utils';

	let {
		ref = $bindable(),
		is = 'div',
		children,
		class: className = '',
		style: styleAttr = '',
		's-class': sClass,
		's-style': sStyle,
		...rest
	}: CardContainerProps = $props();

	let { classProps, styleProps, restProps } = $derived(makeComponentProps(rest));

	let componentClass = $derived(
		useClassName({
			baseClass: 'kit-card-container',
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
</script>

<svelte:element
	this={is}
	bind:this={ref}
	class={componentClass}
	style={componentStyle}
	{...restProps}
>
	{@render children?.()}
</svelte:element>

<style>
	.kit-card-container {
		gap: var(--kit-card-gap);
	}
</style>
