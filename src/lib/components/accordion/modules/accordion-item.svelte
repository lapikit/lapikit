<script lang="ts">
	import { useClassName, useElevation, useStyles } from '$lib/utils';
	import { makeComponentProps } from '$lib/html-mapped';
	import type { AccordionItemModelProps, AccordionItemProps } from '../accordion.types.ts';

	let {
		ref = $bindable(),
		is = 'div',
		children,
		class: className = '',
		style: styleAttr = '',
		's-class': sClass,
		's-style': sStyle,
		activator,
		indicator,
		text,
		color,
		background,
		index,
		open,
		toggle,
		disabled = false,
		readOnly = false,
		elevation,
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
	data-disabled={disabled}
	data-read-only={readOnly}
	data-active={safeOpen}
	data-elevation={elevationState.base}
	data-elevation-hover={elevationState.hover}
	data-elevation-active={elevationState.active}
	{...restProps}
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

<style>
	.kit-accordion-item {
		flex: 1 0 100%;
		max-width: 100%;
		position: relative;
		border: 0;
		box-sizing: border-box;
		background: var(--kit-accordion-item-bg);
		color: var(--kit-accordion-item-fg);
		gap: var(--kit-accordion-item-gap);
		text-decoration: none;
		font-size: var(--kit-accordion-item-font);
		overflow: clip;
	}

	.kit-accordion-item > button {
		appearance: none;
		border: 0;
		font: inherit;
		text-align: inherit;
	}

	.kit-accordion-item__trigger {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--kit-accordion-item-gap);
		min-height: calc(var(--kit-accordion-item-h) + var(--kit-accordion-density-offset) / 2);
		padding: calc(var(--kit-accordion-item-p) + var(--kit-accordion-density-offset) / 2);
		cursor: pointer;
		text-align: left;
		background: var(--kit-accordion-item-bg);
		color: var(--kit-accordion-item-fg);
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
		padding: calc(var(--kit-accordion-item-p) + var(--kit-accordion-density-offset) / 2);
	}

	.kit-accordion-item__separator {
		width: 96%;
		height: 1px;
		display: block;
		position: relative;
		background: var(--kit-accordion-item-fg);
		margin: 0 auto;
	}

	.kit-accordion-item[data-read-only='false'][data-disabled='false'] > button:hover {
		background: var(--kit-accordion-item-hover-bg);
	}

	/**I think is a good idea for not use this*/
	/* .kit-accordion-item[data-active='true'][data-disabled='false'][data-read-only='false'] > button {
		background: var(--kit-accordion-item-active-bg);
	}
	.kit-accordion-item[data-disabled='false'][data-read-only='false'] > button:active {
		background: var(--kit-accordion-item-active-bg);
	} */

	.kit-accordion-item[data-disabled='false'][data-read-only='false'] > button:focus-visible {
		outline: 2px solid var(--kit-color-focus);
		outline-offset: 2px;
	}

	.kit-accordion-item .outline {
		--outline-color: var(--kit-accordion-item-bd);
	}
</style>
