<script lang="ts">
	import { useClassName, useStyles } from '$lib/utils';
	import { makeComponentProps } from '$lib/html-mapped';
	import type { AccordionProps } from './accordion.types.ts';

	let {
		ref = $bindable(),
		is = 'div',
		children = undefined,
		class: className = '',
		style: styleAttr = '',
		's-class': sClass,
		's-style': sStyle,
		text = undefined,
		dark = false,
		light = false,
		color = undefined,
		background = undefined,
		rounded = undefined,
		spacer = false,
		hideIcon = false,
		...rest
	}: AccordionProps = $props();

	let { classProps, styleProps, restProps } = $derived(
		makeComponentProps(rest as Record<string, unknown>)
	);

	let componentClass = $derived(
		useClassName({
			baseClass: 'kit-accordion',
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

	let mergedStyle = $derived(
		[
			componentStyle,
			color ? `--kit-accordion-color:${color}` : '',
			background ? `--kit-accordion-background:${background}` : ''
		]
			.filter(Boolean)
			.join('; ')
	);
</script>

<svelte:element
	this={is}
	bind:this={ref}
	class={componentClass}
	style={mergedStyle}
	{...restProps}
	data-text={text ? true : undefined}
	data-dark={dark}
	data-light={light}
	data-spacer={spacer}
	data-hide-icon={hideIcon}
	data-rounded={rounded}
>
	{@render children?.()}
</svelte:element>

<style>
	.kit-accordion {
		--kit-accordion-radius: 8px;
		--kit-accordion-gap: 0;
		--kit-accordion-color: var(--kit-fg);
		--kit-accordion-background: transparent;

		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		width: 100%;
		padding: 0;
		list-style: none;
		position: relative;
		z-index: 1;
		gap: var(--kit-accordion-gap);
		color: var(--kit-accordion-color);
		background: var(--kit-accordion-background);
	}

	.kit-accordion[data-spacer='true'] {
		--kit-accordion-gap: 1rem;
	}

	.kit-accordion[data-rounded='0'] {
		--kit-accordion-radius: 0;
	}

	.kit-accordion[data-rounded='xs'] {
		--kit-accordion-radius: 2px;
	}

	.kit-accordion[data-rounded='sm'] {
		--kit-accordion-radius: 4px;
	}

	.kit-accordion[data-rounded='md'] {
		--kit-accordion-radius: 8px;
	}

	.kit-accordion[data-rounded='lg'] {
		--kit-accordion-radius: 16px;
	}

	.kit-accordion[data-rounded='xl'] {
		--kit-accordion-radius: 99999px;
	}

	.kit-accordion[data-dark='true'] {
		--kit-accordion-background: var(--kit-surface-3);
		--kit-accordion-color: var(--kit-fg);
	}

	.kit-accordion[data-light='true'] {
		--kit-accordion-background: var(--kit-surface-1);
	}

	.kit-accordion[data-hide-icon='true'] :global(.kit-accordion-item__indicator) {
		display: none;
	}
</style>
