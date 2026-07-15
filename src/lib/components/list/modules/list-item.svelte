<script lang="ts">
	import { ripple } from '$lib/animations';
	import { makeComponentProps } from '$lib/html-mapped';
	import { useClassName, useIsInteractive, useStyles } from '$lib/utils';
	import type { ListItemProps } from '../list.types.ts';

	let {
		ref = $bindable(),
		is = 'div',
		children = undefined,
		class: className = '',
		style: styleAttr = '',
		's-class': sClass,
		's-style': sStyle,
		append = undefined,
		prepend = undefined,
		href = undefined,
		color = undefined,
		background = undefined,
		interactive = false,
		active = false,
		disabled = false,
		noRipple = false,
		...rest
	}: ListItemProps = $props();

	let { classProps, styleProps, restProps } = $derived(
		makeComponentProps(rest as Record<string, unknown>)
	);

	let tag = $derived(href ? 'a' : is === 'div' && restProps.onclick ? 'button' : is);
	// let isInteractive = $derived(tag !== 'div' && tag !== 'li' && !disabled);
	let isInteractive = $derived(useIsInteractive(rest, tag, ['a', 'button'], interactive));

	let componentClass = $derived(
		useClassName({
			baseClass: 'kit-list-item',
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
			color ? `--kit-list-item-fg:${color && `var(--kit-color-${color})`}` : '',
			background ? `--kit-list-item-bg:${background && `var(--kit-color-${background})`}` : ''
		]
			.filter(Boolean)
			.join('; ')
	);
</script>

<svelte:element
	this={tag}
	bind:this={ref}
	class={componentClass}
	style={resolvedStyle}
	href={href && !disabled ? href : undefined}
	data-active={active}
	data-disabled={disabled}
	aria-disabled={disabled || undefined}
	disabled={tag === 'button' ? disabled : undefined}
	tabindex={href && disabled ? -1 : undefined}
	role={tag === 'div' ? 'listitem' : undefined}
	data-append={append && true}
	data-prepend={prepend && true}
	data-interactive={isInteractive}
	use:ripple={{
		component: 'list-item',
		disabled: noRipple || !isInteractive
	}}
	{...restProps}
>
	<span class="outline"></span>
	{#if prepend}
		<span class="kit-list-item__prepend">
			{@render prepend?.()}
		</span>
	{/if}

	<span class="kit-list-item__content">
		{@render children?.()}
	</span>

	{#if append}
		<span class="kit-list-item__append">
			{@render append?.()}
		</span>
	{/if}
</svelte:element>

<style>
	.kit-list-item {
		width: 100%;
		min-height: calc(var(--kit-list-item-h) * var(--kit-list-density-h-scale));
		position: relative;
		display: grid;
		grid-template-columns: 1fr;
		align-items: center;
		gap: var(--kit-list-item-gap);
		border-radius: var(--kit-list-item-radius);
		border: 0;
		background: var(--kit-list-item-bg);
		color: var(--kit-list-item-fg);
		text-decoration: none;
		font-size: var(--kit-list-item-font);
	}

	.kit-list-item .kit-list-item__prepend,
	.kit-list-item:not([data-prepend='true']) .kit-list-item__content {
		margin-left: calc(var(--kit-list-item-px) * var(--kit-list-density-scale));
	}
	.kit-list-item .kit-list-item__append,
	.kit-list-item:not([data-append='true']) .kit-list-item__content {
		margin-right: calc(var(--kit-list-item-px) * var(--kit-list-density-scale));
	}
	.kit-list-item:not([data-prepend='true']):not([data-append='true']) .kit-list-item__content {
		margin-left: calc(var(--kit-list-item-px) * var(--kit-list-density-scale));
		margin-right: calc(var(--kit-list-item-px) * var(--kit-list-density-scale));
	}

	.kit-list-item[data-prepend='true']:not([data-append='true']) {
		grid-template-columns: auto minmax(0, 1fr);
	}
	.kit-list-item[data-append='true']:not([data-prepend='true']) {
		grid-template-columns: minmax(0, 1fr) auto;
	}
	.kit-list-item[data-append='true'][data-prepend='true'] {
		grid-template-columns: auto minmax(0, 1fr) auto;
	}

	a.kit-list-item {
		text-decoration: none;
	}

	button.kit-list-item {
		appearance: none;
		border: 0;
		font: inherit;
		text-align: inherit;
	}

	.kit-list-item[data-interactive='true'][data-disabled='false'] {
		cursor: pointer;
	}

	.kit-list-item[data-interactive='true'][data-disabled='false']:hover {
		translate: 0 -1px;
		background: var(--kit-list-item-hover-bg);
	}
	.kit-list-item[data-active='true'][data-disabled='false'] {
		translate: 0 0;
		background: var(--kit-list-item-active-bg);
	}
	.kit-list-item[data-interactive='true'][data-disabled='false']:active {
		translate: 0 0;
		background: var(--kit-list-item-active-bg);
	}

	.kit-list-item[data-interactive='true'][data-disabled='false']:focus-visible {
		outline: 2px solid var(--kit-focus);
		outline-offset: 2px;
	}

	.kit-list-item[data-disabled='true'] {
		opacity: var(--kit-disabled-opacity, 0.55);
		pointer-events: none;
	}

	.kit-list-item__prepend,
	.kit-list-item__append,
	.kit-list-item__content {
		display: inline-flex;
		align-items: center;
		min-width: 0;
	}

	.kit-list-item__content {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.kit-list-item .outline {
		--outline-color: var(--kit-list-item-bd);
	}

	/** 
	 * rounded
	 * @link ...
	 */
	.kit-list-item[data-rounded='0'] {
		--kit-list-item-radius: var(--kit-shape-none);
	}
	.kit-list-item[data-rounded='xs'] {
		--kit-list-item-radius: var(--kit-shape-xs);
	}
	.kit-list-item[data-rounded='sm'] {
		--kit-list-item-radius: var(--kit-shape-sm);
	}
	.kit-list-item[data-rounded='md'] {
		--kit-list-item-radius: var(--kit-shape-md);
	}
	.kit-list-item[data-rounded='lg'] {
		--kit-list-item-radius: var(--kit-shape-lg);
	}
	.kit-list-item[data-rounded='xl'] {
		--kit-list-item-radius: var(--kit-shape-xl);
	}
	.kit-list-item[data-rounded='full'] {
		--kit-list-item-radius: var(--kit-shape-full);
	}
</style>
