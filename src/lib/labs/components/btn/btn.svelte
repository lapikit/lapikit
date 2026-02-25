<script lang="ts">
	import { useClassName, useStyles } from '$lib/labs/utils/index.js';
	import { makeComponentProps } from '$lib/labs/compiler/mapped-code.js';

	type BtnVariant = 'filled' | 'outline' | 'text' | 'link';
	type BtnSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	// "button" | "submit" | "reset"

	let {
		class: className = '',
		style: styleAttr = '',
		children = () => null,
		's-class': sClass,
		's-style': sStyle,
		is = 'button',
		variant = 'filled',
		loading,
		active = false,
		size = 'md',
		icon,
		disabled = false,
		block,
		href,
		input,
		type,
		checked,
		value,
		label,
		wide,
		...rest
	} = $props();

	let safeVariant = $derived<BtnVariant>(
		variant === 'filled' || variant === 'text' || variant === 'filled' ? variant : 'filled'
	); // Test this solution ...
	let safeSize = $derived<BtnSize>(
		size === 'xs' || size === 'sm' || size === 'md' || size === 'lg' || size === 'xl' ? size : 'md'
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
		class={componentClass}
		style={componentStyle}
		data-size={safeSize}
		data-variant={variant}
		data-loading={loading}
		data-active={active}
		data-disabled={isDisabled}
		data-icon-only={icon}
		aria-busy={disabled}
		aria-disabled={isDisabled}
		data-block={block}
		data-wide={wide}
	>
		{#if variant === 'outline'}
			<span class="outline"></span>
		{/if}
		<input
			{...restProps}
			type={type || 'button'}
			{checked}
			{value}
			aria-label={label || value}
			disabled={isDisabled}
		/>
		{#if loading}
			<span class="spinner"></span>
		{/if}
	</svelte:element>
{:else}
	<svelte:element
		this={tag}
		class={componentClass}
		style={componentStyle}
		{...restProps}
		type={resolvedType()}
		href={resolvedHref}
		data-size={safeSize}
		data-variant={variant}
		data-loading={loading}
		data-active={active}
		data-disabled={isDisabled}
		data-icon-only={icon}
		disabled={resolvedDisabled}
		aria-busy={disabled}
		aria-disabled={isDisabled}
		data-block={block}
		data-wide={wide}
	>
		{#if variant === 'outline'}
			<span class="outline"></span>
		{/if}

		<span class="kit-btn__inner">
			{#if icon}
				<span class="kit-btn__icon"><!-- icon --></span>
			{/if}
			<span class="kit-btn__content">
				{@render children()}
			</span>
		</span>

		{#if loading}
			<span class="spinner"></span>
		{/if}
	</svelte:element>
{/if}

<style>
	:root {
		--kit-btn-h-sm: 32px;
		--kit-btn-h-md: 40px;
		--kit-btn-h-xs: 28px;
		--kit-btn-h-lg: 48px;
		--kit-btn-h-xl: 56px;

		--kit-btn-px-xs: 10px;
		--kit-btn-px-sm: 12px;
		--kit-btn-px-md: 16px;
		--kit-btn-px-lg: 20px;
		--kit-btn-px-xl: 24px;

		--kit-outline-w: 1px;
		--btn-radius: 8px;

		--kit-btn-gap: 8px;

		--bg: #111827;
		--fg: #ffffff;
		--bg-hover: #0b1220;
		--border: rgba(255, 255, 255, 0.08);
		--focus: blue;
		--font:
			ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
			'Segoe UI Symbol', 'Noto Color Emoji';
	}

	.outline {
		--container-shape-start-start: var(--btn-radius);
		--container-shape-start-end: var(--btn-radius);
		--container-shape-end-start: var(--btn-radius);
		--container-shape-end-end: var(--btn-radius);

		border-width: var(--kit-outline-w);
		inset: 0;
		border-style: solid;
		position: absolute;
		box-sizing: border-box;
		border-color: red;
		z-index: 1;
		border-start-start-radius: var(--container-shape-start-start);
		border-start-end-radius: var(--container-shape-start-end);
		border-end-start-radius: var(--container-shape-end-start);
		border-end-end-radius: var(--container-shape-end-end);
	}

	div.kit-btn {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--btn-radius);
	}
	.kit-btn {
		position: relative;
		display: inline-flex;
		box-sizing: border-box;
		align-items: center;
		justify-content: center;
		height: var(--btn-h);
		padding-inline: var(--btn-px);
		border-radius: var(--btn-radius);
		/* border: 1px solid var(--border); */
		border: 0;

		font-family: var(--font);
		font-size: 14px;
		text-decoration: none;
		white-space: nowrap;
		user-select: none;

		cursor: pointer;

		transition:
			background 150ms ease,
			transform 50ms ease;
	}

	.kit-btn[data-variant='filled'] {
		background: var(--bg);
		color: var(--fg);
	}

	.kit-btn[data-wide='true'] {
		width: 100%;
		max-width: 16rem;
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

	.kit-btn:hover {
		background-color: orange;
	}

	.kit-btn:has(> :is(input[type='checkbox'], input[type='radio']):checked) {
		background: pink;
		color: purple;
	}

	.kit-btn:has(> :is(input[type='checkbox'], input[type='radio']):checked):hover {
		background-color: orange;
	}

	.kit-btn[data-active='true'] {
		background: green;
		color: red;
	}

	.kit-btn[data-active='true']:hover {
		background: orange;
		color: red;
	}

	.kit-btn .outline {
		pointer-events: none;
	}

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

	.kit-btn__inner {
		display: flex;
		align-items: center;
		gap: var(--kit-btn-gap);
	}

	.kit-btn[data-icon-only='true'] {
		padding-inline: 0;
		width: var(--btn-height);
	}

	.kit-btn__icon {
		display: flex;
		align-items: center;
	}

	.kit-btn[data-size='xs'] .kit-btn__icon {
		width: 14px;
		height: 14px;
	}

	.kit-btn[data-size='sm'] .kit-btn__icon {
		width: 16px;
		height: 16px;
	}

	.kit-btn[data-size='md'] .kit-btn__icon {
		width: 18px;
		height: 18px;
	}

	.kit-btn[data-size='lg'] .kit-btn__icon {
		width: 20px;
		height: 20px;
	}

	.kit-btn[data-size='xl'] .kit-btn__icon {
		width: 22px;
		height: 22px;
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

	.kit-btn__spinner {
		position: absolute;
		inset: 0;

		display: flex;
		align-items: center;
		justify-content: center;
	}

	:is(.kit-btn:focus-visible, .kit-btn:has(> input:focus-visible)) {
		outline: 2px solid var(--focus);
		outline-offset: 2px;
		box-shadow:
			0 0 0 2px var(--bg),
			0 0 0 4px var(--focus);
	}

	.kit-btn > input:focus-visible {
		outline: none;
		box-shadow: none;
	}

	.kit-btn[data-block='true'] {
		display: flex;
		width: 100%;
	}

	.kit-btn[data-disabled='true'] {
		pointer-events: none;
		opacity: 0.5;
		user-select: none;
		cursor: not-allowed;
	}

	.kit-btn[data-disabled='true'] > input {
		cursor: not-allowed;
	}

	.kit-btn {
		transition:
			background 0.15s ease,
			transform 0.05s ease;
	}

	.kit-btn:active {
		transform: translateY(1px);
	}
</style>
