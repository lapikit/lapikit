<script lang="ts">
	import { useComponentAttrs } from '$lib/utils';
	import { setRadioGroup } from '../radio.context.ts';
	import type { RadioGroupProps } from '../radio.types.ts';

	let {
		ref = $bindable(),
		value = $bindable(null),
		name,
		label,
		inline = false,
		size,
		color,
		disabled = false,
		required = false,
		error = false,
		message,
		errorMessage,
		children,
		class: className,
		style: styleAttr,
		's-class': sClass,
		's-style': sStyle,
		...rest
	}: RadioGroupProps = $props();

	const generatedId = $props.id();

	let attrs = $derived(
		useComponentAttrs('kit-radio-group', { className, sClass, styleAttr, sStyle }, rest)
	);
	let messageValue = $derived(error ? errorMessage || message : message);
	let messageId = $derived(messageValue ? `${generatedId}-message` : undefined);

	setRadioGroup({
		get name() {
			return name || generatedId;
		},
		get value() {
			return value;
		},
		set value(next) {
			value = next;
		},
		get size() {
			return size;
		},
		get color() {
			return color;
		},
		get disabled() {
			return disabled;
		},
		get required() {
			return required;
		},
		get error() {
			return error;
		},
		get describedby() {
			return messageId;
		}
	});
</script>

<fieldset
	bind:this={ref}
	class={attrs.class}
	style={attrs.style}
	data-inline={inline}
	data-error={error}
	data-disabled={disabled}
	role="radiogroup"
	aria-invalid={error || undefined}
	aria-required={required || undefined}
	{disabled}
	{...attrs.rest}
>
	{#if label}
		<legend class="kit-radio-group__label">{label}</legend>
	{/if}
	<div class="kit-radio-group__items">
		{@render children?.()}
	</div>
	{#if messageValue}
		<div class="kit-radio-group__message" id={messageId}>{messageValue}</div>
	{/if}
</fieldset>

<style lang="scss">
	@use './radio-group';
</style>
