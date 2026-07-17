<script lang="ts">
	import { useClassName, useStyles } from '$lib/utils';
	import { makeComponentProps } from '$lib/html-mapped';
	import type { AccordionProps } from './accordion.types.ts';

	let {
		ref = $bindable(),
		is = 'div',
		children,
		class: className = '',
		style: styleAttr = '',
		's-class': sClass,
		's-style': sStyle,
		size = 'md',
		variant = 'filled',
		density = 'default',
		rounded = 'md',
		text,
		color,
		background,
		spacer,
		hideIcon,
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

	let resolvedStyle = $derived(
		[
			componentStyle,
			color ? `--kit-accordion-item-fg:${color && `var(--kit-color-${color})`}` : '',
			background ? `--kit-accordion-item-bg:${background && `var(--kit-color-${background})`}` : ''
		]
			.filter(Boolean)
			.join('; ')
	);
</script>

<svelte:element
	this={is}
	bind:this={ref}
	class={componentClass}
	style={resolvedStyle}
	data-text={text ? true : undefined}
	data-spacer={spacer}
	data-hide-icon={hideIcon}
	data-size={size}
	data-variant={variant}
	data-density={density}
	data-rounded={rounded}
	{...restProps}
>
	{@render children?.()}
</svelte:element>

<style>
	.kit-accordion {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		width: 100%;
		padding: 0;
		list-style: none;
		position: relative;
		gap: var(--kit-accordion-gap, 0);
		border: 0;
		box-sizing: border-box;
		transition:
			background 140ms ease,
			color 140ms ease,
			box-shadow 140ms ease,
			translate 140ms ease;
	}

	.kit-accordion[data-spacer='true'] {
		--kit-accordion-gap: 0.5rem;
	}

	.kit-accordion[data-spacer='true'] :global(.kit-accordion-item) {
		border-radius: var(--kit-accordion-item-radius);
	}

	.kit-accordion:not([data-spacer='true']) :global(.kit-accordion-item:first-child) {
		border-top-left-radius: var(--kit-accordion-item-radius);
		border-top-right-radius: var(--kit-accordion-item-radius);
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}

	.kit-accordion:not([data-spacer='true']) :global(.kit-accordion-item) {
		border-radius: 0;
	}

	.kit-accordion:not([data-spacer='true']) :global(.kit-accordion-item:last-child) {
		border-top-left-radius: 0;
		border-top-right-radius: 0;
		border-bottom-left-radius: var(--kit-accordion-item-radius);
		border-bottom-right-radius: var(--kit-accordion-item-radius);
	}

	.kit-accordion[data-hide-icon='true'] :global(.kit-accordion-item__indicator) {
		display: none;
	}

	/** 
	 * rounded
	 * @link ...
	 */
	.kit-accordion[data-rounded='0'] :global(.kit-accordion-item) {
		--kit-accordion-item-radius: var(--kit-shape-none);
	}
	.kit-accordion[data-rounded='xs'] :global(.kit-accordion-item) {
		--kit-accordion-item-radius: var(--kit-shape-xs);
	}
	.kit-accordion[data-rounded='sm'] :global(.kit-accordion-item) {
		--kit-accordion-item-radius: var(--kit-shape-sm);
	}
	.kit-accordion[data-rounded='md'] :global(.kit-accordion-item) {
		--kit-accordion-item-radius: var(--kit-shape-md);
	}
	.kit-accordion[data-rounded='lg'] :global(.kit-accordion-item) {
		--kit-accordion-item-radius: var(--kit-shape-lg);
	}
	.kit-accordion[data-rounded='xl'] :global(.kit-accordion-item) {
		--kit-accordion-item-radius: var(--kit-shape-xl);
	}
	.kit-accordion[data-rounded='full'] :global(.kit-accordion-item) {
		--kit-accordion-item-radius: var(--kit-shape-full);
	}

	/** 
	 * density
	 * @link no links
	 */
	.kit-accordion[data-density='compact'] {
		--kit-accordion-density-offset: var(--kit-density-compact);
	}
	.kit-accordion[data-density='default'] {
		--kit-accordion-density-offset: var(--kit-density-default);
	}
	.kit-accordion[data-density='comfortable'] {
		--kit-accordion-density-offset: var(--kit-density-comfortable);
	}

	/** 
	 * variant
	 * @link no links...
	 */
	.kit-accordion[data-variant='filled'] :global(.kit-accordion-item) {
		--kit-accordion-item-bg: var(--kit-color-surface-1);
		--kit-accordion-item-fg: var(--kit-color-text);

		--kit-accordion-item-hover-bg: color-mix(in oklab, var(--kit-accordion-item-bg), black 10%);
		--kit-accordion-item-active-bg: color-mix(in oklab, var(--kit-accordion-item-bg), black 16%);
	}
	.kit-accordion[data-variant='outline'] :global(.kit-accordion-item) {
		--kit-accordion-item-bg: transparent;
		--kit-accordion-item-fg: var(--kit-color-text);
		--kit-accordion-item-bd: var(--kit-accordion-item-fg);

		--kit-accordion-item-hover-bg: color-mix(
			in oklab,
			var(--kit-accordion-item-fg),
			transparent 80%
		);
		--kit-accordion-item-active-bg: color-mix(
			in oklab,
			var(--kit-accordion-item-fg),
			transparent 92%
		);
	}
	.kit-accordion[data-variant='text'] :global(.kit-accordion-item) {
		--kit-accordion-item-bg: transparent;
		--kit-accordion-item-fg: var(--kit-color-text);

		--kit-accordion-item-hover-bg: color-mix(
			in oklab,
			var(--kit-accordion-item-fg),
			transparent 80%
		);
		--kit-accordion-item-active-bg: color-mix(
			in oklab,
			var(--kit-accordion-item-fg),
			transparent 92%
		);
	}

	.kit-accordion[data-variant='text'] :global(.kit-accordion-item .outline),
	.kit-accordion[data-variant='filled'] :global(.kit-accordion-item .outline) {
		display: none;
	}

	.kit-accordion[data-variant='filled']
		:global(.kit-accordion-item .kit-accordion-item__separator) {
		display: none;
	}

	/**
	* size
	* @link nothing...
	*/
	.kit-accordion[data-size='xs'] :global(.kit-accordion-item) {
		--kit-accordion-item-h: 32px;
		--kit-accordion-item-p: 8px;
		--kit-accordion-item-gap: var(--kit-space-compact);
		--kit-accordion-item-font: var(--kit-font-xs);
	}
	.kit-accordion[data-size='sm'] :global(.kit-accordion-item) {
		--kit-accordion-item-h: 40px;
		--kit-accordion-item-p: 10px;
		--kit-accordion-item-gap: var(--kit-space-default);
		--kit-accordion-item-font: var(--kit-font-sm);
	}
	.kit-accordion[data-size='md'] :global(.kit-accordion-item) {
		--kit-accordion-item-h: 48px;
		--kit-accordion-item-p: 12px;
		--kit-accordion-item-gap: var(--kit-space-default);
		--kit-accordion-item-font: var(--kit-font-md);
	}
	.kit-accordion[data-size='lg'] :global(.kit-accordion-item) {
		--kit-accordion-item-h: 56px;
		--kit-accordion-item-p: 16px;
		--kit-accordion-item-gap: var(--kit-space-default);
		--kit-accordion-item-font: var(--kit-font-lg);
	}
	.kit-accordion[data-size='xl'] :global(.kit-accordion-item) {
		--kit-accordion-item-h: 64px;
		--kit-accordion-item-p: 20px;
		--kit-accordion-item-gap: var(--kit-space-comfortable);
		--kit-accordion-item-font: var(--kit-font-xl);
	}
</style>
