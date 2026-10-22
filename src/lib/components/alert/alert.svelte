<script lang="ts">
	import { useComponentAttrs, useElevation } from '$lib/utils';
	import type { AlertProps } from './alert.types.ts';

	let {
		ref = $bindable(),
		is = 'div',
		children,
		class: className,
		style: styleAttr,
		's-class': sClass,
		's-style': sStyle,
		open = $bindable(true),
		closable,
		multiline,
		size = 'md',
		variant = 'filled',
		density = 'default',
		rounded = 'md',
		tone = 'default',
		color,
		prepend,
		append,
		close,
		elevation,
		...rest
	}: AlertProps = $props();

	let resolvedColor = $derived(color ?? (tone === 'default' ? undefined : tone));
	let attrs = $derived(
		useComponentAttrs(
			'kit-alert',
			{ className, sClass, styleAttr, sStyle, color: resolvedColor },
			rest
		)
	);
	let elevationState = $derived(useElevation(elevation));
	let hasOutline = $derived(variant === 'outline' || variant === 'surface');
	let role = $derived(tone === 'warning' || tone === 'error' ? 'alert' : 'status');
</script>

{#if !closable || open}
	<svelte:element
		this={is}
		bind:this={ref}
		class={attrs.class}
		style={attrs.style}
		{role}
		data-variant={variant}
		data-size={size}
		data-density={density}
		data-rounded={rounded}
		data-tone={tone}
		data-multiline={multiline}
		data-elevation={elevationState.base}
		data-elevation-hover={elevationState.hover}
		data-elevation-active={elevationState.active}
		{...attrs.rest}
	>
		{#if hasOutline}
			<span class="outline"></span>
		{/if}

		{#if prepend}
			<span class="kit-alert__prepend">{@render prepend()}</span>
		{/if}

		<div class="kit-alert__content">
			{@render children?.()}
		</div>

		{#if append}
			<span class="kit-alert__append">{@render append()}</span>
		{/if}

		{#if closable}
			<button
				class="kit-alert__close"
				type="button"
				aria-label="Close"
				onclick={() => (open = false)}
			>
				{#if close}
					{@render close()}
				{:else}
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<path
							d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
							fill="currentColor"
						></path>
					</svg>
				{/if}
			</button>
		{/if}
	</svelte:element>
{/if}

<style lang="scss">
	@use './alert';
</style>
