<script lang="ts">
	import { useClassName, useStyles } from '$lib/utils';
	import { makeComponentProps } from '$lib/html-mapped';
	import type { AlertProps } from './alert.types.ts';

	let {
		ref = $bindable(),
		is = 'div',
		children,
		class: className = '',
		style: styleAttr = '',
		's-class': sClass,
		's-style': sStyle,
		open = $bindable(true),
		closable,
		size = 'md',
		variant = 'filled',
		density = 'default',
		rounded = 'md',
		tone = 'default',
		color,
		background,
		prepend,
		append,
		close,
		multiline,
		...rest
	}: AlertProps = $props();

	let { classProps, styleProps, restProps } = $derived(
		makeComponentProps(rest as Record<string, unknown>)
	);

	let componentClass = $derived(
		useClassName({
			baseClass: 'kit-alert',
			className: `${className ?? ''}`.trim(),
			sClass,
			classProps
		})
	);

	let baseStyle = $derived(
		useStyles({
			styleAttr,
			sStyle,
			styleProps
		})
	);

	let mergedStyle = $derived([baseStyle].filter(Boolean).join('; '));
</script>

{#if !closable || (closable && open)}
	<svelte:element
		this={is}
		bind:this={ref}
		class={componentClass}
		style={mergedStyle}
		role="alert"
		data-size={size}
		data-variant={variant}
		data-density={density}
		data-rounded={rounded}
		data-tone={tone}
		data-mutline={multiline}
		data-append={append && true}
		data-prepend={prepend && true}
		data-closable={closable && true}
		style:--kit-alert-fg={color && `var(--kit-color-${color})`}
		style:--kit-alert-bg={background && `var(--kit-color-${background})`}
		{...restProps}
	>
		{#if variant === 'outline'}
			<span class="outline"></span>
		{/if}

		{#if prepend}
			<span class="kit-alert__prepend">
				{@render prepend?.()}
			</span>
		{/if}

		<div class="kit-alert__content">
			{@render children?.()}
		</div>

		{#if append}
			<span class="kit-alert__append">
				{@render append?.()}
			</span>
		{/if}

		{#if closable}
			<button
				class="kit-alert__close"
				type="button"
				aria-label="close"
				onclick={() => (open = false)}
			>
				{#if close}
					{@render close?.()}
				{:else}
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<path
							d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
							fill="currentColor"
						></path>
					</svg>
				{/if}
			</button>
		{/if}
	</svelte:element>
{/if}

<style>
	.kit-alert {
		position: relative;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--kit-alert-gap);
		padding: calc(var(--kit-alert-px) * var(--kit-alert-density-scale));
		border-radius: var(--kit-alert-radius);
		color: var(--kit-alert-fg);
		background: var(--kit-alert-bg);
		font-size: var(--kit-alert-font);
		border: 0;
	}

	.kit-alert[data-mutline='true'] .kit-alert__prepend,
	.kit-alert[data-mutline='true'] .kit-alert__content,
	.kit-alert[data-mutline='true'] .kit-alert__append,
	.kit-alert[data-mutline='true'] .kit-alert__close {
		display: flex;
		align-items: start;
	}

	.kit-alert:not([data-mutline='true']) .kit-alert__prepend,
	.kit-alert:not([data-mutline='true']) .kit-alert__content,
	.kit-alert:not([data-mutline='true']) .kit-alert__append,
	.kit-alert:not([data-mutline='true']) .kit-alert__close {
		display: flex;
		align-items: center;
	}

	.kit-alert__close svg {
		width: 1.125rem;
		height: 1.125rem;
		display: block;
	}

	.kit-alert[data-prepend='true']:not([data-append='true']):not([data-closable='true']) {
		grid-template-columns: auto minmax(0, 1fr);
	}
	.kit-alert[data-append='true']:not([data-prepend='true']):not([data-closable='true']),
	.kit-alert[data-closable='true']:not([data-prepend='true']):not([data-append='true']) {
		grid-template-columns: minmax(0, 1fr) auto;
	}

	.kit-alert[data-append='true']:not([data-prepend='true']):not([data-closable='true']) {
		grid-template-columns: minmax(0, 1fr) auto;
	}
	.kit-alert[data-prepend='true'][data-closable='true']:not([data-append='true']),
	.kit-alert[data-prepend='true'][data-append='true']:not([data-closable='true']) {
		grid-template-columns: auto minmax(0, 1fr) auto;
	}
	.kit-alert[data-append='true'][data-closable='true']:not([data-prepend='true']) {
		grid-template-columns: minmax(0, 1fr) auto auto;
	}
	.kit-alert[data-prepend='true'][data-append='true'][data-closable='true'] {
		grid-template-columns: auto minmax(0, 1fr) auto auto;
	}

	/** 
	 * rounded
	 * @link ...
	 */
	.kit-alert[data-rounded='0'] {
		--kit-alert-radius: var(--kit-shape-none);
	}
	.kit-alert[data-rounded='xs'] {
		--kit-alert-radius: var(--kit-shape-xs);
	}
	.kit-alert[data-rounded='sm'] {
		--kit-alert-radius: var(--kit-shape-sm);
	}
	.kit-alert[data-rounded='md'] {
		--kit-alert-radius: var(--kit-shape-md);
	}
	.kit-alert[data-rounded='lg'] {
		--kit-alert-radius: var(--kit-shape-lg);
	}
	.kit-alert[data-rounded='xl'] {
		--kit-alert-radius: var(--kit-shape-xl);
	}
	.kit-alert[data-rounded='full'] {
		--kit-alert-radius: var(--kit-shape-full);
	}

	/** 
	 * density
	 * @link no links
	 */
	.kit-alert[data-density='none'] {
		--kit-alert-density-scale: 0;
		--kit-alert-density-h-scale: 0;
	}
	.kit-alert[data-density='compact'] {
		--kit-alert-density-scale: 0.9;
		--kit-alert-density-h-scale: 0.92;
	}
	.kit-alert[data-density='default'] {
		--kit-alert-density-scale: 1;
		--kit-alert-density-h-scale: 1;
	}
	.kit-alert[data-density='comfortable'] {
		--kit-alert-density-scale: 1.1;
		--kit-alert-density-h-scale: 1.15;
	}

	/** 
	 * variant
	 * @link no links...
	 */
	.kit-alert[data-variant='filled'] {
		--kit-alert-bg: var(--kit-color-surface-2);
		--kit-alert-fg: var(--kit-color-text);

		--kit-alert-hover-bg: color-mix(in oklab, var(--kit-alert-bg), black 10%);
		--kit-alert-active-bg: color-mix(in oklab, var(--kit-alert-bg), black 16%);
	}
	.kit-alert[data-variant='outline'] {
		--kit-alert-bg: transparent;
		--kit-alert-fg: var(--kit-color-text);
		--kit-alert-bd: var(--kit-alert-fg);

		--kit-alert-hover-bg: color-mix(in oklab, var(--kit-alert-fg), transparent 80%);
		--kit-alert-active-bg: color-mix(in oklab, var(--kit-alert-fg), transparent 92%);
	}
	.kit-alert[data-variant='text'] {
		--kit-alert-bg: transparent;
		--kit-alert-fg: var(--kit-color-text);

		--kit-alert-hover-bg: color-mix(in oklab, var(--kit-alert-fg), transparent 80%);
		--kit-alert-active-bg: color-mix(in oklab, var(--kit-alert-fg), transparent 92%);
	}

	/**
	* size
	* @link nothing...
	*/
	.kit-alert[data-size='xs'] {
		--kit-alert-px: 10px;
		--kit-alert-gap: 4px;
		--kit-alert-font: 0.75rem;
	}
	.kit-alert[data-size='sm'] {
		--kit-alert-px: 12px;
		--kit-alert-gap: 6px;
		--kit-alert-font: 0.875rem;
	}
	.kit-alert[data-size='md'] {
		--kit-alert-px: 16px;
		--kit-alert-gap: 8px;
		--kit-alert-font: 1rem;
	}
	.kit-alert[data-size='lg'] {
		--kit-alert-px: 20px;
		--kit-alert-gap: 10px;
		--kit-alert-font: 1.125rem;
	}
	.kit-alert[data-size='xl'] {
		--kit-alert-px: 24px;
		--kit-alert-gap: 12px;
		--kit-alert-font: 1.25rem;
	}

	/**
	* tone
	* @link nothing...
	*/
	.kit-alert[data-tone='info'][data-variant='filled'] {
		--kit-alert-bg: var(--kit-color-info);
		--kit-alert-fg: var(--kit-color-on-info);
	}
	.kit-alert[data-tone='info'][data-variant='outline'],
	.kit-alert[data-tone='info'][data-variant='text'] {
		--kit-alert-fg: var(--kit-color-info);
	}

	.kit-alert[data-tone='success'][data-variant='filled'] {
		--kit-alert-bg: var(--kit-color-success);
		--kit-alert-fg: var(--kit-color-on-success);
	}
	.kit-alert[data-tone='success'][data-variant='outline'],
	.kit-alert[data-tone='success'][data-variant='text'] {
		--kit-alert-fg: var(--kit-color-success);
	}

	.kit-alert[data-tone='warning'][data-variant='filled'] {
		--kit-alert-bg: var(--kit-color-warning);
		--kit-alert-fg: var(--kit-color-on-warning);
	}
	.kit-alert[data-tone='warning'][data-variant='outline'],
	.kit-alert[data-tone='warning'][data-variant='text'] {
		--kit-alert-fg: var(--kit-color-warning);
	}

	.kit-alert[data-tone='error'][data-variant='filled'] {
		--kit-alert-bg: var(--kit-color-error);
		--kit-alert-fg: var(--kit-color-on-error);
	}
	.kit-alert[data-tone='error'][data-variant='outline'],
	.kit-alert[data-tone='error'][data-variant='text'] {
		--kit-alert-fg: var(--kit-color-error);
	}

	.kit-alert__prepend,
	.kit-alert__append {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		line-height: 1;
	}

	.kit-alert__content {
		min-width: 0;
		line-height: 1.4;
	}

	.kit-alert__close {
		appearance: none;
		border: 0;
		background: transparent;
		color: inherit;
		padding: 0;
		width: 1.25rem;
		height: 1.25rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		border-radius: 6px;
	}

	.kit-alert .outline {
		--outline-color: var(--kit-alert-bd);
	}

	.kit-alert__close:hover {
		background: color-mix(in oklab, currentColor 10%, transparent);
		border-radius: 9999px;
	}
</style>
