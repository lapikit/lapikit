<script lang="ts">
	import { useComponentAttrs, useElevation } from '$lib/utils';
	import { ripple } from '$lib/animations';
	import type { ButtonProps } from './btn.types.ts';

	let {
		ref = $bindable(),
		is = 'button',
		children,
		class: className,
		style: styleAttr,
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
		...rest
	}: ButtonProps = $props();

	let attrs = $derived(
		useComponentAttrs('kit-btn', { className, sClass, styleAttr, sStyle, color, active }, rest)
	);
	let elevationState = $derived(useElevation(elevation));
	let hasOutline = $derived(variant === 'outline' || variant === 'surface');

	let isInput = $derived(!!input || is === 'input');
	let isDisabled = $derived(!!disabled);
	let tag = $derived<'button' | 'a' | 'label' | 'div'>(
		isInput
			? type === 'checkbox' || type === 'radio'
				? 'label'
				: 'div'
			: href || is === 'a'
				? 'a'
				: 'button'
	);
	let resolvedHref = $derived(tag === 'a' && !isDisabled ? href : undefined);
	let resolvedType = $derived(tag === 'button' ? (type ?? 'button') : undefined);
	let resolvedDisabled = $derived(tag === 'button' ? isDisabled : undefined);
	let resolvedTabIndex = $derived(tag === 'a' && isDisabled ? -1 : undefined);
</script>

<svelte:element
	this={tag}
	bind:this={ref}
	class={attrs.class}
	style={attrs.style}
	href={resolvedHref}
	type={resolvedType}
	disabled={resolvedDisabled}
	tabindex={resolvedTabIndex}
	data-variant={variant}
	data-size={size}
	data-density={density}
	data-rounded={rounded}
	data-elevation={elevationState.base}
	data-elevation-hover={elevationState.hover}
	data-elevation-active={elevationState.active}
	data-interactive={true}
	data-active={active}
	data-disabled={isDisabled}
	data-loading={loading}
	data-block={block}
	data-wide={wide}
	data-icon={icon}
	aria-busy={loading || undefined}
	aria-disabled={isDisabled || undefined}
	use:ripple={{
		component: 'btn',
		disabled: noRipple || isDisabled
	}}
	{...isInput ? {} : attrs.rest}
>
	{#if hasOutline}
		<span class="outline"></span>
	{/if}

	{#if isInput}
		<input
			{...attrs.rest}
			class="kit-btn__input"
			data-ripple-host
			type={type || 'button'}
			{checked}
			{value}
			aria-label={String(label || value)}
			disabled={isDisabled}
		/>
	{:else}
		<span class="kit-btn__inner">
			{#if prepend}
				<span class="kit-btn__prepend">{@render prepend()}</span>
			{/if}
			{#if children}
				<span class="kit-btn__content">{@render children()}</span>
			{/if}
			{#if append}
				<span class="kit-btn__append">{@render append()}</span>
			{/if}
		</span>
	{/if}

	{#if loading}
		<span class="kit-btn__spinner">
			{#if load}
				{@render load()}
			{:else}
				...
			{/if}
		</span>
	{/if}
</svelte:element>

<style lang="scss">
	@use 'sass:list';
	@use '$lib/styles' as *;

	$sizes: (
		xs: (
			1.5rem,
			0.5rem,
			0.25rem,
			0.75rem
		),
		sm: (
			2rem,
			0.75rem,
			0.375rem,
			var(--kit-font-xs)
		),
		md: (
			2.5rem,
			1rem,
			0.5rem,
			var(--kit-font-sm)
		),
		lg: (
			3rem,
			1.25rem,
			0.5625rem,
			var(--kit-font-lg)
		),
		xl: (
			3.5rem,
			1.5rem,
			0.625rem,
			var(--kit-font-xl)
		)
	);

	.kit-btn {
		@include color(kit-btn, var(--kit-color-surface-2), var(--kit-color-text));

		--kit-btn-height: calc(var(--kit-btn-h) + var(--kit-btn-density-offset) / 2);

		position: relative;
		display: inline-flex;
		box-sizing: border-box;
		align-items: center;
		justify-content: center;
		height: var(--kit-btn-height);
		padding-inline: calc(var(--kit-btn-p) + var(--kit-btn-density-offset) / 2);
		border: 0;
		border-radius: var(--kit-btn-radius);
		background-color: var(--kit-btn-bg);
		color: var(--kit-btn-fg);
		font: inherit;
		font-family: var(--kit-font);
		font-size: var(--kit-btn-font);
		text-decoration: none;
		white-space: nowrap;
		user-select: none;
		@include color-transition((background-color, color, border-color, box-shadow));

		&__inner {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			gap: var(--kit-btn-gap);
			line-height: 1;
		}

		&__content,
		&__prepend,
		&__append {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			line-height: 1;

			:global(.kit-icon) {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				vertical-align: middle;
			}

			:global(svg),
			:global(img) {
				display: block;
			}
		}

		&__input {
			margin: 0;
			padding: 0;
			border: 0;
			background: transparent;
			color: inherit;
			font: inherit;
			cursor: pointer;

			&:focus-visible {
				outline: none;
			}

			&:is([type='checkbox'], [type='radio']) {
				appearance: none;

				&::after {
					content: attr(aria-label);
				}
			}
		}

		&__spinner {
			position: absolute;
			inset: 0;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		&:has(> .kit-btn__input:focus-visible) {
			outline: 2px solid var(--kit-color-focus);
			outline-offset: 2px;
		}

		&[data-loading='true'] {
			pointer-events: none;

			.kit-btn__inner,
			.kit-btn__input {
				opacity: 0;
			}
		}

		&[data-block='true'] {
			display: flex;
			width: 100%;
		}

		&[data-wide='true'] {
			width: 100%;
			max-width: 16rem;
		}

		&[data-icon='true'] {
			width: max(1.75rem, var(--kit-btn-height));
			min-width: max(1.75rem, var(--kit-btn-height));
			padding-inline: 0;

			.kit-btn__inner {
				gap: 0;
			}
		}
	}

	/* native resets: no background here, it would beat the background of .kit-btn */
	button.kit-btn {
		appearance: none;
	}

	/**
	 * size
	 * @link https://lapikit.dev/docs/components/button#size
	 */
	@each $size, $values in $sizes {
		.kit-btn[data-size='#{$size}'] {
			--kit-btn-h: #{list.nth($values, 1)};
			--kit-btn-p: #{list.nth($values, 2)};
			--kit-btn-gap: #{list.nth($values, 3)};
			--kit-btn-font: #{list.nth($values, 4)};

			:global(.kit-icon:not([data-size])) {
				--kit-icon-current-size: var(--kit-icon-size-#{$size});
			}
		}
	}

	/**
	 * variant
	 * @link https://lapikit.dev/docs/components/button#variants
	 */
	@each $variant in (tonal, outline, surface, text, plain) {
		.kit-btn[data-variant='#{$variant}'] {
			@include color-variant(kit-btn, $variant);
		}
	}

	// a plain variant, underlined and without the box of a button
	.kit-btn[data-variant='link'] {
		@include color-variant(kit-btn, plain);

		height: auto;
		padding: 0;
		text-decoration: underline;
	}

	.kit-btn .outline {
		--outline-color: var(--kit-btn-border);
	}

	.kit-btn[data-active='true'],
	.kit-btn:has(> .kit-btn__input:checked) {
		@include color-active(kit-btn);
	}

	/**
	 * interactive: hover, pressed, focus-visible and disabled
	 */
	@include interactive(kit-btn);

	/**
	 * rounded
	 * @link https://lapikit.dev/docs/customize
	 */
	@include rounded(kit-btn, (0, xs, sm, md, lg, xl, full));

	/**
	 * density
	 * @link https://lapikit.dev/docs/components/button#density
	 */
	@include density(kit-btn);
</style>
