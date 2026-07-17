<script lang="ts">
	import { useClassName, useStyles, clickOutside, useElevation } from '$lib/utils';
	import { makeComponentProps } from '$lib/html-mapped';
	import { getPositions } from './popover.svelte.ts';
	import type { ModelPopoverProps, PopoverProps } from './popover.types.ts';

	let {
		ref = $bindable(),
		open = $bindable(false),
		children,
		activator,
		rounded = 'md',
		position = 'bottom',
		color,
		background,
		class: className = '',
		style: styleAttr = '',
		's-class': sClass,
		's-style': sStyle,
		elevation = '2',
		density = 'default',
		...rest
	}: PopoverProps = $props();

	let { classProps, styleProps, restProps } = $derived(
		makeComponentProps(rest as Record<string, unknown>)
	);

	let elevationState = $derived(useElevation(elevation));

	let componentClass = $derived(
		useClassName({
			baseClass: 'kit-popover-content',
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

	const positioner = getPositions();

	let contentRef = $state<HTMLElement | null>(null);
	let activatorRef = $state<HTMLElement | null>(null);
	let axis = $state(positioner.values);
	let innerHeight = $state(0);
	let innerWidth = $state(0);
	let scrollX = $state(0);
	let scrollY = $state(0);

	const handleToggle = (element: HTMLElement | null) => {
		if (element === null) return;
		activatorRef = element;
		open = !open;
	};

	let model: ModelPopoverProps = {
		toggle: (element) => handleToggle(element)
	};

	const updatePosition = () => {
		if (!contentRef || !activatorRef) return;
		positioner.update(activatorRef, contentRef, position, false, true);
		axis = positioner.values;
	};

	$effect(() => {
		if (open && contentRef && activatorRef) {
			updatePosition();
		}
	});

	$effect(() => {
		if (
			open &&
			contentRef &&
			activatorRef &&
			(scrollX > 0 || scrollY > 0 || innerHeight > 0 || innerWidth > 0)
		) {
			updatePosition();
		}
	});

	$effect(() => {
		if (scrollX || scrollY) open = false;
	});

	$effect(() => {
		ref = contentRef;
	});

	let resolvedStyle = $derived(
		[
			componentStyle,
			color ? `--kit-popover-fg:${color && `var(--kit-color-${color})`}` : '',
			background ? `--kit-popover-bg:${background && `var(--kit-color-${background})`}` : ''
		]
			.filter(Boolean)
			.join('; ')
	);
</script>

<svelte:window bind:innerHeight bind:innerWidth bind:scrollX bind:scrollY />

{@render activator?.(model)}

{#if open}
	<div
		bind:this={contentRef}
		class={componentClass}
		style={`left:${axis.x}px; top:${axis.y}px; ${resolvedStyle}`}
		role="dialog"
		data-rounded={rounded}
		data-position={axis.location ?? position}
		data-density={density}
		data-elevation={elevationState.base}
		data-elevation-hover={elevationState.hover}
		data-elevation-active={elevationState.active}
		use:clickOutside={{ exclude: [contentRef, activatorRef], onClose: () => (open = false) }}
		{...restProps}
	>
		{@render children?.()}
	</div>
{/if}

<style>
	.kit-popover-content {
		--kit-popover-bg: var(--kit-color-surface-3);
		--kit-popover-fg: var(--kit-color-text);

		position: fixed;
		z-index: 1900;
		display: inline-block;
		width: auto;
		max-width: min(28rem, calc(100vw - 1rem));
		padding: calc(var(--kit-space-default) + var(--kit-popover-density-offset) / 2);
		border: 0;
		border-radius: var(--kit-popover-radius);
		background: var(--kit-popover-bg);
		color: var(--kit-popover-fg);
		opacity: 1;
		transition: opacity 140ms ease;
	}

	/** 
	 * rounded
	 * @link ...
	 */
	.kit-popover-content[data-rounded='0'] {
		--kit-popover-radius: var(--kit-shape-none);
	}
	.kit-popover-content[data-rounded='xs'] {
		--kit-popover-radius: var(--kit-shape-xs);
	}
	.kit-popover-content[data-rounded='sm'] {
		--kit-popover-radius: var(--kit-shape-sm);
	}
	.kit-popover-content[data-rounded='md'] {
		--kit-popover-radius: var(--kit-shape-md);
	}
	.kit-popover-content[data-rounded='lg'] {
		--kit-popover-radius: var(--kit-shape-lg);
	}
	.kit-popover-content[data-rounded='xl'] {
		--kit-popover-radius: var(--kit-shape-xl);
	}

	/** 
	 * density
	 * @link no url
	 */
	.kit-popover-content[data-density='compact'] {
		--kit-popover-density-offset: var(--kit-space-compact);
	}
	.kit-popover-content[data-density='default'] {
		--kit-popover-density-offset: var(--kit-space-default);
	}
	.kit-popover-content[data-density='comfortable'] {
		--kit-popover-density-offset: var(--kit-space-comfortable);
	}
</style>
