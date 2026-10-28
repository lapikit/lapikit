<script lang="ts">
	import { useComponentAttrs } from '$lib/utils';
	import type { CheckboxProps } from './checkbox.types.ts';

	let {
		ref = $bindable(),
		checked = $bindable(false),
		indeterminate = $bindable(false),
		group = $bindable(),
		value,
		label,
		children,
		size = 'md',
		color,
		disabled = false,
		error = false,
		message,
		errorMessage,
		id,
		onchange,
		class: className,
		style: styleAttr,
		's-class': sClass,
		's-style': sStyle,
		...rest
	}: CheckboxProps = $props();

	const generatedId = $props.id();

	let attrs = $derived(
		useComponentAttrs('kit-checkbox', { className, sClass, styleAttr, sStyle, color }, rest)
	);
	let inputId = $derived(id || generatedId);
	let messageValue = $derived(error ? errorMessage || message : message);
	let messageId = $derived(messageValue ? `${inputId}-message` : undefined);
	let isChecked = $derived(group && value !== undefined ? group.includes(value) : checked);

	$effect(() => {
		if (ref) ref.indeterminate = indeterminate;
	});

	const change: typeof onchange = (event) => {
		const next = event.currentTarget.checked;
		indeterminate = false;
		if (group && value !== undefined)
			group = next ? [...group, value] : group.filter((entry) => entry !== value);
		else checked = next;
		onchange?.(event);
	};
</script>

<div
	class={attrs.class}
	style={attrs.style}
	data-size={size}
	data-disabled={disabled}
	data-error={error}
>
	<label class="kit-checkbox__label">
		<span class="kit-checkbox__control">
			<input
				{...attrs.rest}
				bind:this={ref}
				id={inputId}
				class="kit-checkbox__input"
				type="checkbox"
				checked={isChecked}
				{value}
				{disabled}
				aria-describedby={messageId}
				aria-invalid={error || undefined}
				onchange={change}
			/>
			<svg class="kit-checkbox__icon" viewBox="0 0 24 24" aria-hidden="true">
				{#if indeterminate}
					<path d="M5 11h14v2H5z" fill="currentColor"></path>
				{:else}
					<path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" fill="currentColor"></path>
				{/if}
			</svg>
		</span>
		{#if children}
			<span class="kit-checkbox__text">{@render children()}</span>
		{:else if label}
			<span class="kit-checkbox__text">{label}</span>
		{/if}
	</label>

	{#if messageValue}
		<div class="kit-checkbox__message" id={messageId}>{messageValue}</div>
	{/if}
</div>

<style lang="scss">
	@use './checkbox';
</style>
