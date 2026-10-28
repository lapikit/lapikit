<script lang="ts">
	import Field from '$lib/components/field/field.svelte';
	import type { TextareaProps } from './textarea.types.ts';

	let {
		ref = $bindable(),
		value = $bindable(),
		rows = 3,
		autoGrow = false,
		maxRows,
		noResize = false,
		maxlength,
		counter = false,
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
	}: TextareaProps = $props();

	let textareaRef = $state<HTMLTextAreaElement | null>(null);
	let text = $derived(value ?? '');

	$effect(() => {
		if (!autoGrow || !textareaRef) return;
		void text;
		const element = textareaRef;
		const styles = getComputedStyle(element);
		const lineHeight = parseFloat(styles.lineHeight) || parseFloat(styles.fontSize) * 1.5;
		const max = maxRows ? maxRows * lineHeight : Infinity;
		element.style.height = 'auto';
		element.style.height = `${Math.min(element.scrollHeight, max)}px`;
		element.style.overflowY = element.scrollHeight > max ? 'auto' : 'hidden';
	});

	function clear() {
		value = '';
		textareaRef?.focus();
	}
</script>

<Field
	bind:ref
	class={['kit-textarea', className]}
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
	data-resize={!noResize && !autoGrow}
>
	{#snippet children(control)}
		<textarea
			{...rest}
			{...control}
			bind:this={textareaRef}
			bind:value
			class="kit-textarea__input"
			{rows}
			{maxlength}
		></textarea>
	{/snippet}
</Field>

<style lang="scss">
	@use './textarea';
</style>
