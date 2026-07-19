<script lang="ts">
	import type { CardContentProps } from '../card.types';
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
		color,
		...rest
	}: CardContentProps = $props();

	let { classProps, styleProps, restProps } = $derived(makeComponentProps(rest));

	let componentClass = $derived(
		useClassName({
			baseClass: 'kit-card-content',
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

	let resolvedStyle = $derived(
		[componentStyle, color ? `--kit-card-content-fg:${color && `var(--kit-color-${color})`}` : '']
			.filter(Boolean)
			.join('; ')
	);
</script>

<svelte:element
	this={is}
	bind:this={ref}
	class={componentClass}
	style={resolvedStyle}
	{...restProps}
>
	{@render children?.()}
</svelte:element>

<style>
	.kit-card-content {
		color: var(--kit-card-content-fg, --kit-card-fg);
		display: block;
		line-height: 1.45;
	}

	.kit-card-content > :global(*) {
		margin: 0;
	}
</style>
