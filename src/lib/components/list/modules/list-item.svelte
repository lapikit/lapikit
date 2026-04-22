<script lang="ts">
	import { ripple } from '$lib/animations';
	import { makeComponentProps } from '$lib/html-mapped';
	import { useClassName, useStyles } from '$lib/utils';
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
		rounded = 'sm',
		active = false,
		disabled = false,
		noRipple = false,
		...rest
	}: ListItemProps = $props();

	let { classProps, styleProps, restProps } = $derived(
		makeComponentProps(rest as Record<string, unknown>)
	);

	let tag = $derived(href ? 'a' : is === 'div' && restProps.onclick ? 'button' : is);
	let isInteractive = $derived(tag !== 'div' && tag !== 'li' && !disabled);

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

	let mergedStyle = $derived(
		[
			componentStyle,
			color ? `--kit-list-item-fg:${color}` : '',
			background ? `--kit-list-item-bg:${background}` : ''
		]
			.filter(Boolean)
			.join('; ')
	);
</script>

<svelte:element
	this={tag}
	bind:this={ref}
	class={componentClass}
	style={mergedStyle}
	href={href && !disabled ? href : undefined}
	data-active={active}
	data-disabled={disabled}
	data-rounded={rounded}
	aria-disabled={disabled || undefined}
	disabled={tag === 'button' ? disabled : undefined}
	tabindex={href && disabled ? -1 : undefined}
	role={tag === 'div' ? 'listitem' : undefined}
	use:ripple={{
		component: 'list-item',
		disabled: noRipple || !isInteractive
	}}
	{...restProps}
>
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
		--kit-list-item-bg: transparent;
		--kit-list-item-fg: inherit;
		--kit-list-item-radius: 8px;

		position: relative;
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		align-items: center;
		gap: var(--kit-list-item-gap, 0.625rem);
		min-height: calc(var(--kit-list-item-h, 2.75rem) + var(--kit-list-density-offset, 0rem));
		padding-inline: var(--kit-list-item-px, 0.875rem);
		border: 0;
		border-radius: var(--kit-list-item-radius);
		background: var(--kit-list-item-bg);
		color: var(--kit-list-item-fg);
		text-decoration: none;
		font: inherit;
		font-size: var(--kit-list-item-font, 0.9375rem);
		text-align: left;
	}

	.kit-list-item[data-rounded='0'] {
		--kit-list-item-radius: 0;
	}

	.kit-list-item[data-rounded='xs'] {
		--kit-list-item-radius: 2px;
	}

	.kit-list-item[data-rounded='sm'] {
		--kit-list-item-radius: 8px;
	}

	.kit-list-item[data-rounded='md'] {
		--kit-list-item-radius: 12px;
	}

	.kit-list-item[data-rounded='lg'] {
		--kit-list-item-radius: 16px;
	}

	.kit-list-item[data-rounded='xl'] {
		--kit-list-item-radius: 9999px;
	}

	:global(.kit-list[data-variant='filled']) .kit-list-item {
		background: var(--kit-list-item-bg, transparent);
	}

	:global(.kit-list[data-variant='filled']) .kit-list-item[data-active='true'] {
		background: color-mix(in oklab, currentColor 12%, transparent);
	}

	:global(.kit-list[data-variant='outline']) .kit-list-item::before {
		content: '';
		position: absolute;
		inset: 0;
		border: 1px solid color-mix(in oklab, currentColor 16%, transparent);
		border-radius: inherit;
		pointer-events: none;
	}

	.kit-list-item[data-active='true'] {
		background: color-mix(in oklab, currentColor 12%, transparent);
	}

	.kit-list-item[data-disabled='true'] {
		opacity: 0.45;
		pointer-events: none;
	}

	.kit-list-item:is(button, a) {
		cursor: pointer;
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

	.kit-list-item:is(button, a):hover::after,
	.kit-list-item:is(button, a):focus-visible::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		background: currentColor;
		opacity: 0.06;
		pointer-events: none;
	}
</style>
