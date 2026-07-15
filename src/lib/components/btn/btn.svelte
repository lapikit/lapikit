<script lang="ts">
	import { useClassName, useElevation, useStyles } from '$lib/utils';
	import { makeComponentProps } from '$lib/html-mapped';
	import { ripple } from '$lib/animations';
	import type { ButtonProps } from './btn.types.ts';

	let {
		ref = $bindable(),
		is = 'button',
		children,
		class: className = '',
		style: styleAttr = '',
		's-class': sClass,
		's-style': sStyle,
		variant = 'filled',
		density = 'default',
		loading,
		active = false,
		size = 'md',
		rounded = 'sm',
		disabled = false,
		block,
		href,
		input,
		type,
		checked,
		value,
		label,
		wide,
		noRipple,
		load,
		append,
		prepend,
		icon,
		elevation,
		color,
		background,
		...rest
	}: ButtonProps = $props();

	let { classProps, styleProps, restProps } = $derived(
		makeComponentProps(rest as Record<string, unknown>)
	);

	let elevationState = $derived(useElevation(elevation));

	let componentClass = $derived(
		useClassName({
			baseClass: 'kit-btn',
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

	const isInput = $derived(!!input);
	const isDisabled = $derived(!!disabled);
	const tag = $derived((href && 'a') || (isInput && 'input') || is || 'button');
	const inputWrapperTag = $derived(type === 'checkbox' || type === 'radio' ? 'label' : 'div');
	const resolvedHref = $derived(isDisabled ? undefined : href);
	const resolvedDisabled = $derived((tag === 'button' && isDisabled) || undefined);

	const resolvedType = $derived(() => {
		if (tag !== 'button') return type;
		return type ?? 'button';
	});

	let resolvedStyle = $derived(
		[
			componentStyle,
			color ? `--kit-btn-fg:${color && `var(--kit-color-${color})`}` : '',
			background ? `--kit-btn-bg:${background && `var(--kit-color-${background})`}` : ''
		]
			.filter(Boolean)
			.join('; ')
	);
</script>

{#if isInput}
	<svelte:element
		this={inputWrapperTag}
		bind:this={ref}
		class={componentClass}
		style={resolvedStyle}
		data-size={size}
		data-variant={variant}
		data-loading={loading}
		data-active={active}
		data-disabled={isDisabled}
		data-density={density}
		data-rounded={rounded}
		aria-busy={disabled}
		aria-disabled={isDisabled || undefined}
		data-block={block}
		data-wide={wide}
		data-icon={icon}
		data-elevation={elevationState.base}
		data-elevation-hover={elevationState.hover}
		data-elevation-active={elevationState.active}
		use:ripple={{
			component: 'btn',
			disabled: noRipple || disabled
		}}
	>
		{#if variant === 'outline'}
			<span class="outline"></span>
		{/if}
		<input
			{...restProps}
			type={type || 'button'}
			{checked}
			{value}
			aria-label={String(label || value)}
			disabled={isDisabled}
		/>
		{#if loading}
			<span class="spinner">...</span>
		{/if}
	</svelte:element>
{:else}
	<svelte:element
		this={tag}
		bind:this={ref}
		class={componentClass}
		style={resolvedStyle}
		type={resolvedType()}
		href={resolvedHref}
		data-size={size}
		data-variant={variant}
		data-loading={loading}
		data-active={active}
		data-disabled={isDisabled}
		data-density={density}
		data-rounded={rounded}
		disabled={resolvedDisabled}
		aria-busy={disabled}
		aria-disabled={isDisabled || undefined}
		data-block={block}
		data-wide={wide}
		data-icon={icon}
		data-elevation={elevationState.base}
		data-elevation-hover={elevationState.hover}
		data-elevation-active={elevationState.active}
		use:ripple={{
			component: 'btn',
			disabled: noRipple || disabled
		}}
		{...restProps}
	>
		{#if variant === 'outline'}
			<span class="outline"></span>
		{/if}

		<span class="kit-btn__inner">
			{#if prepend}
				<span class="kit-btn__prepend">
					{@render prepend?.()}
				</span>
			{/if}
			<span class="kit-btn__content">
				{@render children?.()}
			</span>
			{#if append}
				<span class="kit-btn__append">
					{@render append?.()}
				</span>
			{/if}
		</span>

		{#if loading}
			<span class="spinner">
				{#if load}
					{@render load?.()}
				{:else}
					...
				{/if}
			</span>
		{/if}
	</svelte:element>
{/if}

<style>
	input {
		border: 0;
		padding: 0;
		background: transparent;
		color: inherit;
		cursor: pointer;
	}
	/* typography consistency */
	button,
	input,
	select,
	textarea {
		font: inherit;
		color: inherit;
	}

	/* remove native button styles */
	button {
		appearance: none;
		background: none;
		border: none;
	}

	.kit-btn {
		position: relative;
		display: inline-flex;
		box-sizing: border-box;
		align-items: center;
		justify-content: center;
		font-family: var(--kit-font);
		background: var(--kit-btn-bg);
		color: var(--kit-btn-fg);
		height: calc(var(--kit-btn-h) * var(--kit-btn-density-h-scale));
		padding-inline: calc(var(--kit-btn-px) * var(--kit-btn-density-scale));
		border-radius: var(--kit-btn-radius);
		text-decoration: none;
		white-space: nowrap;
		user-select: none;
		cursor: pointer;
		border: 0;
		transition:
			background 150ms ease,
			transform 50ms ease;
	}

	.kit-btn:hover {
		background: var(--kit-btn-hover-bg);
		color: var(--kit-btn-fg);
		text-decoration: var(--kit-btn-decoration);
	}

	.kit-btn:has(> :is(input[type='checkbox'], input[type='radio']):checked) {
		background: var(--kit-btn-active-bg);
		color: var(--kit-btn-fg);
		text-decoration: var(--kit-btn-decoration);
	}

	.kit-btn:has(> :is(input[type='checkbox'], input[type='radio']):checked):hover {
		background: var(--kit-btn-hover-bg);
		color: var(--kit-btn-fg);
		text-decoration: var(--kit-btn-decoration);
	}

	.kit-btn:active,
	.kit-btn[data-active='true'] {
		background: var(--kit-btn-active-bg);
		color: var(--kit-btn-fg);
		text-decoration: var(--kit-btn-decoration);
		transform: translateY(1px);
	}

	.kit-btn[data-active='true']:hover {
		background: var(--kit-btn-hover-bg);
		color: var(--kit-btn-fg);
		text-decoration: var(--kit-btn-decoration);
	}

	:is(.kit-btn:focus-visible, .kit-btn:has(> input:focus-visible)) {
		outline: 2px solid var(--kit-focus);
		outline-offset: 2px;
	}

	.kit-btn > input:focus-visible {
		outline: none;
		box-shadow: none;
	}

	.kit-btn > :is(input[type='checkbox'], input[type='radio']) {
		appearance: none;
		margin: 0;
		cursor: pointer;
	}

	.kit-btn > :is(input[type='checkbox'], input[type='radio']):after {
		content: attr(aria-label);
		cursor: pointer;
	}

	.kit-btn[data-wide='true'] {
		width: 100%;
		max-width: 16rem;
	}

	.kit-btn__inner {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--kit-btn-gap);
		line-height: 1;
	}

	.kit-btn__content,
	.kit-btn__prepend,
	.kit-btn__append {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		line-height: 1;
	}

	.kit-btn__content :global(.kit-icon),
	.kit-btn__prepend :global(.kit-icon),
	.kit-btn__append :global(.kit-icon) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		vertical-align: middle;
	}

	.kit-btn__content :global(svg),
	.kit-btn__prepend :global(svg),
	.kit-btn__append :global(svg),
	.kit-btn__content :global(img),
	.kit-btn__prepend :global(img),
	.kit-btn__append :global(img) {
		display: block;
	}

	.kit-btn[data-loading='true'] .kit-btn__inner,
	.kit-btn[data-loading='true'] input {
		opacity: 0;
	}

	.kit-btn[data-loading='true'] {
		pointer-events: none;
		user-select: none;
		cursor: pointer;
	}

	.spinner {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.kit-btn[data-block='true'] {
		display: flex;
		width: 100%;
	}

	.kit-btn[data-icon='true'] {
		width: max(28px, calc(var(--kit-btn-h) * var(--kit-btn-density-h-scale)));
		min-width: max(28px, calc(var(--kit-btn-h) * var(--kit-btn-density-h-scale)));
		padding-inline: 0;
	}

	.kit-btn[data-icon='true'] .kit-btn__inner {
		gap: 0;
	}

	.kit-btn[data-disabled='true'] {
		pointer-events: none;
		background: color-mix(in oklab, var(--kit-btn-bg), transparent 70%);
		color: color-mix(in oklab, var(--kit-btn-fg), transparent 45%);
		user-select: none;
		cursor: not-allowed;
	}

	.kit-btn[data-disabled='true'] :global(.kit-icon) {
		color: color-mix(in oklab, var(--kit-btn-fg), transparent 45%) !important;
		--kit-icon-color: color-mix(in oklab, var(--kit-btn-fg), transparent 45%) !important;
	}

	.kit-btn[data-disabled='true'] :global(.kit-icon img),
	.kit-btn[data-disabled='true'] :global(.kit-icon .kit-icon__mask) {
		opacity: 0.7;
		filter: grayscale(0.2);
	}

	.kit-btn[data-disabled='true'] > input {
		cursor: not-allowed;
	}

	/**
	* size
	* @link nothing...
	*/
	.kit-btn[data-size='xs'] {
		--kit-btn-h: 28px;
		--kit-btn-px: 10px;
		--kit-btn-gap: 4px;
		--kit-btn-font: 0.75rem;
	}
	.kit-btn[data-size='xs'] :global(.kit-icon:not([data-size])) {
		--kit-icon-current-size: var(--kit-icon-size-xs);
	}
	.kit-btn[data-size='sm'] {
		--kit-btn-h: 32px;
		--kit-btn-px: 12px;
		--kit-btn-gap: 6px;
		--kit-btn-font: 0.875rem;
	}
	.kit-btn[data-size='sm'] :global(.kit-icon:not([data-size])) {
		--kit-icon-current-size: var(--kit-icon-size-sm);
	}

	.kit-btn[data-size='md'] {
		--kit-btn-h: 40px;
		--kit-btn-px: 16px;
		--kit-btn-gap: 8px;
		--kit-btn-font: 1rem;
	}
	.kit-btn[data-size='md'] :global(.kit-icon:not([data-size])) {
		--kit-icon-current-size: var(--kit-icon-size-md);
	}

	.kit-btn[data-size='lg'] {
		--kit-btn-h: 48px;
		--kit-btn-px: 20px;
		--kit-btn-gap: 10px;
		--kit-btn-font: 1.125rem;
	}
	.kit-btn[data-size='lg'] :global(.kit-icon:not([data-size])) {
		--kit-icon-current-size: var(--kit-icon-size-lg);
	}

	.kit-btn[data-size='xl'] {
		--kit-btn-h: 56px;
		--kit-btn-px: 24px;
		--kit-btn-gap: 12px;
		--kit-btn-font: 1.25rem;
	}
	.kit-btn[data-size='xl'] :global(.kit-icon:not([data-size])) {
		--kit-icon-current-size: var(--kit-icon-size-xl);
	}

	/** 
	 * density
	 * @link no links
	 */
	.kit-btn[data-density='none'] {
		--kit-btn-density-scale: 0;
		--kit-btn-density-h-scale: 0;
	}
	.kit-btn[data-density='compact'] {
		--kit-btn-density-scale: 0.9;
		--kit-btn-density-h-scale: 0.92;
	}
	.kit-btn[data-density='default'] {
		--kit-btn-density-scale: 1;
		--kit-btn-density-h-scale: 1;
	}
	.kit-btn[data-density='comfortable'] {
		--kit-btn-density-scale: 1.1;
		--kit-btn-density-h-scale: 1.15;
	}

	/** 
	 * rounded
	 * @link ...
	 */
	.kit-btn[data-rounded='0'] {
		--kit-btn-radius: var(--kit-shape-none);
	}
	.kit-btn[data-rounded='xs'] {
		--kit-btn-radius: var(--kit-shape-xs);
	}
	.kit-btn[data-rounded='sm'] {
		--kit-btn-radius: var(--kit-shape-sm);
	}
	.kit-btn[data-rounded='md'] {
		--kit-btn-radius: var(--kit-shape-md);
	}
	.kit-btn[data-rounded='lg'] {
		--kit-btn-radius: var(--kit-shape-lg);
	}
	.kit-btn[data-rounded='xl'] {
		--kit-btn-radius: var(--kit-shape-xl);
	}
	.kit-btn[data-rounded='full'] {
		--kit-btn-radius: var(--kit-shape-full);
	}

	/** 
	 * variant
	 * @link no links...
	 */
	.kit-btn[data-variant='filled'] {
		--kit-btn-bg: var(--kit-color-surface-2);
		--kit-btn-fg: var(--kit-color-text);

		--kit-btn-hover-bg: color-mix(in oklab, var(--kit-btn-bg), black 10%);
		--kit-btn-active-bg: color-mix(in oklab, var(--kit-btn-bg), black 16%);
	}
	.kit-btn[data-variant='outline'] {
		--kit-btn-bg: transparent;
		--kit-btn-fg: var(--kit-color-text);
		--kit-btn-bd: var(--kit-btn-fg);

		--kit-btn-hover-bg: color-mix(in oklab, var(--kit-btn-fg), transparent 80%);
		--kit-btn-active-bg: color-mix(in oklab, var(--kit-btn-fg), transparent 92%);
	}
	.kit-btn[data-variant='text'] {
		--kit-btn-bg: transparent;
		--kit-btn-fg: var(--kit-color-text);

		--kit-btn-hover-bg: color-mix(in oklab, var(--kit-btn-fg), transparent 80%);
		--kit-btn-active-bg: color-mix(in oklab, var(--kit-btn-fg), transparent 92%);
	}
	.kit-btn[data-variant='link'] {
		--kit-btn-bg: transparent;
		--kit-btn-fg: var(--kit-color-text);
		--kit-btn-decoration: underline;

		height: inherit;
		padding: 0;
	}

	.kit-btn .outline {
		--outline-color: var(--kit-btn-bd);
	}
</style>
