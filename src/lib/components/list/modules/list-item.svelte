<script lang="ts">
	import { ripple } from '$lib/animations';
	import { useComponentAttrs, useIsInteractive } from '$lib/utils';
	import { getListContext } from '../list.context.ts';
	import type { ListItemProps } from '../list.types.ts';

	let {
		ref = $bindable(),
		is,
		children = undefined,
		class: className,
		style: styleAttr,
		's-class': sClass,
		's-style': sStyle,
		append = undefined,
		prepend = undefined,
		href = undefined,
		color = undefined,
		interactive,
		active = false,
		disabled = false,
		noRipple = false,
		...rest
	}: ListItemProps = $props();

	let attrs = $derived(
		useComponentAttrs(
			'kit-list-item',
			{ className, sClass, styleAttr, sStyle, color, active },
			rest
		)
	);
	const list = getListContext();

	let tag = $derived(
		href
			? 'a'
			: (is ?? 'div') === 'div' && typeof attrs.rest.onclick === 'function'
				? 'button'
				: (is ?? (list?.item === 'li' ? 'li' : 'div'))
	);
	let isInteractive = $derived(interactive ?? useIsInteractive(rest, tag, ['a', 'button']));
	let wrapperTag = $derived.by(() => {
		if (list?.item === 'li') return tag === 'li' ? undefined : 'li';
		if (list?.item === 'listitem') return tag === 'a' || tag === 'button' ? 'div' : undefined;
		return undefined;
	});
</script>

{#snippet item()}
	<svelte:element
		this={tag}
		bind:this={ref}
		class={attrs.class}
		style={attrs.style}
		href={href && !disabled ? href : undefined}
		type={tag === 'button' ? 'button' : undefined}
		disabled={tag === 'button' ? disabled : undefined}
		tabindex={href && disabled ? -1 : undefined}
		role={tag === 'div' && list?.item === 'listitem' ? 'listitem' : undefined}
		data-active={active}
		data-disabled={disabled}
		data-interactive={isInteractive}
		aria-disabled={disabled || undefined}
		use:ripple={{
			component: 'list-item',
			disabled: noRipple || disabled || !isInteractive
		}}
		{...attrs.rest}
	>
		{#if prepend}
			<span class="kit-list-item__prepend">{@render prepend()}</span>
		{/if}

		<span class="kit-list-item__content">{@render children?.()}</span>

		{#if append}
			<span class="kit-list-item__append">{@render append()}</span>
		{/if}
	</svelte:element>
{/snippet}

{#if wrapperTag}
	<svelte:element
		this={wrapperTag}
		class="kit-list-item-wrapper"
		role={wrapperTag === 'div' ? 'listitem' : undefined}
	>
		{@render item()}
	</svelte:element>
{:else}
	{@render item()}
{/if}

<style lang="scss">
	@use '$lib/styles' as *;

	:where(.kit-list-item) {
		@include color(kit-list-item, var(--kit-color-surface-2), var(--kit-color-text));

		// the color of the list, when the item has none
		--kit-list-item-color: var(--kit-list-color);
		--kit-list-item-on-color: var(--kit-list-on-color);
	}

	.kit-list-item-wrapper {
		display: contents;
	}

	.kit-list-item {
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--kit-list-item-gap);
		box-sizing: border-box;
		width: 100%;
		min-height: calc(var(--kit-list-item-h) + var(--kit-list-density-offset) / 2);
		padding-inline: calc(var(--kit-list-item-p) + var(--kit-list-density-offset) / 2);
		border: 0;
		background-color: var(--kit-list-item-bg);
		color: var(--kit-list-item-fg);
		font-size: var(--kit-list-item-font);
		text-decoration: none;
		@include color-transition((background-color, color));
	}

	a.kit-list-item {
		text-decoration: none;
	}

	button.kit-list-item {
		appearance: none;
		font: inherit;
		text-align: inherit;
	}

	.kit-list-item__prepend,
	.kit-list-item__append,
	.kit-list-item__content {
		display: inline-flex;
		flex: none;
		align-items: center;
		min-width: 0;
	}

	.kit-list-item__content {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	// (0,2,0): wins over the variant of the list
	.kit-list-item[data-active='true'] {
		@include color-active(kit-list-item);
	}

	@include interactive(kit-list-item);
</style>
