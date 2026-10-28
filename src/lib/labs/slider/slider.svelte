<script lang="ts">
	import { useComponentAttrs } from '$lib/utils';
	import type { SliderProps } from './slider.types.ts';

	let {
		ref = $bindable(),
		value = $bindable(),
		min = 0,
		max = 100,
		step = 1,
		label,
		showValue = false,
		format,
		size = 'md',
		color,
		disabled = false,
		error = false,
		message,
		errorMessage,
		prepend,
		append,
		id,
		class: className,
		style: styleAttr,
		's-class': sClass,
		's-style': sStyle,
		...rest
	}: SliderProps = $props();

	const generatedId = $props.id();

	let attrs = $derived(
		useComponentAttrs('kit-slider', { className, sClass, styleAttr, sStyle, color }, rest)
	);
	let inputId = $derived(id || generatedId);
	let messageValue = $derived(error ? errorMessage || message : message);
	let messageId = $derived(messageValue ? `${inputId}-message` : undefined);
	// the native input puts an empty value in the middle
	let current = $derived(value ?? (max < min ? min : min + (max - min) / 2));
	let progress = $derived(max > min ? ((current - min) / (max - min)) * 100 : 0);
	let valueText = $derived(format ? format(current) : String(current));
</script>

<div
	class={attrs.class}
	style={attrs.style}
	style:--kit-slider-progress="{progress}%"
	data-size={size}
	data-disabled={disabled}
	data-error={error}
>
	{#if label || showValue}
		<div class="kit-slider__header">
			{#if label}
				<label class="kit-slider__label" for={inputId}>{label}</label>
			{/if}
			{#if showValue}
				<output class="kit-slider__value" for={inputId}>{valueText}</output>
			{/if}
		</div>
	{/if}

	<div class="kit-slider__row">
		{#if prepend}
			<div class="kit-slider__prepend">{@render prepend()}</div>
		{/if}
		<input
			{...attrs.rest}
			bind:this={ref}
			bind:value
			id={inputId}
			class="kit-slider__input"
			type="range"
			{min}
			{max}
			{step}
			{disabled}
			aria-valuetext={format ? valueText : undefined}
			aria-describedby={messageId}
			aria-invalid={error || undefined}
		/>
		{#if append}
			<div class="kit-slider__append">{@render append()}</div>
		{/if}
	</div>

	{#if messageValue}
		<div class="kit-slider__message" id={messageId}>{messageValue}</div>
	{/if}
</div>

<style lang="scss">
	@use './slider';
</style>
