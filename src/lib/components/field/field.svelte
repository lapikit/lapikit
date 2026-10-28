<script lang="ts">
	import { useComponentAttrs, useElevation } from '$lib/utils';
	import type { FieldControlProps, FieldProps } from './field.types.ts';

	let {
		ref = $bindable(),
		children,
		class: className,
		style: styleAttr,
		's-class': sClass,
		's-style': sStyle,
		id,
		variant = 'filled',
		size = 'md',
		density = 'default',
		rounded = 'md',
		color,
		elevation,
		label,
		disabled = false,
		readonly = false,
		error = false,
		errorMessage,
		message,
		messagePrefix,
		messageSuffix,
		persistentMessage = false,
		counter,
		clearable = false,
		clearLabel = 'Clear',
		persistentClear = false,
		dirty = false,
		onclear,
		prefix,
		suffix,
		prepend,
		append,
		prependInner,
		appendInner,
		...rest
	}: FieldProps = $props();

	const generatedId = $props.id();

	let attrs = $derived(
		useComponentAttrs('kit-field', { className, sClass, styleAttr, sStyle, color }, rest)
	);
	let elevationState = $derived(useElevation(elevation));
	let hasOutline = $derived(variant === 'outline' || variant === 'surface');

	let focused = $state(false);
	let controlId = $derived(id || generatedId);
	let messageValue = $derived(error ? errorMessage || message : message);
	let hasMessage = $derived(!!(messageValue || messagePrefix || messageSuffix || counter));
	let messageId = $derived(hasMessage ? `${controlId}-message` : undefined);
	let showMessage = $derived(error || persistentMessage || focused);
	let showClear = $derived(persistentClear || dirty);

	let control: FieldControlProps = $derived({
		id: controlId,
		'aria-describedby': messageId,
		'aria-invalid': error || undefined,
		disabled,
		readonly
	});
</script>

<div
	bind:this={ref}
	class={attrs.class}
	style={attrs.style}
	data-variant={variant}
	data-size={size}
	data-density={density}
	data-rounded={rounded}
	data-disabled={disabled}
	data-readonly={readonly}
	data-error={error}
	data-focused={focused}
	data-with-label={!!label}
	data-with-message={hasMessage}
	onfocusin={() => (focused = true)}
	onfocusout={() => (focused = false)}
	{...attrs.rest}
>
	{#if label}
		<label class="kit-field__label" id="{controlId}-label" for={controlId}>{label}</label>
	{/if}

	{#if prepend}
		<div class="kit-field__prepend">{@render prepend()}</div>
	{/if}

	<div
		class="kit-field__box"
		data-elevation={elevationState.base}
		data-elevation-hover={elevationState.hover}
		data-elevation-active={elevationState.active}
	>
		{#if hasOutline}
			<span class="outline"></span>
		{:else if variant === 'text'}
			<span class="kit-field__line"></span>
		{/if}

		{#if prependInner}
			<div class="kit-field__prepend-inner">{@render prependInner()}</div>
		{/if}

		<div class="kit-field__control">
			{#if prefix}
				<span class="kit-field__prefix">{prefix}</span>
			{/if}

			{@render children?.(control)}

			{#if suffix}
				<span class="kit-field__suffix">{suffix}</span>
			{/if}
		</div>

		{#if clearable}
			<button
				type="button"
				class="kit-field__clear"
				data-visible={showClear}
				aria-label={clearLabel}
				tabindex={showClear ? undefined : -1}
				{disabled}
				onclick={() => onclear?.()}
			>
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<path
						d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.3 12.9-1.4 1.4L12 13.4l-2.9 2.9-1.4-1.4 2.9-2.9-2.9-2.9 1.4-1.4 2.9 2.9 2.9-2.9 1.4 1.4-2.9 2.9z"
						fill="currentColor"
					></path>
				</svg>
			</button>
		{/if}

		{#if appendInner}
			<div class="kit-field__append-inner">{@render appendInner()}</div>
		{/if}
	</div>

	{#if append}
		<div class="kit-field__append">{@render append()}</div>
	{/if}

	{#if hasMessage}
		<div class="kit-field__message" id={messageId} data-visible={showMessage}>
			{#if messagePrefix}
				<span class="kit-field__message-prefix">{messagePrefix}</span>
			{/if}
			<span class="kit-field__message-text">{messageValue ?? ''}</span>
			{#if counter || messageSuffix}
				<span class="kit-field__message-suffix">{counter ?? messageSuffix}</span>
			{/if}
		</div>
	{/if}
</div>

<style lang="scss">
	@use './field';
</style>
