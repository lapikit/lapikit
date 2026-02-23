<script lang="ts">
	import { useClassName, useStyles } from '$lib/labs/utils/index.js';
	import { makeComponentProps } from '$lib/labs/compiler/mapped-code.js';

	type BtnVariant = 'default' | 'text' | 'filled';

	let {
		class: className = '',
		style: styleAttr = '',
		children = () => null,
		's-class': sClass,
		's-style': sStyle,
		is = 'button',
		variant = 'default',
		loading,
		size = 'md',
		icon,
		disabled,
		block,
		...rest
	} = $props();

	let safeVariant = $derived<BtnVariant>(
		variant === 'default' || variant === 'text' || variant === 'filled' ? variant : 'default'
	); // Test this solution ...

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
</script>

<svelte:element
	this={is}
	class={componentClass}
	style={componentStyle}
	{...restProps}
	data-size={size}
	data-variant="primary"
	data-loading={loading}
	data-icon-only={icon}
	{disabled}
	aria-busy={disabled}
	aria-disabled={disabled}
	data-block={block}
>
	<span class="outline"></span>
	<span class="kit-btn__inner">
		{#if icon}
			<span class="kit-btn__icon">
				<!-- icon -->
			</span>
		{/if}
		<span class="kit-btn__content">
			{@render children()}
		</span>
	</span>
	{#if loading}
		<span class="spinner"></span>
	{/if}
</svelte:element>

<style>
	:root {
		--kit-btn-h-sm: 32px;
		--kit-btn-h-md: 40px;
		--kit-btn-h-lg: 48px;

		--kit-btn-px-sm: 12px;
		--kit-btn-px-md: 16px;
		--kit-btn-px-lg: 20px;

		--kit-btn-gap: 8px;

		--bg: #111827;
		--fg: #ffffff;
		--bg-hover: #0b1220;
		--border: rgba(255, 255, 255, 0.08);
		--font:
			ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
			'Segoe UI Symbol', 'Noto Color Emoji';
	}

	.kit-btn {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: var(--btn-h);
		padding-inline: var(--btn-px);
		border-radius: var(--btn-radius);
		/* border: 1px solid var(--border); */
		border: 0;
		background: var(--bg);
		color: var(--fg);
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

	.kit-btn[data-size='md'] {
		--btn-h: var(--kit-btn-h-md);
		--btn-px: var(--kit-btn-px-md);
		font-size: 14px;
	}

	.kit-btn[data-size='md'] {
		--btn-height: var(--kit-btn-h-md);
		--btn-px: var(--kit-btn-px-md);
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

	.kit-btn[data-size='sm'] .kit-btn__icon {
		width: 16px;
		height: 16px;
	}

	.kit-btn[data-loading='true'] .kit-btn__inner {
		opacity: 0;
	}

	.kit-btn__spinner {
		position: absolute;
		inset: 0;

		display: flex;
		align-items: center;
		justify-content: center;
	}

	.kit-btn:focus-visible {
		outline: 2px solid var(--focus);
		outline-offset: 2px;
		box-shadow:
			0 0 0 2px var(--bg),
			0 0 0 4px var(--focus);
	}

	.kit-btn[data-block='true'] {
		width: 100%;
	}

	.kit-btn:disabled {
		pointer-events: none;
		opacity: 0.5;
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
