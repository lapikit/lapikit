<script lang="ts">
	import { hasPressHandler, pressableAttrs, useComponentAttrs, elevationAttrs } from '$lib/utils';
	import { ripple } from '$lib/animations';
	import { tooltip as tooltipAction } from '../tooltip/tooltip-action.svelte.ts';
	import type { ChipProps } from './chip.types.ts';

	let {
		ref = $bindable(),
		is = 'div',
		children,
		class: className,
		style: styleAttr,
		's-class': sClass,
		's-style': sStyle,
		variant = 'filled',
		density = 'default',
		rounded = 'full',
		interactive,
		loading,
		active = false,
		size = 'md',
		labelStyle = false,
		disabled = false,
		href,
		input,
		type,
		checked,
		value,
		label,
		tooltip,
		noRipple,
		load,
		append,
		prepend,
		readonly = false,
		elevation,
		color,
		...rest
	}: ChipProps = $props();

	let attrs = $derived(
		useComponentAttrs('kit-chip', { className, sClass, styleAttr, sStyle, color, active }, rest)
	);
	let elevationAttributes = $derived(elevationAttrs(elevation));
	let hasOutline = $derived(variant === 'outline' || variant === 'surface');

	let isInput = $derived(!!input || is === 'input');
	let isDisabled = $derived(!!disabled);
	let isReadonly = $derived(!!readonly);
	let isLocked = $derived(isDisabled || isReadonly);
	let focusableDisabled = $derived(isLocked && !!tooltip);
	let isPressable = $derived(hasPressHandler(attrs.rest));
	let tag = $derived<'button' | 'a' | 'label' | 'div'>(
		isInput
			? type === 'checkbox' || type === 'radio'
				? 'label'
				: 'div'
			: href || is === 'a'
				? 'a'
				: is === 'button' || isPressable
					? 'button'
					: 'div'
	);
	// undefined: detected (a, button, input, onclick...), true: forced, false: no visual feedback
	let isInteractive = $derived((interactive ?? (tag !== 'div' || isPressable)) && !isLocked);
	let pressable = $derived(
		pressableAttrs({ tag, href, type, disabled: isLocked, focusableDisabled })
	);

	// disabled with a tooltip: focusable, the click does nothing
	const blockClick = (event: MouseEvent) => {
		if (!focusableDisabled) return;
		event.preventDefault();
		event.stopPropagation();
	};
</script>

<svelte:element
	this={tag}
	bind:this={ref}
	class={attrs.class}
	style={attrs.style}
	{...pressable}
	data-variant={variant}
	data-size={size}
	data-density={density}
	data-rounded={rounded}
	{...elevationAttributes}
	data-interactive={isInteractive}
	data-active={active}
	data-disabled={isDisabled}
	data-disabled-focusable={(isDisabled && focusableDisabled) || undefined}
	onclickcapture={blockClick}
	data-readonly={isReadonly}
	data-loading={loading}
	data-label-style={labelStyle}
	aria-busy={loading || undefined}
	use:tooltipAction={tooltip}
	use:ripple={{
		component: 'chip',
		disabled: noRipple || !isInteractive
	}}
	{...isInput ? {} : attrs.rest}
>
	{#if hasOutline}
		<span class="outline"></span>
	{/if}

	{#if isInput}
		<input
			{...attrs.rest}
			class="kit-chip__input"
			data-ripple-host
			type={type || 'button'}
			{checked}
			{value}
			aria-label={label || (value != null ? String(value) : undefined)}
			disabled={isLocked && !focusableDisabled}
			aria-disabled={focusableDisabled || undefined}
		/>
	{:else}
		<span class="kit-chip__inner">
			{#if prepend}
				<span class="kit-chip__prepend">{@render prepend()}</span>
			{/if}
			{#if children}
				<span class="kit-chip__content">{@render children()}</span>
			{/if}
			{#if append}
				<span class="kit-chip__append">{@render append()}</span>
			{/if}
		</span>
	{/if}

	{#if loading}
		<span class="kit-chip__spinner">
			{#if load}
				{@render load()}
			{:else}
				...
			{/if}
		</span>
	{/if}
</svelte:element>

<style lang="scss">
	@use './chip';
</style>
