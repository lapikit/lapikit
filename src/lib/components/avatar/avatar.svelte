<script lang="ts">
	import { useClassName, useElevation, useStyles } from '$lib/utils';
	import { makeComponentProps } from '$lib/html-mapped';
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
		rounded = 'full',
		elevation,
		color,
		background,
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

	let elevationState = $derived(useElevation(elevation));
	let contentType = $derived(label && label.trim().length > 0 ? 'label' : children);
	let displayLabel = $derived(label?.trim() ?? '');

	let resolvedStyle = $derived(
		[
			componentStyle,
			color ? `--kit-avatar-fg:${color && `var(--kit-color-${color})`}` : '',
			background ? `--kit-avatar-bg:${background && `var(--kit-color-${background})`}` : ''
		]
			.filter(Boolean)
			.join('; ')
	);
</script>

<svelte:element
	this={'div'}
	bind:this={ref}
	class={componentClass}
	style={resolvedStyle}
	data-type={contentType}
	data-size={size}
	data-density={density}
	data-rounded={rounded}
	data-elevation={elevationState.base}
	data-elevation-hover={elevationState.hover}
	data-elevation-active={elevationState.active}
	{...restProps}
>
	{#if contentType === 'label'}
		<span class="kit-avatar__label">{displayLabel}</span>
	{:else}
		{@render children?.()}
	{/if}
</svelte:element>

<style>
	.kit-avatar {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: calc(var(--kit-avatar-h) + var(--kit-avatar-density-offset) / 2);
		height: calc(var(--kit-avatar-h) + var(--kit-avatar-density-offset) / 2);
		overflow: hidden;
		background: var(--kit-color-surface-3);
		color: var(--kit-color-text);
		border-radius: var(--kit-avatar-radius);
		border: 0;
		font-weight: 600;
		line-height: 1;
		user-select: none;
		transition:
			background 140ms ease,
			color 140ms ease,
			box-shadow 140ms ease,
			translate 140ms ease;
	}

	.kit-avatar[data-type='label'] {
		font-size: var(--kit-avatar-font-size);
		text-transform: uppercase;
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

	/** 
	 * rounded
	 * @link ...
	 */
	.kit-avatar[data-rounded='0'] {
		--kit-avatar-radius: var(--kit-shape-none);
	}
	.kit-avatar[data-rounded='xs'] {
		--kit-avatar-radius: var(--kit-shape-xs);
	}
	.kit-avatar[data-rounded='sm'] {
		--kit-avatar-radius: var(--kit-shape-sm);
	}
	.kit-avatar[data-rounded='md'] {
		--kit-avatar-radius: var(--kit-shape-md);
	}
	.kit-avatar[data-rounded='lg'] {
		--kit-avatar-radius: var(--kit-shape-lg);
	}
	.kit-avatar[data-rounded='xl'] {
		--kit-avatar-radius: var(--kit-shape-xl);
	}

	.kit-avatar[data-rounded='full'] {
		--kit-avatar-radius: var(--kit-shape-full);
	}

	/** 
	 * density
	 * @link ...
	 */
	.kit-avatar[data-density='compact'] {
		--kit-avatar-density-offset: var(--kit-density-compact);
	}
	.kit-avatar[data-density='default'] {
		--kit-avatar-density-offset: var(--kit-density-default);
	}
	.kit-avatar[data-density='comfortable'] {
		--kit-avatar-density-offset: var(--kit-density-comfortable);
	}

	/**
	* size
	* @link nothing...
	*/
	.kit-avatar[data-size='xs'] {
		--kit-avatar-h: 32px;
		--kit-avatar-gap: var(--kit-space-compact);
		--kit-avatar-font: var(--kit-font-xs);
	}
	.kit-avatar[data-size='sm'] {
		--kit-avatar-h: 40px;
		--kit-avatar-gap: var(--kit-space-default);
		--kit-avatar-font: var(--kit-font-sm);
	}
	.kit-avatar[data-size='md'] {
		--kit-avatar-h: 48px;
		--kit-avatar-gap: var(--kit-space-default);
		--kit-avatar-font: var(--kit-font-md);
	}
	.kit-avatar[data-size='lg'] {
		--kit-avatar-h: 56px;
		--kit-avatar-gap: var(--kit-space-default);
		--kit-avatar-font: var(--kit-font-lg);
	}
	.kit-avatar[data-size='xl'] {
		--kit-avatar-h: 64px;
		--kit-avatar-gap: var(--kit-space-comfortable);
		--kit-avatar-font: var(--kit-font-xl);
	}
</style>
