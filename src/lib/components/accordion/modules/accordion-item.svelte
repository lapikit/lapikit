<script lang="ts">
	import { useComponentAttrs, useElevation } from '$lib/utils';
	import type { AccordionItemModelProps, AccordionItemProps } from '../accordion.types.ts';

	let {
		ref = $bindable(),
		is = 'div',
		children,
		class: className,
		style: styleAttr,
		's-class': sClass,
		's-style': sStyle,
		activator,
		indicator,
		text,
		color,
		index,
		open,
		toggle,
		disabled = false,
		readOnly = false,
		elevation,
		...rest
	}: AccordionItemProps = $props();

	let attrs = $derived(
		useComponentAttrs('kit-accordion-item', { className, sClass, styleAttr, sStyle, color }, rest)
	);

	let safeOpen = $derived(!!open);
	let model: AccordionItemModelProps = {
		get open() {
			return safeOpen;
		}
	};

	let elevationState = $derived(useElevation(elevation));

	function handleToggle() {
		if (readOnly || disabled || !toggle) return;
		toggle(index);
	}
</script>

<svelte:element
	this={is}
	bind:this={ref}
	class={attrs.class}
	style={attrs.style}
	data-disabled={disabled}
	data-read-only={readOnly}
	data-active={safeOpen}
	data-elevation={elevationState.base}
	data-elevation-hover={elevationState.hover}
	data-elevation-active={elevationState.active}
	{...attrs.rest}
>
	<span class="outline"></span>

	<button
		class="kit-accordion-item__trigger"
		type="button"
		onclick={handleToggle}
		aria-expanded={safeOpen}
		aria-disabled={disabled || readOnly || undefined}
		{disabled}
	>
		<span class="kit-accordion-item__title">
			{#if activator}
				{@render activator?.()}
			{:else}
				{text}
			{/if}
		</span>

		<span class="kit-accordion-item__indicator">
			{#if indicator}
				{@render indicator?.(model)}
			{:else}
				<svg viewBox="0 0 24 24" aria-hidden="true">
					{#if safeOpen}
						<path d="M7.41 14.59 12 10l4.59 4.59L18 13.17l-6-6-6 6z" fill="currentColor"></path>
					{:else}
						<path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z" fill="currentColor"></path>
					{/if}
				</svg>
			{/if}
		</span>
	</button>

	<span class="kit-accordion-item__separator"></span>

	<div class="kit-accordion-item__content" hidden={!safeOpen}>
		<div class="kit-accordion-item__content-inner">
			{@render children?.()}
		</div>
	</div>
</svelte:element>

<style lang="scss">
	@use '$lib/styles' as *;

	:where(.kit-accordion-item) {
		@include color(kit-accordion-item, var(--kit-color-surface-1), var(--kit-color-text));

		// the color of the accordion, when the item has none
		--kit-accordion-item-color: var(--kit-accordion-color);
		--kit-accordion-item-on-color: var(--kit-accordion-on-color);
	}

	.kit-accordion-item {
		position: relative;
		flex: 1 0 100%;
		box-sizing: border-box;
		max-width: 100%;
		overflow: clip;
		border: 0;
		background-color: var(--kit-accordion-item-bg);
		color: var(--kit-accordion-item-fg);
		font-size: var(--kit-accordion-item-font);
		text-decoration: none;
		@include color-transition((background-color, color));
	}

	.kit-accordion-item__trigger {
		appearance: none;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--kit-accordion-item-gap);
		box-sizing: border-box;
		width: 100%;
		min-height: calc(var(--kit-accordion-item-h) + var(--kit-accordion-density-offset) / 2);
		padding: calc(var(--kit-accordion-item-p) + var(--kit-accordion-density-offset) / 2);
		border: 0;
		background: transparent;
		color: inherit;
		font: inherit;
		text-align: start;
		cursor: pointer;
		@include color-transition((background-color));

		&:disabled {
			cursor: not-allowed;
			opacity: var(--kit-disabled-opacity, 0.55);
		}

		&:focus-visible {
			outline: 2px solid var(--kit-color-focus);
			outline-offset: 2px;
		}
	}

	.kit-accordion-item[data-read-only='true'] .kit-accordion-item__trigger {
		cursor: default;
	}

	.kit-accordion-item__title {
		flex: 1 1 auto;
		min-width: 0;
	}

	.kit-accordion-item__indicator {
		display: inline-flex;
		flex: none;
		align-items: center;
		justify-content: center;

		svg {
			display: block;
			width: 1.125rem;
			height: 1.125rem;
		}
	}

	.kit-accordion-item__content[hidden] {
		display: none;
	}

	.kit-accordion-item__content-inner {
		padding: calc(var(--kit-accordion-item-p) + var(--kit-accordion-density-offset) / 2);
	}

	.kit-accordion-item__separator {
		display: block;
		width: 100%;
		height: var(--kit-outline-weight);
		background-color: color-mix(in oklab, var(--kit-accordion-item-fg) 20%, transparent);
	}

	:where(.kit-accordion-item .outline) {
		--outline-color: var(--kit-accordion-item-border);
	}
</style>
