<script lang="ts">
	import { useClassName, useStyles } from '$lib/utils';
	import { makeComponentProps } from '$lib/html-mapped';
	import Icon from '$lib/components/icon/icon.svelte';
	import type { TextfieldProps } from './textfield.types.ts';

	let {
		ref = $bindable(),
		prepend,
		append,
		prependInner,
		appendInner,
		value = $bindable(),
		type = 'text',
		density = 'default',
		size = 'md',
		variant = 'filled',
		placeholder,
		light = false,
		dark = false,
		counter = false,
		min,
		max,
		prefix,
		suffix,
		message,
		messagePrefix,
		messageSuffix,
		clearable = false,
		persistentClear = false,
		disabled = false,
		error = false,
		errorMessage,
		persistentMessage = false,
		hideSpinButtons = false,
		readonly = false,
		color,
		background,
		rounded,
		class: className = '',
		style: styleAttr = '',
		's-class': sClass,
		's-style': sStyle,
		name,
		id,
		autocomplete,
		inputmode,
		...rest
	}: TextfieldProps = $props();

	let safeVariant = $derived(
		variant === 'filled' || variant === 'outline' || variant === 'text' ? variant : 'filled'
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
			baseClass: 'kit-textfield',
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

	let mergedStyle = $derived(
		[
			componentStyle,
			background ? `--kit-textfield-background:${background}` : '',
			color ? `--kit-textfield-color:${color}` : '',
			typeof rounded === 'string' && rounded.includes('px')
				? `--kit-textfield-radius:${rounded}`
				: ''
		]
			.filter(Boolean)
			.join('; ')
	);

	let counterValue = $state(0);
	let displayMessage = $state(false);
	let displayClear = $state(false);
	let inputRef = $state<HTMLInputElement | null>(null);

	const inputClear = () => {
		value = '';
		inputRef?.focus();
	};

	const handleFocus = () => {
		if (!error && !persistentMessage) displayMessage = true;
	};

	const handleBlur = () => {
		if (!error && !persistentMessage) displayMessage = false;
	};

	$effect(() => {
		if (persistentMessage || error) displayMessage = true;
		else displayMessage = false;
	});

	$effect(() => {
		const valueStr = value?.toString() || '';

		if (valueStr && typeof max === 'number' && max > 0 && valueStr.length > max) {
			const truncated = valueStr.slice(0, max);
			if (typeof value === 'number') {
				const numValue = Number(truncated);
				value = Number.isNaN(numValue) ? 0 : numValue;
			} else {
				value = truncated;
			}
		}

		counterValue = valueStr.length;
	});

	$effect(() => {
		if (persistentClear) displayClear = true;
		else displayClear = !!(`${value ?? ''}`.length > 0);
	});

	let messageValue = $derived(error ? errorMessage || message : message);
</script>

<div
	bind:this={ref}
	class={componentClass}
	style={mergedStyle}
	{...restProps}
	data-size={safeSize}
	data-variant={safeVariant}
	data-density={safeDensity}
	data-light={light || undefined}
	data-dark={dark || undefined}
	data-disabled={disabled}
	data-readonly={readonly}
	data-error={error}
	data-hide-spin-buttons={type === 'number' && hideSpinButtons}
	data-rounded={rounded}
>
	{#if prepend}
		<div class="kit-textfield__prepend">
			{@render prepend?.()}
		</div>
	{/if}

	<div class="kit-textfield__control">
		<div class="kit-textfield__field">
			{#if safeVariant === 'outline' || safeVariant === 'filled'}
				<span class="outline"></span>
			{/if}
			{#if safeVariant === 'text'}
				<span class="line"></span>
			{/if}

			{#if prependInner}
				<div class="kit-textfield__prepend-inner">
					{@render prependInner?.()}
				</div>
			{/if}

			<div class="kit-textfield__input-wrap">
				{#if prefix}
					<span class="kit-textfield__prefix">{prefix}</span>
				{/if}

				<input
					bind:this={inputRef}
					bind:value
					{id}
					{name}
					{type}
					{placeholder}
					{autocomplete}
					{inputmode}
					size="1"
					maxlength={max}
					minlength={min}
					{disabled}
					{readonly}
					aria-invalid={error || undefined}
					aria-describedby={messageValue ? `${id ?? name ?? 'textfield'}-message` : undefined}
					onfocus={handleFocus}
					onblur={handleBlur}
				/>

				{#if suffix}
					<span class="kit-textfield__suffix">{suffix}</span>
				{/if}
			</div>

			{#if clearable}
				<button
					type="button"
					class="kit-textfield__clear"
					data-visible={displayClear}
					aria-label="Clear input"
					onclick={inputClear}
				>
					<Icon name="mgc_close_circle_fill" />
				</button>
			{/if}

			{#if appendInner}
				<div class="kit-textfield__append-inner">
					{@render appendInner?.()}
				</div>
			{/if}
		</div>
	</div>

	{#if append}
		<div class="kit-textfield__append">
			{@render append?.()}
		</div>
	{/if}

	<div class="kit-textfield__message" data-visible={displayMessage}>
		<div
			class="kit-textfield__message-inner"
			data-error={error || undefined}
			id={messageValue ? `${id ?? name ?? 'textfield'}-message` : undefined}
		>
			{#if messagePrefix}
				<div class="kit-textfield__message-prefix">{messagePrefix}</div>
			{/if}
			{#if messageValue}
				<div class="kit-textfield__message-text">{messageValue}</div>
			{/if}
			{#if counter || messageSuffix}
				<div class="kit-textfield__message-suffix">
					{#if counter}
						{counterValue}{max ? `/${max}` : ''}
					{:else if messageSuffix}
						{messageSuffix}
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	button,
	input {
		font: inherit;
		color: inherit;
	}

	input {
		appearance: none;
		background: transparent;
		border: 0;
		padding: 0;
		margin: 0;
		outline: none;
		box-shadow: none;
	}

	button {
		appearance: none;
		background: none;
		border: 0;
		padding: 0;
	}

	.kit-textfield {
		--kit-textfield-background: var(--kit-surface-2);
		--kit-textfield-color: var(--kit-fg);
		--kit-textfield-border: color-mix(in oklab, var(--kit-textfield-color), transparent 84%);
		--kit-textfield-radius: 8px;
		--kit-textfield-font-size: 14px;
		--kit-textfield-gap-base: 8px;
		--kit-textfield-px-base: 14px;
		--kit-textfield-py-base: 12px;
		--kit-textfield-message-offset-base: 8px;
		--kit-textfield-density-gap-adjust: 0px;
		--kit-textfield-density-px-adjust: 0px;
		--kit-textfield-density-py-adjust: 0px;
		--kit-textfield-density-message-adjust: 0px;
		--kit-textfield-gap: calc(
			var(--kit-textfield-gap-base) + var(--kit-textfield-density-gap-adjust)
		);
		--kit-textfield-px: calc(var(--kit-textfield-px-base) + var(--kit-textfield-density-px-adjust));
		--kit-textfield-py: calc(var(--kit-textfield-py-base) + var(--kit-textfield-density-py-adjust));
		--kit-textfield-message-offset: calc(
			var(--kit-textfield-message-offset-base) + var(--kit-textfield-density-message-adjust)
		);

		display: grid;
		grid-template-areas:
			'prepend control append'
			'. message .';
		grid-template-columns: auto minmax(0, 1fr) auto;
		grid-template-rows: auto auto;
		align-items: start;
		column-gap: 16px;
		width: 100%;
		font-size: var(--kit-textfield-font-size);
	}

	.kit-textfield[data-size='xs'] {
		--kit-textfield-font-size: 12px;
		--kit-textfield-gap-base: 6px;
		--kit-textfield-px-base: 10px;
		--kit-textfield-py-base: 8px;
	}

	.kit-textfield[data-size='sm'] {
		--kit-textfield-font-size: 13px;
		--kit-textfield-gap-base: 6px;
		--kit-textfield-px-base: 12px;
		--kit-textfield-py-base: 10px;
	}

	.kit-textfield[data-size='md'] {
		--kit-textfield-font-size: 14px;
		--kit-textfield-gap-base: 8px;
		--kit-textfield-px-base: 14px;
		--kit-textfield-py-base: 12px;
	}

	.kit-textfield[data-size='lg'] {
		--kit-textfield-font-size: 15px;
		--kit-textfield-gap-base: 10px;
		--kit-textfield-px-base: 16px;
		--kit-textfield-py-base: 14px;
	}

	.kit-textfield[data-size='xl'] {
		--kit-textfield-font-size: 16px;
		--kit-textfield-gap-base: 12px;
		--kit-textfield-px-base: 18px;
		--kit-textfield-py-base: 16px;
	}

	.kit-textfield[data-density='compact'] {
		--kit-textfield-density-gap-adjust: -1px;
		--kit-textfield-density-px-adjust: -2px;
		--kit-textfield-density-py-adjust: -2px;
		--kit-textfield-density-message-adjust: -2px;
	}

	.kit-textfield[data-density='comfortable'] {
		--kit-textfield-density-gap-adjust: 1px;
		--kit-textfield-density-px-adjust: 2px;
		--kit-textfield-density-py-adjust: 2px;
		--kit-textfield-density-message-adjust: 2px;
	}

	.kit-textfield[data-variant='filled'] .kit-textfield__field {
		background: var(--kit-textfield-background);
	}

	.kit-textfield[data-variant='outline'] .kit-textfield__field {
		background: color-mix(in oklab, var(--kit-textfield-background), transparent 90%);
	}

	.kit-textfield[data-variant='text'] .kit-textfield__field {
		background: transparent;
		border-radius: 0;
	}

	.kit-textfield[data-light='true'] {
		--kit-textfield-background: color-mix(in oklab, white 88%, var(--kit-surface-1));
		--kit-textfield-color: var(--kit-fg);
	}

	.kit-textfield[data-dark='true'] {
		--kit-textfield-background: color-mix(in oklab, black 72%, var(--kit-surface-3));
		--kit-textfield-color: white;
		--kit-textfield-border: color-mix(in oklab, white, transparent 74%);
	}

	.kit-textfield[data-disabled='true'] {
		opacity: var(--kit-disabled-opacity, 0.55);
		pointer-events: none;
	}

	.kit-textfield[data-readonly='true'] input {
		cursor: default;
	}

	.kit-textfield[data-hide-spin-buttons='true'] input[type='number'] {
		appearance: textfield;
		-moz-appearance: textfield;
	}

	.kit-textfield[data-hide-spin-buttons='true'] input[type='number']::-webkit-inner-spin-button,
	.kit-textfield[data-hide-spin-buttons='true'] input[type='number']::-webkit-outer-spin-button {
		appearance: none;
		-webkit-appearance: none;
		margin: 0;
	}

	.kit-textfield[data-rounded='0'] {
		--kit-textfield-radius: 0;
	}

	.kit-textfield[data-rounded='xs'] {
		--kit-textfield-radius: 2px;
	}

	.kit-textfield[data-rounded='sm'] {
		--kit-textfield-radius: 4px;
	}

	.kit-textfield[data-rounded='md'] {
		--kit-textfield-radius: 8px;
	}

	.kit-textfield[data-rounded='lg'] {
		--kit-textfield-radius: 16px;
	}

	.kit-textfield[data-rounded='xl'] {
		--kit-textfield-radius: 99999px;
	}

	.kit-textfield__prepend,
	.kit-textfield__append {
		display: flex;
		align-items: center;
	}

	.kit-textfield__prepend {
		grid-area: prepend;
	}

	.kit-textfield__append {
		grid-area: append;
	}

	.kit-textfield__control {
		grid-area: control;
		display: flex;
		min-width: 0;
	}

	.kit-textfield__field {
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--kit-textfield-gap);
		width: 100%;
		min-width: 0;
		padding: var(--kit-textfield-py) var(--kit-textfield-px);
		border-radius: var(--kit-textfield-radius);
		color: var(--kit-textfield-color);
	}

	.kit-textfield__prepend-inner,
	.kit-textfield__append-inner {
		position: relative;
		z-index: 1;
		display: inline-flex;
		align-items: center;
		flex: 0 0 auto;
	}

	.kit-textfield__input-wrap {
		position: relative;
		z-index: 1;
		display: flex;
		align-items: center;
		gap: 6px;
		flex: 1 1 auto;
		min-width: 0;
		width: 100%;
	}

	.kit-textfield__input-wrap input {
		flex: 1 1 auto;
		width: 100%;
		min-width: 0;
	}

	.kit-textfield__prefix,
	.kit-textfield__suffix {
		display: inline-flex;
		align-items: center;
		white-space: nowrap;
		color: color-mix(in oklab, currentColor, transparent 20%);
	}

	.kit-textfield__clear {
		position: relative;
		z-index: 1;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: 0 0 auto;
		cursor: pointer;
		opacity: 0;
		pointer-events: none;
	}

	.kit-textfield__clear[data-visible='true'] {
		opacity: 1;
		pointer-events: auto;
	}

	.kit-textfield .outline,
	.kit-textfield .line {
		pointer-events: none;
		position: absolute;
		left: 0;
		right: 0;
	}

	.kit-textfield .outline {
		--outline-color: var(--kit-textfield-border);
		top: 0;
		bottom: 0;
	}

	.kit-textfield .line {
		bottom: 0;
		height: 1px;
		background: var(--kit-textfield-border);
	}

	.kit-textfield[data-error='true'] .outline {
		--outline-color: var(--kit-danger, hsl(5 80% 55%));
	}

	.kit-textfield[data-error='true'] .line {
		background: var(--kit-danger, hsl(5 80% 55%));
	}

	.kit-textfield__message {
		grid-area: message;
		padding-top: var(--kit-textfield-message-offset);
		padding-inline: var(--kit-textfield-px);
		font-size: 12px;
		opacity: 0;
	}

	.kit-textfield__message[data-visible='true'] {
		opacity: 1;
	}

	.kit-textfield__message-inner {
		display: grid;
		grid-template-columns: max-content minmax(0, 1fr) max-content;
		gap: var(--kit-textfield-gap);
		align-items: start;
		min-height: 14px;
	}

	.kit-textfield__message-inner[data-error='true'] {
		color: var(--kit-danger, hsl(5 80% 55%));
	}

	.kit-textfield__message-prefix,
	.kit-textfield__message-suffix {
		line-height: 1.2;
	}

	.kit-textfield__message-text {
		line-height: 1.2;
		word-break: break-word;
	}
</style>
