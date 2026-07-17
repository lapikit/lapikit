<script lang="ts">
	import { useClassName, useElevation, useStyles } from '$lib/utils';
	import { makeComponentProps } from '$lib/html-mapped';
	import { ripple } from '$lib/animations';
	import type { ChipProps } from './chip.types.ts';

	let {
		ref = $bindable(),
		is = 'div',
		children,
		class: className = '',
		style: styleAttr = '',
		's-class': sClass,
		's-style': sStyle,
		variant = 'filled',
		density = 'default',
		rounded = 'full',
		loading,
		active = false,
		size = 'md',
		labelStyle = false,
		disabled = false,
		href,
		input,
		type,
		checked,
		value,
		label,
		noRipple,
		load,
		append,
		prepend,
		readonly = false,
		elevation,
		background,
		color,
		...rest
	}: ChipProps = $props();

	let { classProps, styleProps, restProps } = $derived(
		makeComponentProps(rest as Record<string, unknown>)
	);

	let elevationState = $derived(useElevation(elevation));

	let componentClass = $derived(
		useClassName({
			baseClass: 'kit-chip',
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
	const isReadonly = $derived(!!readonly);
	const isLocked = $derived(isDisabled || isReadonly);

	const hasOnClick = $derived(typeof restProps.onclick === 'function');
	const hasOnKeyDown = $derived(typeof restProps.onkeydown === 'function');
	const hasOnKeyUp = $derived(typeof restProps.onkeyup === 'function');
	const hasOnPressHandler = $derived(hasOnClick || hasOnKeyDown || hasOnKeyUp);
	const wantsActionTag = $derived(is === 'button' || is === 'a' || is === 'input');

	const tag = $derived(
		(href && 'a') ||
			(isInput && 'input') ||
			(wantsActionTag && is) ||
			(hasOnPressHandler && 'button') ||
			'div'
	);

	const isInteractive = $derived(
		(tag === 'button' || tag === 'a' || isInput || hasOnPressHandler) && !isLocked
	);
	const inputWrapperTag = $derived(type === 'checkbox' || type === 'radio' ? 'label' : 'div');
	const resolvedHref = $derived(isLocked ? undefined : href);
	const resolvedDisabled = $derived((tag === 'button' && isLocked) || undefined);

	const resolvedType = $derived(tag !== 'button' ? type : (type ?? 'button'));

	let resolvedStyle = $derived(
		[
			componentStyle,
			color ? `--kit-chip-fg:${color && `var(--kit-color-${color})`}` : '',
			background ? `--kit-chip-bg:${background && `var(--kit-color-${background})`}` : ''
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
		data-rounded={rounded}
		data-loading={loading}
		data-active={active}
		data-disabled={isDisabled}
		data-readonly={isReadonly}
		data-density={density}
		data-label-style={labelStyle}
		data-interactive={isInteractive}
		aria-busy={loading}
		aria-disabled={isLocked || undefined}
		data-elevation={elevationState.base}
		data-elevation-hover={elevationState.hover}
		data-elevation-active={elevationState.active}
		use:ripple={{
			component: 'chip',
			disabled: noRipple || isLocked
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
			disabled={isLocked}
		/>
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
{:else}
	<svelte:element
		this={tag}
		bind:this={ref}
		class={componentClass}
		style={resolvedStyle}
		type={resolvedType}
		href={resolvedHref}
		data-size={size}
		data-variant={variant}
		data-rounded={rounded}
		data-loading={loading}
		data-active={active}
		data-disabled={isDisabled}
		data-readonly={isReadonly}
		data-density={density}
		data-label-style={labelStyle}
		data-interactive={isInteractive}
		disabled={resolvedDisabled}
		aria-busy={loading}
		data-elevation={elevationState.base}
		data-elevation-hover={elevationState.hover}
		data-elevation-active={elevationState.active}
		aria-disabled={((tag === 'a' || tag === 'div') && isLocked) || undefined}
		tabindex={tag === 'a' && isLocked ? -1 : undefined}
		use:ripple={{
			component: 'chip',
			disabled: noRipple || !isInteractive
		}}
		// style:--kit-chip-fg={color && `var(--kit-color-${color})`}
		// style:--kit-chip-bg={background && `var(--kit-color-${background})`}
		{...restProps}
	>
		{#if variant === 'outline'}
			<span class="outline"></span>
		{/if}

		<span class="kit-chip__inner">
			{#if prepend}
				<span class="kit-chip__prepend">
					{@render prepend?.()}
				</span>
			{/if}
			<span class="kit-chip__content">
				{@render children?.()}
			</span>
			{#if append}
				<span class="kit-chip__append">
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

	button,
	input,
	select,
	textarea {
		font: inherit;
		color: inherit;
	}

	button {
		appearance: none;
		background: none;
		border: none;
	}

	.kit-chip {
		position: relative;
		display: inline-flex;
		box-sizing: border-box;
		align-items: center;
		justify-content: center;
		font-family: var(--kit-font);
		background: var(--kit-chip-bg);
		color: var(--kit-chip-fg);
		height: calc(var(--kit-chip-h) + var(--kit-chip-density-offset) / 2);
		padding-inline: calc(var(--kit-chip-p) + var(--kit-chip-density-offset) / 2);
		border-radius: var(--kit-chip-radius);
		text-decoration: none;
		white-space: nowrap;
		user-select: none;
		cursor: default;
		border: 0;
		transition:
			background 150ms ease,
			transform 50ms ease;
	}

	.kit-chip[data-interactive='true'] {
		cursor: pointer;
	}

	.kit-chip[data-interactive='true']:hover {
		background: var(--kit-chip-hover-bg);
		color: var(--kit-chip-fg);
		text-decoration: var(--kit-chip-decoration);
	}

	.kit-chip[data-interactive='true']:active,
	.kit-chip[data-active='true'] {
		background: var(--kit-chip-active-bg);
		color: var(--kit-chip-fg);
		text-decoration: var(--kit-chip-decoration);
		transform: translateY(1px);
	}

	.kit-chip[data-active='true'][data-interactive='true']:hover {
		background: var(--kit-chip-hover-bg);
		color: var(--kit-chip-fg);
		text-decoration: var(--kit-chip-decoration);
	}

	:is(.kit-chip:focus-visible, .kit-chip:has(> input:focus-visible)) {
		outline: 2px solid var(--kit-color-focus);
		outline-offset: 2px;
	}

	.kit-chip > input:focus-visible {
		outline: none;
		box-shadow: none;
	}

	.kit-chip > :is(input[type='checkbox'], input[type='radio']) {
		appearance: none;
		margin: 0;
		cursor: pointer;
	}

	.kit-chip > :is(input[type='checkbox'], input[type='radio']):after {
		content: attr(aria-label);
		cursor: pointer;
	}

	.kit-chip[data-label-style='true'] {
		font-weight: 600;
		letter-spacing: 0.01em;
		text-transform: uppercase;
	}

	.kit-chip__inner {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--kit-chip-gap);
		line-height: 1;
	}

	.kit-chip__content,
	.kit-chip__prepend,
	.kit-chip__append {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		line-height: 1;
		font-weight: normal;
	}

	.kit-chip__content :global(.kit-icon),
	.kit-chip__prepend :global(.kit-icon),
	.kit-chip__append :global(.kit-icon) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		vertical-align: middle;
	}

	.kit-chip__content :global(svg),
	.kit-chip__prepend :global(svg),
	.kit-chip__append :global(svg),
	.kit-chip__content :global(img),
	.kit-chip__prepend :global(img),
	.kit-chip__append :global(img) {
		display: block;
	}

	.kit-chip[data-loading='true'] .kit-chip__inner,
	.kit-chip[data-loading='true'] input {
		opacity: 0;
	}

	.kit-chip[data-loading='true'] {
		pointer-events: none;
		user-select: none;
	}

	.spinner {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.kit-chip[data-readonly='true'],
	.kit-chip[data-disabled='true'] {
		pointer-events: none;
		user-select: none;
		cursor: default;
	}

	.kit-chip[data-disabled='true'] {
		background: color-mix(in oklab, var(--kit-chip-bg), transparent 70%);
		color: color-mix(in oklab, var(--kit-chip-fg), transparent 45%);
	}

	.kit-chip[data-disabled='true'] :global(.kit-icon),
	.kit-chip[data-readonly='true'] :global(.kit-icon) {
		color: color-mix(in oklab, var(--kit-chip-fg), transparent 45%) !important;
		--kit-icon-color: color-mix(in oklab, var(--kit-chip-fg), transparent 45%) !important;
	}

	.kit-chip[data-disabled='true'] :global(.kit-icon img),
	.kit-chip[data-disabled='true'] :global(.kit-icon .kit-icon__mask) {
		opacity: 0.7;
		filter: grayscale(0.2);
	}
	.kit-chip[data-readonly='true'] > input,
	.kit-chip[data-disabled='true'] > input {
		cursor: default;
	}

	/**
	* size
	* @link nothing...
	*/
	.kit-chip[data-size='xs'] {
		--kit-chip-h: 20px;
		--kit-chip-p: 8px;
		--kit-chip-gap: var(--kit-space-compact);
		--kit-chip-font: 11px;
	}
	.kit-chip[data-size='xs'] :global(.kit-icon:not([data-size])) {
		--kit-icon-current-size: var(--kit-icon-size-xs);
	}
	.kit-chip[data-size='sm'] {
		--kit-chip-h: 24px;
		--kit-chip-p: 10px;
		--kit-chip-gap: var(--kit-space-default);
		--kit-chip-font: 12px;
	}
	.kit-chip[data-size='sm'] :global(.kit-icon:not([data-size])) {
		--kit-icon-current-size: var(--kit-icon-size-sm);
	}

	.kit-chip[data-size='md'] {
		--kit-chip-h: 32px;
		--kit-chip-p: 12px;
		--kit-chip-gap: var(--kit-space-default);
		--kit-chip-font: 13px;
	}
	.kit-chip[data-size='md'] :global(.kit-icon:not([data-size])) {
		--kit-icon-current-size: var(--kit-icon-size-md);
	}

	.kit-chip[data-size='lg'] {
		--kit-chip-h: 36px;
		--kit-chip-p: 14px;
		--kit-chip-gap: var(--kit-space-default);
		--kit-chip-font: 14px;
	}
	.kit-chip[data-size='lg'] :global(.kit-icon:not([data-size])) {
		--kit-icon-current-size: var(--kit-icon-size-lg);
	}

	.kit-chip[data-size='xl'] {
		--kit-chip-h: 40px;
		--kit-chip-p: 16px;
		--kit-chip-gap: var(--kit-space-comfortable);
		--kit-chip-font: 15px;
	}
	.kit-chip[data-size='xl'] :global(.kit-icon:not([data-size])) {
		--kit-icon-current-size: var(--kit-icon-size-xl);
	}

	/** 
	 * density
	 * @link no links
	 */
	.kit-chip[data-density='compact'] {
		--kit-chip-density-offset: var(--kit-density-compact);
	}
	.kit-chip[data-density='default'] {
		--kit-chip-density-offset: var(--kit-density-default);
	}
	.kit-chip[data-density='comfortable'] {
		--kit-chip-density-offset: var(--kit-density-comfortable);
	}

	/** 
	 * rounded
	 * @link ...
	 */
	.kit-chip[data-rounded='0'] {
		--kit-chip-radius: var(--kit-shape-none);
	}
	.kit-chip[data-rounded='xs'] {
		--kit-chip-radius: var(--kit-shape-xs);
	}
	.kit-chip[data-rounded='sm'] {
		--kit-chip-radius: var(--kit-shape-sm);
	}
	.kit-chip[data-rounded='md'] {
		--kit-chip-radius: var(--kit-shape-md);
	}
	.kit-chip[data-rounded='lg'] {
		--kit-chip-radius: var(--kit-shape-lg);
	}
	.kit-chip[data-rounded='xl'] {
		--kit-chip-radius: var(--kit-shape-xl);
	}
	.kit-chip[data-rounded='full'] {
		--kit-chip-radius: var(--kit-shape-full);
	}

	/** 
	 * variant
	 * @link no links...
	 */
	.kit-chip[data-variant='filled'] {
		--kit-chip-bg: var(--kit-color-surface-2);
		--kit-chip-fg: var(--kit-color-text);

		--kit-chip-hover-bg: color-mix(in oklab, var(--kit-chip-bg), black 10%);
		--kit-chip-active-bg: color-mix(in oklab, var(--kit-chip-bg), black 16%);
	}
	.kit-chip[data-variant='outline'] {
		--kit-chip-bg: transparent;
		--kit-chip-fg: var(--kit-color-text);
		--kit-chip-bd: var(--kit-chip-fg);

		--kit-chip-hover-bg: color-mix(in oklab, var(--kit-chip-fg), transparent 80%);
		--kit-chip-active-bg: color-mix(in oklab, var(--kit-chip-fg), transparent 92%);
	}
	.kit-chip[data-variant='text'] {
		--kit-chip-bg: transparent;
		--kit-chip-fg: var(--kit-color-text);

		--kit-chip-hover-bg: color-mix(in oklab, var(--kit-chip-fg), transparent 80%);
		--kit-chip-active-bg: color-mix(in oklab, var(--kit-chip-fg), transparent 92%);
	}

	.kit-chip .outline {
		--outline-color: var(--kit-chip-bd);
	}
</style>
