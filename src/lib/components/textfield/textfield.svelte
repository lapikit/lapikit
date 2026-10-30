<script lang="ts">
	import Field from '../field/field.svelte';
	import type { TextfieldProps } from './textfield.types.ts';

	let {
		ref = $bindable(),
		value = $bindable(),
		type = 'text',
		maxlength,
		counter = false,
		hideSpinButtons = false,
		class: className,
		style: styleAttr,
		's-class': sClass,
		's-style': sStyle,
		id,
		variant,
		size,
		density,
		rounded,
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
		persistentMessage,
		clearable,
		clearLabel,
		persistentClear,
		prefix,
		suffix,
		prepend,
		append,
		prependInner,
		appendInner,
		...rest
	}: TextfieldProps = $props();

	let inputRef = $state<HTMLInputElement | null>(null);
	let text = $derived(`${value ?? ''}`);

	function clear() {
		value = '';
		inputRef?.focus();
	}
</script>

<Field
	bind:ref
	class={['kit-textfield', className]}
	style={styleAttr}
	s-class={sClass}
	s-style={sStyle}
	id={id ?? undefined}
	{variant}
	{size}
	{density}
	{rounded}
	{color}
	{elevation}
	{label}
	{disabled}
	{readonly}
	{error}
	{errorMessage}
	{message}
	{messagePrefix}
	{messageSuffix}
	{persistentMessage}
	{clearable}
	{clearLabel}
	{persistentClear}
	{prefix}
	{suffix}
	{prepend}
	{append}
	{prependInner}
	{appendInner}
	dirty={text.length > 0}
	counter={counter ? `${text.length}${maxlength ? `/${maxlength}` : ''}` : undefined}
	onclear={clear}
	data-hide-spin-buttons={type === 'number' && hideSpinButtons}
>
	{#snippet children(control)}
		<input
			{...rest}
			{...control}
			bind:this={inputRef}
			bind:value
			class="kit-textfield__input"
			{type}
			size="1"
			{maxlength}
		/>
	{/snippet}
</Field>

<style>
	.kit-textfield__input {
		appearance: none;
		flex: 1 1 auto;
		width: 100%;
		min-width: 0;
		margin: 0;
		padding: 0;
		border: 0;
		outline: none;
		background: transparent;
		box-shadow: none;
		color: inherit;
		font: inherit;
	}

	.kit-textfield__input[readonly] {
		cursor: default;
	}

	:global([data-hide-spin-buttons='true']) .kit-textfield__input[type='number'] {
		appearance: textfield;
		-moz-appearance: textfield;
	}

	:global([data-hide-spin-buttons='true'])
		.kit-textfield__input[type='number']::-webkit-inner-spin-button,
	:global([data-hide-spin-buttons='true'])
		.kit-textfield__input[type='number']::-webkit-outer-spin-button {
		appearance: none;
		margin: 0;
	}
</style>
