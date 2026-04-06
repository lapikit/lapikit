<script lang="ts">
	import { useClassName, useStyles } from '$lib/utils';
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
		size = 'default',
		rounded,
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
		...rest
	}: ButtonProps = $props();

	let safeVariant = $derived(
		variant === 'filled' || variant === 'outline' || variant === 'text' || variant === 'link'
			? variant
			: 'filled'
	);
	let safeSize = $derived(
		size === 'default'
			? 'md'
			: size === 'xs' || size === 'sm' || size === 'md' || size === 'lg' || size === 'xl'
				? size
				: 'md'
	);
	let safeDensity = $derived(
		density === 'compact' || density === 'comfortable' || density === 'default'
			? density
			: 'default'
	);

	let { classProps, styleProps, restProps } = $derived(
		makeComponentProps(rest as Record<string, unknown>)
	);

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
</script>

{#if isInput}
	<svelte:element
		this={inputWrapperTag}
		bind:this={ref}
		class={componentClass}
		style={componentStyle}
		data-size={safeSize}
		data-variant={safeVariant}
		data-loading={loading}
		data-active={active}
		data-disabled={isDisabled}
		data-density={safeDensity}
		data-rounded={rounded}
		aria-busy={disabled}
		aria-disabled={isDisabled || undefined}
		data-block={block}
		data-wide={wide}
		data-icon={icon}
		use:ripple={{
			component: 'btn',
			disabled: noRipple || disabled
		}}
	>
		{#if safeVariant === 'outline'}
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
		style={componentStyle}
		{...restProps}
		type={resolvedType()}
		href={resolvedHref}
		data-size={safeSize}
		data-variant={safeVariant}
		data-loading={loading}
		data-active={active}
		data-disabled={isDisabled}
		data-density={safeDensity}
		data-rounded={rounded}
		disabled={resolvedDisabled}
		aria-busy={disabled}
		aria-disabled={isDisabled || undefined}
		data-block={block}
		data-wide={wide}
		data-icon={icon}
		use:ripple={{
			component: 'btn',
			disabled: noRipple || disabled
		}}
	>
		{#if safeVariant === 'outline'}
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
		--kit-btn-bg: var(--kit-surface-2);
		--kit-btn-fg: var(--kit-fg);
		--kit-btn-bd: var(--kit-border);
		--kit-btn-hover-bg: color-mix(in oklab, var(--kit-btn-bg), var(--kit-btn-fg) 6%);
		--kit-btn-active-bg: color-mix(in oklab, var(--kit-btn-bg), var(--kit-btn-fg) 10%);
		--kit-btn-h-xs: 28px;
		--kit-btn-h-sm: 32px;
		--kit-btn-h-md: 40px;
		--kit-btn-h-lg: 48px;
		--kit-btn-h-xl: 56px;
		--kit-btn-px-xs: 10px;
		--kit-btn-px-sm: 12px;
		--kit-btn-px-md: 16px;
		--kit-btn-px-lg: 20px;
		--kit-btn-px-xl: 24px;
		--kit-btn-density-scale: 1;
		--kit-btn-density-h-scale: 1;
		--kit-btn-radius: 8px;
		--kit-btn-gap: 0.45em;

		position: relative;
		display: inline-flex;
		box-sizing: border-box;
		align-items: center;
		justify-content: center;
		font-family: var(--kit-font);
		background: var(--kit-btn-bg);
		color: var(--kit-btn-fg);
		height: max(28px, calc(var(--kit-btn-h) * var(--kit-btn-density-h-scale)));
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

	/* variant */
	.kit-btn[data-variant='filled'] {
		--kit-btn-bg: var(--kit-accent);
		--kit-btn-fg: white;
		--kit-btn-hover-bg: color-mix(in oklab, var(--kit-btn-bg), black 10%);
		--kit-btn-active-bg: color-mix(in oklab, var(--kit-btn-bg), black 16%);
	}

	.kit-btn[data-variant='outline'] {
		--outline-color: var(--kit-accent);
		--kit-btn-bg: transparent;
		--kit-btn-fg: var(--kit-accent);
		--kit-btn-hover-bg: color-mix(in oklab, var(--kit-btn-fg), transparent 80%);
		--kit-btn-active-bg: color-mix(in oklab, var(--kit-btn-fg), transparent 92%);
	}

	.kit-btn[data-variant='text'] {
		--kit-btn-bg: transparent;
		--kit-btn-fg: var(--kit-accent);
		--kit-btn-hover-bg: color-mix(in oklab, var(--kit-btn-fg), transparent 80%);
		--kit-btn-active-bg: color-mix(in oklab, var(--kit-btn-fg), transparent 92%);
	}

	.kit-btn[data-variant='link'] {
		--kit-btn-bg: transparent;
		--kit-btn-fg: var(--kit-accent);
		--kit-btn-decoration: underline;
		height: inherit;
		padding: 0;
	}

	/* size */
	.kit-btn[data-size='xs'] {
		--kit-btn-h: var(--kit-btn-h-xs);
		--kit-btn-px: var(--kit-btn-px-xs);
		font-size: 12px;
	}
	.kit-btn[data-size='xs'] :global(.kit-icon:not([data-size])) {
		--kit-icon-current-size: var(--kit-icon-size-xs);
	}

	.kit-btn[data-size='sm'] {
		--kit-btn-h: var(--kit-btn-h-sm);
		--kit-btn-px: var(--kit-btn-px-sm);
		font-size: 13px;
	}
	.kit-btn[data-size='sm'] :global(.kit-icon:not([data-size])) {
		--kit-icon-current-size: var(--kit-icon-size-sm);
	}

	.kit-btn[data-size='md'] {
		--kit-btn-h: var(--kit-btn-h-md);
		--kit-btn-px: var(--kit-btn-px-md);
		font-size: 14px;
	}
	.kit-btn[data-size='md'] :global(.kit-icon:not([data-size])) {
		--kit-icon-current-size: var(--kit-icon-size-md);
	}

	.kit-btn[data-size='lg'] {
		--kit-btn-h: var(--kit-btn-h-lg);
		--kit-btn-px: var(--kit-btn-px-lg);
		font-size: 15px;
	}
	.kit-btn[data-size='lg'] :global(.kit-icon:not([data-size])) {
		--kit-icon-current-size: var(--kit-icon-size-lg);
	}

	.kit-btn[data-size='xl'] {
		--kit-btn-h: var(--kit-btn-h-xl);
		--kit-btn-px: var(--kit-btn-px-xl);
		font-size: 16px;
	}
	.kit-btn[data-size='xl'] :global(.kit-icon:not([data-size])) {
		--kit-icon-current-size: var(--kit-icon-size-xl);
	}

	/* density */
	.kit-btn[data-density='default'] {
		--kit-btn-density-scale: 1;
		--kit-btn-density-h-scale: 1;
	}

	.kit-btn[data-density='compact'] {
		--kit-btn-density-scale: 0.9;
		--kit-btn-density-h-scale: 0.92;
	}

	.kit-btn[data-density='comfortable'] {
		--kit-btn-density-scale: 1.1;
		--kit-btn-density-h-scale: 1.08;
	}

	/* rounded */
	.kit-btn[data-rounded='0'] {
		--kit-btn-radius: 0;
	}

	.kit-btn[data-rounded='xs'] {
		--kit-btn-radius: 2px;
	}

	.kit-btn[data-rounded='sm'] {
		--kit-btn-radius: 4px;
	}

	.kit-btn[data-rounded='md'] {
		--kit-btn-radius: 8px;
	}

	.kit-btn[data-rounded='lg'] {
		--kit-btn-radius: 16px;
	}

	.kit-btn[data-rounded='xl'] {
		--kit-btn-radius: 99999px;
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
</style>
