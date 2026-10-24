<script lang="ts">
	import { useComponentAttrs, useElevation } from '$lib/utils';
	import { ripple } from '$lib/animations';
	import type { ButtonProps } from './btn.types.ts';

	let {
		ref = $bindable(),
		is = 'button',
		children,
		class: className,
		style: styleAttr,
		's-class': sClass,
		's-style': sStyle,
		variant = 'filled',
		density = 'default',
		loading,
		active = false,
		size = 'md',
		rounded = 'sm',
		disabled = false,
		block,
		href,
		input,
		type,
		checked,
		value,
		label,
		wide,
		noRipple,
		load,
		append,
		prepend,
		icon,
		elevation,
		color,
		...rest
	}: ButtonProps = $props();

	let attrs = $derived(
		useComponentAttrs('kit-btn', { className, sClass, styleAttr, sStyle, color, active }, rest)
	);
	let elevationState = $derived(useElevation(elevation));
	let hasOutline = $derived(variant === 'outline' || variant === 'surface');

	let isInput = $derived(!!input || is === 'input');
	let isDisabled = $derived(!!disabled);
	let tag = $derived<'button' | 'a' | 'label' | 'div'>(
		isInput
			? type === 'checkbox' || type === 'radio'
				? 'label'
				: 'div'
			: href || is === 'a'
				? 'a'
				: 'button'
	);
	let resolvedHref = $derived(tag === 'a' && !isDisabled ? href : undefined);
	let resolvedType = $derived(tag === 'button' ? (type ?? 'button') : undefined);
	let resolvedDisabled = $derived(tag === 'button' ? isDisabled : undefined);
	let resolvedTabIndex = $derived(tag === 'a' && isDisabled ? -1 : undefined);
</script>

<svelte:element
	this={tag}
	bind:this={ref}
	class={attrs.class}
	style={attrs.style}
	href={resolvedHref}
	type={resolvedType}
	disabled={resolvedDisabled}
	tabindex={resolvedTabIndex}
	data-variant={variant}
	data-size={size}
	data-density={density}
	data-rounded={rounded}
	data-elevation={elevationState.base}
	data-elevation-hover={elevationState.hover}
	data-elevation-active={elevationState.active}
	data-interactive={true}
	data-active={active}
	data-disabled={isDisabled}
	data-loading={loading}
	data-block={block}
	data-wide={wide}
	data-icon={icon}
	aria-busy={loading || undefined}
	aria-disabled={isDisabled || undefined}
	use:ripple={{
		component: 'btn',
		disabled: noRipple || isDisabled
	}}
	{...isInput ? {} : attrs.rest}
>
	{#if hasOutline}
		<span class="outline"></span>
	{/if}

	{#if isInput}
		<input
			{...attrs.rest}
			class="kit-btn__input"
			data-ripple-host
			type={type || 'button'}
			{checked}
			{value}
			aria-label={label || (value != null ? String(value) : undefined)}
			disabled={isDisabled}
		/>
	{:else}
		<span class="kit-btn__inner">
			{#if prepend}
				<span class="kit-btn__prepend">{@render prepend()}</span>
			{/if}
			{#if children}
				<span class="kit-btn__content">{@render children()}</span>
			{/if}
			{#if append}
				<span class="kit-btn__append">{@render append()}</span>
			{/if}
		</span>
	{/if}

	{#if loading}
		<span class="kit-btn__spinner">
			{#if load}
				{@render load()}
			{:else}
				...
			{/if}
		</span>
	{/if}
</svelte:element>

<style lang="scss">
	@use './btn';
</style>
