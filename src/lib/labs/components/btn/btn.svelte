<script lang="ts">
	import { useClassName, useStyles } from '$lib/labs/utils/index.js';
	import { makeComponentProps } from '$lib/labs/compiler/mapped-code.js';
	import { ripple } from '$lib/labs/animations/index.js';
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
		...rest
	}: ButtonProps = $props();

	let safeVariant = $derived(
		variant === 'filled' || variant === 'outline' || variant === 'text' || variant === 'link'
			? variant
			: 'filled'
	);
	let safeSize = $derived(
		size === 'xs' || size === 'sm' || size === 'md' || size === 'lg' || size === 'xl' ? size : 'md'
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
			className: `${className ?? ''} kit-btn--${safeVariant}`.trim(),
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
		aria-disabled={isDisabled}
		data-block={block}
		data-wide={wide}
		use:ripple={{
			component: 'button',
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
		aria-disabled={isDisabled}
		data-block={block}
		data-wide={wide}
		use:ripple={{
			component: 'button',
			disabled: noRipple || disabled
		}}
	>
		{#if safeVariant === 'outline'}
			<span class="outline"></span>
		{/if}

		<span class="kit-btn__inner">
			<span class="kit-btn__content">
				{@render children?.()}
			</span>
		</span>

		{#if loading}
			<span class="spinner">...</span>
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
		--kit-btn-bg--hover: color-mix(in oklab, var(--kit-btn-bg), var(--kit-fg) 6%);
		--kit-btn-bg--active: color-mix(in oklab, var(--kit-btn-bg), var(--kit-fg) 10%);
		--kit-btn-bd--hover: color-mix(in oklab, var(--kit-btn-bd), var(--kit-fg) 12%);
		--kit-btn-font: var(--kit-font);
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
		--btn-density-scale: 1;
		--btn-density-height-scale: 1;
		--btn-radius: 8px;

		position: relative;
		display: inline-flex;
		box-sizing: border-box;
		align-items: center;
		justify-content: center;
		font-family: var(--kit-btn-font);
		background: var(--btn-bg);
		color: var(--btn-fg);
		height: max(28px, calc(var(--btn-h) * var(--btn-density-height-scale)));
		padding-inline: calc(var(--btn-px) * var(--btn-density-scale));
		border-radius: var(--btn-radius);
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
		background: var(--btn-hover-bg);
		color: var(--btn-hover-fg);
		text-decoration: var(--btn-decoration);
	}

	.kit-btn:has(> :is(input[type='checkbox'], input[type='radio']):checked) {
		background: var(--btn-active-bg);
		color: var(--btn-active-fg);
		text-decoration: var(--btn-decoration);
	}

	.kit-btn:has(> :is(input[type='checkbox'], input[type='radio']):checked):hover {
		background: var(--btn-hover-bg);
		color: var(--btn-hover-fg);
		text-decoration: var(--btn-decoration);
	}

	.kit-btn:active,
	.kit-btn[data-active='true'] {
		background: var(--btn-active-bg);
		color: var(--btn-active-fg);
		text-decoration: var(--btn-decoration);
		transform: translateY(1px);
	}

	.kit-btn[data-active='true']:hover {
		background: var(--btn-hover-bg);
		color: var(--btn-hover-fg);
		text-decoration: var(--btn-decoration);
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
		--btn-content: attr(aria-label);
		content: var(--btn-content);
		cursor: pointer;
	}

	/* variant */
	.kit-btn[data-variant='filled'] {
		/* default style*/
		--btn-bg: var(--kit-accent);
		--btn-fg: white;
		--btn-hover-bg: color-mix(in oklab, var(--kit-accent), black 10%);
		--btn-hover-fg: var(--btn-fg);
		--btn-active-bg: color-mix(in oklab, var(--kit-accent), black 16%);
		--btn-active-fg: var(--btn-fg);
	}

	.kit-btn[data-variant='outline'] {
		--outline-color: var(--kit-accent);
	}

	.kit-btn[data-variant='outline'],
	.kit-btn[data-variant='text'] {
		--btn-bg: transparent;
		--btn-fg: var(--kit-accent);
		--btn-hover-bg: color-mix(in oklab, var(--kit-accent), transparent 80%);
		--btn-hover-fg: var(--btn-fg);
		--btn-active-bg: color-mix(in oklab, var(--kit-accent), transparent 92%);
		--btn-active-fg: var(--btn-fg);
	}

	.kit-btn[data-variant='link'] {
		--btn-bg: transparent;
		--btn-fg: var(--kit-accent);
		--btn-hover-fg: var(--btn-fg);
		--btn-active-fg: var(--btn-fg);
		--btn-decoration: underline;
		height: inherit;
		padding: 0;
	}

	/* size */
	.kit-btn[data-size='xs'] {
		--btn-h: var(--kit-btn-h-xs);
		--btn-height: var(--kit-btn-h-xs);
		--btn-px: var(--kit-btn-px-xs);
		font-size: 12px;
	}

	.kit-btn[data-size='sm'] {
		--btn-h: var(--kit-btn-h-sm);
		--btn-height: var(--kit-btn-h-sm);
		--btn-px: var(--kit-btn-px-sm);
		font-size: 13px;
	}

	.kit-btn[data-size='md'] {
		--btn-h: var(--kit-btn-h-md);
		--btn-height: var(--kit-btn-h-md);
		--btn-px: var(--kit-btn-px-md);
		font-size: 14px;
	}

	.kit-btn[data-size='lg'] {
		--btn-h: var(--kit-btn-h-lg);
		--btn-height: var(--kit-btn-h-lg);
		--btn-px: var(--kit-btn-px-lg);
		font-size: 15px;
	}

	.kit-btn[data-size='xl'] {
		--btn-h: var(--kit-btn-h-xl);
		--btn-height: var(--kit-btn-h-xl);
		--btn-px: var(--kit-btn-px-xl);
		font-size: 16px;
	}

	/* density */
	.kit-btn[data-density='default'] {
		--btn-density-scale: 1;
		--btn-density-height-scale: 1;
	}

	.kit-btn[data-density='compact'] {
		--btn-density-scale: 0.9;
		--btn-density-height-scale: 0.92;
	}

	.kit-btn[data-density='comfortable'] {
		--btn-density-scale: 1.1;
		--btn-density-height-scale: 1.08;
	}

	/* rounded */
	.kit-btn[data-rounded='0'] {
		--btn-radius: 0;
	}

	.kit-btn[data-rounded='xs'] {
		--btn-radius: 2px;
	}

	.kit-btn[data-rounded='sm'] {
		--btn-radius: 4px;
	}

	.kit-btn[data-rounded='md'] {
		--btn-radius: 8px;
	}

	.kit-btn[data-rounded='lg'] {
		--btn-radius: 16px;
	}

	.kit-btn[data-rounded='xl'] {
		--btn-radius: 99999px;
	}

	.kit-btn[data-wide='true'] {
		width: 100%;
		max-width: 16rem;
	}

	.kit-btn .outline {
		pointer-events: none;
	}

	.kit-btn__inner {
		display: flex;
		align-items: center;
		gap: var(--kit-btn-gap);
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

	.kit-btn[data-disabled='true'] {
		pointer-events: none;
		background: color-mix(in oklab, var(--btn-bg), transparent 70%);
		color: color-mix(in oklab, var(--btn-fg), transparent 45%);

		user-select: none;
		cursor: not-allowed;
	}

	.kit-btn[data-disabled='true'] > input {
		cursor: not-allowed;
	}

	@keyframes animation-l-ripple {
		from {
			scale: 0;
		}

		to {
			scale: 1;
		}
	}
</style>
