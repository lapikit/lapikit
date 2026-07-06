<script lang="ts">
	import type { CardTitleProps } from '../card.types';
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
	}: CardTitleProps = $props();

	let { classProps, styleProps, restProps } = $derived(makeComponentProps(rest));

	let componentClass = $derived(
		useClassName({
			baseClass: 'kit-card-title',
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
	.kit-card-title {
		display: flex;
		align-items: center;
		gap: var(--kit-card-gap);

		font-weight: 600;
		line-height: 1.3;
	}

	.kit-card-title > :global(*) {
		margin: 0;
	}
</style>
