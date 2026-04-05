<script lang="ts">
	import { useClassName, useStyles } from '$lib/utils';
	import { makeComponentProps } from '$lib/html-mapped';
	import type { AccordionItemModelProps, AccordionItemProps } from '../accordion.types.ts';

	let {
		ref = $bindable(),
		is = 'div',
		children = undefined,
		class: className = '',
		style: styleAttr = '',
		's-class': sClass,
		's-style': sStyle,
		activator = undefined,
		indicator = undefined,
		text = undefined,
		rounded = undefined,
		color = undefined,
		background = undefined,
		index,
		open = false,
		toggle = undefined,
		disabled = false,
		readOnly = false,
		...rest
	}: AccordionItemProps = $props();

	let { classProps, styleProps, restProps } = $derived(
		makeComponentProps(rest as Record<string, unknown>)
	);

	let componentClass = $derived(
		useClassName({
			baseClass: 'kit-accordion-item',
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
			color ? `--kit-accordion-item-fg:${color}` : '',
			background ? `--kit-accordion-item-bg:${background}` : ''
		]
			.filter(Boolean)
			.join('; ')
	);

	let safeOpen = $derived(!!open);
	let model: AccordionItemModelProps = {
		get open() {
			return safeOpen;
		}
	};

	function handleToggle() {
		if (readOnly || disabled || !toggle) return;
		toggle(index);
	}
</script>

<svelte:element
	this={is}
	bind:this={ref}
	class={componentClass}
	style={mergedStyle}
	{...restProps}
	data-open={safeOpen}
	data-disabled={disabled}
	data-rounded={rounded}
>
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

	<div class="kit-accordion-item__content" hidden={!safeOpen}>
		<div class="kit-accordion-item__content-inner">
			{@render children?.()}
		</div>
	</div>
</svelte:element>

<style>
	button {
		appearance: none;
		background: none;
		border: none;
		font: inherit;
		color: inherit;
	}

	.kit-accordion-item {
		--kit-accordion-item-radius: var(--kit-accordion-radius, 8px);
		--kit-accordion-item-fg: var(--kit-accordion-fg, var(--kit-fg));
		--kit-accordion-item-bg: var(--kit-surface-2);
		--kit-accordion-item-bd: color-mix(in oklab, var(--kit-accordion-item-bg), var(--kit-fg) 12%);
		--kit-accordion-item-trigger-y: 1rem;
		--kit-accordion-item-trigger-x: 1.25rem;

		flex: 1 0 100%;
		max-width: 100%;
		position: relative;
		border-radius: var(--kit-accordion-item-radius);
		background: var(--kit-accordion-item-bg);
		color: var(--kit-accordion-item-fg);
		border: 1px solid var(--kit-accordion-item-bd);
		transition:
			border-color 150ms ease,
			background 150ms ease,
			box-shadow 150ms ease;
		overflow: clip;
	}

	.kit-accordion-item[data-rounded='0'] {
		--kit-accordion-item-radius: 0;
	}

	.kit-accordion-item[data-rounded='xs'] {
		--kit-accordion-item-radius: 2px;
	}

	.kit-accordion-item[data-rounded='sm'] {
		--kit-accordion-item-radius: 4px;
	}

	.kit-accordion-item[data-rounded='md'] {
		--kit-accordion-item-radius: 8px;
	}

	.kit-accordion-item[data-rounded='lg'] {
		--kit-accordion-item-radius: 16px;
	}

	.kit-accordion-item[data-rounded='xl'] {
		--kit-accordion-item-radius: 99999px;
	}

	.kit-accordion-item[data-open='true'] {
		box-shadow: 0 10px 28px color-mix(in oklab, var(--kit-fg), transparent 90%);
	}

	.kit-accordion-item__trigger {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: var(--kit-accordion-item-trigger-y) var(--kit-accordion-item-trigger-x);
		cursor: pointer;
		text-align: left;
	}

	.kit-accordion-item__trigger:disabled,
	.kit-accordion-item[data-disabled='true'] .kit-accordion-item__trigger {
		cursor: not-allowed;
		opacity: 0.6;
	}

	.kit-accordion-item__title {
		flex: 1 1 auto;
		min-width: 0;
	}

	.kit-accordion-item__indicator {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: 0 0 auto;
	}

	.kit-accordion-item__indicator svg {
		width: 1.125rem;
		height: 1.125rem;
		display: block;
	}

	.kit-accordion-item__content {
		display: block;
	}

	.kit-accordion-item__content[hidden] {
		display: none;
	}

	.kit-accordion-item__content-inner {
		padding: 0 1.25rem 1rem;
	}
</style>
