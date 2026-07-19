<script lang="ts">
	import { useClassName, useElevation, useStyles } from '$lib/utils';
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
		elevation,
		...rest
	}: AlertProps = $props();

	let { classProps, styleProps, restProps } = $derived(
		makeComponentProps(rest as Record<string, unknown>)
	);

	let elevationState = $derived(useElevation(elevation));

	let componentClass = $derived(
		useClassName({
			baseClass: 'kit-alert',
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
			color ? `--kit-alert-fg:${color && `var(--kit-color-${color})`}` : '',
			background ? `--kit-alert-bg:${background && `var(--kit-color-${background})`}` : ''
		]
			.filter(Boolean)
			.join('; ')
	);
</script>

{#if !closable || (closable && open)}
	<svelte:element
		this={is}
		bind:this={ref}
		class={componentClass}
		style={resolvedStyle}
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
		data-elevation={elevationState.base}
		data-elevation-hover={elevationState.hover}
		data-elevation-active={elevationState.active}
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
		min-height: calc(var(--kit-alert-item-h) + var(--kit-alert-density-offset) / 2);
		padding: calc(var(--kit-alert-p) + var(--kit-alert-density-offset) / 2);
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
	.kit-alert[data-density='compact'] {
		--kit-alert-density-offset: var(--kit-density-compact);
	}
	.kit-alert[data-density='default'] {
		--kit-alert-density-offset: var(--kit-density-default);
	}
	.kit-alert[data-density='comfortable'] {
		--kit-alert-density-offset: var(--kit-density-comfortable);
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
		--kit-alert-h: 32px;
		--kit-alert-p: 8px;
		--kit-alert-gap: var(--kit-space-compact);
		--kit-alert-font: var(--kit-font-xs);
	}
	.kit-alert[data-size='sm'] {
		--kit-alert-h: 40px;
		--kit-alert-p: 10px;
		--kit-alert-gap: var(--kit-space-default);
		--kit-alert-font: var(--kit-font-sm);
	}
	.kit-alert[data-size='md'] {
		--kit-alert-h: 48px;
		--kit-alert-p: 12px;
		--kit-alert-gap: var(--kit-space-default);
		--kit-alert-font: var(--kit-font-md);
	}
	.kit-alert[data-size='lg'] {
		--kit-alert-h: 56px;
		--kit-alert-p: 16px;
		--kit-alert-gap: var(--kit-space-default);
		--kit-alert-font: var(--kit-font-lg);
	}
	.kit-alert[data-size='xl'] {
		--kit-alert-h: 64px;
		--kit-alert-p: 20px;
		--kit-alert-gap: var(--kit-space-comfortable);
		--kit-alert-font: var(--kit-font-xl);
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
