<script lang="ts">
	import { useComponentAttrs } from '$lib/utils';
	import type { SwitchProps } from './switch.types.ts';

	let {
		ref = $bindable(),
		checked = $bindable(false),
		value,
		label,
		children,
		reverse = false,
		size = 'md',
		color,
		disabled = false,
		error = false,
		message,
		errorMessage,
		id,
		class: className,
		style: styleAttr,
		's-class': sClass,
		's-style': sStyle,
		...rest
	}: SwitchProps = $props();

	const generatedId = $props.id();

	let attrs = $derived(
		useComponentAttrs('kit-switch', { className, sClass, styleAttr, sStyle, color }, rest)
	);
	let inputId = $derived(id || generatedId);
	let messageValue = $derived(error ? errorMessage || message : message);
	let messageId = $derived(messageValue ? `${inputId}-message` : undefined);
</script>

<div
	class={attrs.class}
	style={attrs.style}
	data-size={size}
	data-disabled={disabled}
	data-error={error}
	data-reverse={reverse}
>
	<label class="kit-switch__label">
		<span class="kit-switch__control">
			<input
				{...attrs.rest}
				bind:this={ref}
				bind:checked
				id={inputId}
				class="kit-switch__input"
				type="checkbox"
				role="switch"
				{value}
				{disabled}
				aria-describedby={messageId}
				aria-invalid={error || undefined}
			/>
			<span class="kit-switch__thumb" aria-hidden="true"></span>
		</span>
		{#if children}
			<span class="kit-switch__text">{@render children()}</span>
		{:else if label}
			<span class="kit-switch__text">{label}</span>
		{/if}
	</label>

	{#if messageValue}
		<div class="kit-switch__message" id={messageId}>{messageValue}</div>
	{/if}
</div>

<style lang="scss">
	@use './switch';
</style>
