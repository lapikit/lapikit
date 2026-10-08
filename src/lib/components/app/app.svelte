<script lang="ts">
	import { makeComponentProps } from '$lib/html-mapped';
	import { useClassName, useStyles } from '$lib/utils';
	import type { AppProps } from './app.types';

	let {
		ref = $bindable(),
		children,
		class: className = '',
		style: styleAttr = '',
		's-class': sClass,
		's-style': sStyle,
		...rest
	}: AppProps = $props();

	let { classProps, styleProps, restProps } = $derived(makeComponentProps(rest));

	let componentClass = $derived(
		useClassName({
			baseClass: 'kit-application',
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

<div id="kit-app" bind:this={ref} class={componentClass} style={componentStyle} {...restProps}>
	{@render children?.()}
</div>

<style lang="scss">
	@use './app';
</style>
