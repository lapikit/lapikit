<script lang="ts">
	import { useComponentAttrs } from '$lib/utils';
	import { getRadioGroup } from './radio.context.ts';
	import type { RadioProps } from './radio.types.ts';

	let {
		ref = $bindable(),
		group = $bindable(),
		value,
		label,
		children,
		size,
		color,
		disabled = false,
		error,
		name,
		required,
		id,
		onchange,
		class: className,
		style: styleAttr,
		's-class': sClass,
		's-style': sStyle,
		...rest
	}: RadioProps = $props();

	const radioGroup = getRadioGroup();
	const generatedId = $props.id();

	let attrs = $derived(
		useComponentAttrs(
			'kit-radio',
			{ className, sClass, styleAttr, sStyle, color: color ?? radioGroup?.color },
			rest
		)
	);
	let current = $derived(radioGroup ? radioGroup.value : group);
	let isDisabled = $derived(disabled || !!radioGroup?.disabled);
	let hasError = $derived(error ?? !!radioGroup?.error);

	const change: typeof onchange = (event) => {
		if (radioGroup) radioGroup.value = value;
		else group = value;
		onchange?.(event);
	};
</script>

<div
	class={attrs.class}
	style={attrs.style}
	data-size={size ?? radioGroup?.size ?? 'md'}
	data-disabled={isDisabled}
	data-error={hasError}
>
	<label class="kit-radio__label">
		<span class="kit-radio__control">
			<input
				{...attrs.rest}
				bind:this={ref}
				id={id || generatedId}
				class="kit-radio__input"
				type="radio"
				name={radioGroup?.name ?? name}
				checked={current === value}
				{value}
				disabled={isDisabled}
				required={required ?? radioGroup?.required}
				aria-describedby={radioGroup?.describedby}
				onchange={change}
			/>
		</span>
		{#if children}
			<span class="kit-radio__text">{@render children()}</span>
		{:else if label}
			<span class="kit-radio__text">{label}</span>
		{/if}
	</label>
</div>

<style lang="scss">
	@use './radio';
</style>
