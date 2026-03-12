<script lang="ts">
	import { useClassName, useStyles } from '$lib/labs/utils/index.js';
	import { makeComponentProps } from '$lib/labs/compiler/mapped-code.js';
	import type { AvatarProps } from './avatar.types.ts';

	let {
		ref = $bindable(),
		children = undefined,
		class: className = '',
		style: styleAttr = '',
		's-class': sClass,
		's-style': sStyle,
		label = undefined,
		size = 'md',
		density = 'default',
		...rest
	}: AvatarProps = $props();

	let { classProps, styleProps, restProps } = $derived(
		makeComponentProps(rest as Record<string, unknown>)
	);

	let componentClass = $derived(
		useClassName({
			baseClass: 'kit-avatar',
			className: `${className ?? ''}`.trim(),
			sClass,
			classProps
		})
	);

	let componentStyle = $derived(
		useStyles({
			styleAttr,
			sStyle,
			styleProps
		})
	);

	let safeSize = $derived(
		size === 'default'
			? 'md'
			: size === 'xs' || size === 'sm' || size === 'md' || size === 'lg' || size === 'xl'
				? size
				: 'md'
	);

	let safeDensity = $derived(
		density === 'compact' || density === 'comfortable' || density === 'default'
			? density
			: 'default'
	);

	let contentType = $derived(label && label.trim().length > 0 ? 'label' : children);
	let displayLabel = $derived(label?.trim() ?? '');
</script>

<svelte:element
	this={'div'}
	bind:this={ref}
	class={componentClass}
	style={componentStyle}
	{...restProps}
	data-type={contentType}
	data-size={contentType === 'label' ? safeSize : undefined}
	data-density={contentType === 'label' ? safeDensity : undefined}
>
	{#if contentType === 'label'}
		<span class="kit-avatar__label">{displayLabel}</span>
	{:else}
		{@render children?.()}
	{/if}
</svelte:element>

<style>
	.kit-avatar {
		--kit-avatar-size: 2.25rem;
		--kit-avatar-font-size: 0.875rem;
		--kit-avatar-density-scale: 1;

		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: calc(var(--kit-avatar-size) * var(--kit-avatar-density-scale));
		height: calc(var(--kit-avatar-size) * var(--kit-avatar-density-scale));
		border-radius: 9999px;
		overflow: hidden;
		background: var(--kit-surface-2);
		color: var(--kit-fg);
		font-weight: 600;
		line-height: 1;
		user-select: none;
	}

	.kit-avatar[data-type='label'] {
		font-size: var(--kit-avatar-font-size);
		text-transform: uppercase;
	}

	.kit-avatar[data-size='xs'] {
		--kit-avatar-size: 1.75rem;
		--kit-avatar-font-size: 0.75rem;
	}
	.kit-avatar[data-size='sm'] {
		--kit-avatar-size: 2rem;
		--kit-avatar-font-size: 0.8125rem;
	}
	.kit-avatar[data-size='md'] {
		--kit-avatar-size: 2.25rem;
		--kit-avatar-font-size: 0.875rem;
	}
	.kit-avatar[data-size='lg'] {
		--kit-avatar-size: 2.5rem;
		--kit-avatar-font-size: 1rem;
	}
	.kit-avatar[data-size='xl'] {
		--kit-avatar-size: 2.75rem;
		--kit-avatar-font-size: 1.125rem;
	}

	.kit-avatar[data-density='compact'] {
		--kit-avatar-density-scale: 0.9;
	}
	.kit-avatar[data-density='default'] {
		--kit-avatar-density-scale: 1;
	}
	.kit-avatar[data-density='comfortable'] {
		--kit-avatar-density-scale: 1.1;
	}

	.kit-avatar__label {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		max-width: 100%;
		padding-inline: 0.25rem;
	}

	.kit-avatar :global(img) {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
