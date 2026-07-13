<script lang="ts">
	import { useClassName, useElevation, useStyles } from '$lib/utils';
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
		rounded = 'md',
		class: className = '',
		style: styleAttr = '',
		's-class': sClass,
		's-style': sStyle,
		name,
		id,
		autocomplete,
		inputmode,
		elevation,
		...rest
	}: TextfieldProps = $props();

	let { classProps, styleProps, restProps } = $derived(
		makeComponentProps(rest as Record<string, unknown>)
	);

	let elevationState = $derived(useElevation(elevation));

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

	let mergedStyle = $derived([componentStyle].filter(Boolean).join('; '));

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
	data-size={size}
	data-variant={variant}
	data-density={density}
	data-disabled={disabled}
	data-readonly={readonly}
	data-error={error}
	data-hide-spin-buttons={type === 'number' && hideSpinButtons}
	data-rounded={rounded}
	data-with-message={(messageValue || messagePrefix || messageSuffix || counter) && true}
	style:--kit-textfield-fg={color && `var(--kit-color-${color})`}
	style:--kit-textfield-bg={background && `var(--kit-color-${background})`}
>
	{#if prepend}
		<div class="kit-textfield__prepend">
			{@render prepend?.()}
		</div>
	{/if}

	<div class="kit-textfield__control">
		<div
			class="kit-textfield__field"
			data-elevation={elevationState.base}
			data-elevation-hover={elevationState.hover}
			data-elevation-active={elevationState.active}
		>
			{#if variant === 'outline' || variant === 'filled'}
				<span class="outline"></span>
			{/if}
			{#if variant === 'text'}
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

	{#if messageValue || messagePrefix || messageSuffix || counter}
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
	{/if}
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
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		align-items: start;
		column-gap: var(--kit-textfield-gap);
		width: 100%;
		font-size: var(--kit-textfield-font);
	}

	.kit-textfield:not([data-with-message='true']) {
		grid-template-areas: 'prepend control append';
		grid-template-rows: auto;
	}
	.kit-textfield[data-with-message='true'] {
		grid-template-areas:
			'prepend control append'
			'. message .';
		grid-template-rows: auto auto;
	}

	.kit-textfield[data-disabled='true'] {
		opacity: 0.55;
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

	/**
	* size
	* @link nothing...
	*/
	.kit-textfield[data-size='xs'] {
		--kit-textfield-h: 28px;
		--kit-textfield-px: 6px;
		--kit-textfield-py: 10px;
		--kit-textfield-gap: 8px;
		--kit-textfield-font: 12px;
	}
	.kit-textfield[data-size='xs'] :global(.kit-icon[data-size='default']) {
		--kit-icon-current-size: 0.875rem;
	}
	.kit-textfield[data-size='sm'] {
		--kit-textfield-h: 32px;
		--kit-textfield-px: 14px;
		--kit-textfield-py: 12px;
		--kit-textfield-gap: 6px;
		--kit-textfield-font: 13px;
	}
	.kit-textfield[data-size='sm'] :global(.kit-icon[data-size='default']) {
		--kit-icon-current-size: 1rem;
	}

	.kit-textfield[data-size='md'] {
		--kit-textfield-h: 40px;
		--kit-textfield-px: 14px;
		--kit-textfield-py: 12px;
		--kit-textfield-gap: 8px;
		--kit-textfield-font: 14px;
	}
	.kit-textfield[data-size='md'] :global(.kit-icon[data-size='default']) {
		--kit-icon-current-size: 1.125rem;
	}

	.kit-textfield[data-size='lg'] {
		--kit-textfield-h: 48px;
		--kit-textfield-px: 16px;
		--kit-textfield-py: 14px;
		--kit-textfield-gap: 10px;
		--kit-textfield-font: 15px;
	}
	.kit-textfield[data-size='lg'] :global(.kit-icon[data-size='default']) {
		--kit-icon-current-size: 1.25rem;
	}

	.kit-textfield[data-size='xl'] {
		--kit-textfield-h: 56px;
		--kit-textfield-px: 18px;
		--kit-textfield-py: 16px;
		--kit-textfield-gap: 12px;
		--kit-textfield-font: 16px;
	}
	.kit-textfield[data-size='xl'] :global(.kit-icon[data-size='default']) {
		--kit-icon-current-size: 1.375rem;
	}

	/** 
	 * variant
	 * @link no link
	 */
	.kit-textfield[data-variant='filled'] {
		--kit-textfield-bg: var(--kit-color-surface-2);
		--kit-textfield-fg: var(--kit-color-text);

		--kit-textfield-hover-bg: color-mix(in oklab, var(---kit-textfield-bg), black 10%);
		--kit-textfield-active-bg: color-mix(in oklab, var(--kit-textfield-bg), black 16%);
	}
	.kit-textfield[data-variant='outline'] {
		--kit-textfield-bg: transparent;
		--kit-textfield-fg: var(--kit-color-text);
		--kit-textfield-bd: var(--kit-textfield-fg);

		--kit-textfield-hover-bg: color-mix(in oklab, var(--kit-textfield-fg), transparent 80%);
		--kit-textfield-active-bg: color-mix(in oklab, var(--kit-textfield-fg), transparent 92%);
	}
	.kit-textfield[data-variant='text'] {
		--kit-textfield-bg: transparent;
		--kit-textfield-fg: var(--kit-color-text);
		--kit-textfield-bd: var(--kit-textfield-fg);

		--kit-textfield-hover-bg: color-mix(in oklab, var(--kit-textfield-fg), transparent 80%);
		--kit-textfield-active-bg: color-mix(in oklab, var(--kit-textfield-fg), transparent 92%);
	}

	/** 
	 * density
	 * @link ...
	 */
	.kit-textfield[data-density='none'] {
		--kit-textfield-density-scale: 0;
		--kit-textfield-density-h-scale: 0;
	}
	.kit-textfield[data-density='compact'] {
		--kit-textfield-density-scale: 0.9;
		--kit-textfield-density-h-scale: 0.92;
	}
	.kit-textfield[data-density='default'] {
		--kit-textfield-density-scale: 1;
		--kit-textfield-density-h-scale: 1;
	}
	.kit-textfield[data-density='comfortable'] {
		--kit-textfield-density-scale: 1.1;
		--kit-textfield-density-h-scale: 1.15;
	}

	/** 
	 * rounded
	 * @link ...
	 */
	.kit-textfield[data-rounded='0'] {
		--kit-textfield-radius: var(--kit-shape-none);
	}
	.kit-textfield[data-rounded='xs'] {
		--kit-textfield-radius: var(--kit-shape-xs);
	}
	.kit-textfield[data-rounded='sm'] {
		--kit-textfield-radius: var(--kit-shape-sm);
	}
	.kit-textfield[data-rounded='md'] {
		--kit-textfield-radius: var(--kit-shape-md);
	}
	.kit-textfield[data-rounded='lg'] {
		--kit-textfield-radius: var(--kit-shape-lg);
	}
	.kit-textfield[data-rounded='xl'] {
		--kit-textfield-radius: var(--kit-shape-xl);
	}

	.kit-textfield__prepend,
	.kit-textfield__append {
		display: flex;
		align-items: center;
		height: 100%;
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
		min-height: calc(var(--kit-textfield-h) * var(--kit-textfield-density-h-scale));
		padding: 0 calc(var(--kit-textfield-px) * var(--kit-textfield-density-scale));
		border-radius: var(--kit-textfield-radius);
		background: var(--kit-textfield-bg);
		color: var(--kit-textfield-fg);
		font-size: var(--kit-textfield-font);
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
		--outline-color: var(--kit-textfield-bd);
		top: 0;
		bottom: 0;
	}

	.kit-textfield .line {
		bottom: 0;
		height: 1px;
		background: var(--kit-textfield-bd);
	}

	.kit-textfield[data-error='true'] .outline {
		--outline-color: var(--kit-color-error);
	}

	.kit-textfield[data-error='true'] .line {
		--kit-textfield-bd: var(--kit-color-error);
	}

	.kit-textfield__message {
		grid-area: message;
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
		color: var(--kit-color-error);
	}

	.kit-textfield__message-prefix,
	.kit-textfield__message-suffix {
		line-height: 1.2;
	}

	.kit-textfield__message-suffix {
		align-items: end;
		text-align: end;
	}

	.kit-textfield__message-text {
		line-height: 1.2;
		word-break: break-word;
	}
</style>
