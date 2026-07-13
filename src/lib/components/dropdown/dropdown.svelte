<script lang="ts">
	import { onDestroy } from 'svelte';
	import { useClassName, useStyles, clickOutside, useElevation } from '$lib/utils';
	import { makeComponentProps } from '$lib/html-mapped';
	import { getPositions } from './dropdown.svelte.ts';
	import type { DropdownProps, ModelDropdownProps } from './dropdown.types.ts';

	let {
		ref = $bindable(),
		children,
		activator,
		rounded = 'md',
		position = 'bottom',
		closeOnClick = false,
		openOnHover = false,
		color,
		background,
		density = 'default',
		class: className = '',
		style: styleAttr = '',
		's-class': sClass,
		's-style': sStyle,
		elevation,
		...rest
	}: DropdownProps = $props();

	let { classProps, styleProps, restProps } = $derived(
		makeComponentProps(rest as Record<string, unknown>)
	);

	let elevationState = $derived(useElevation(elevation));

	let componentClass = $derived(
		useClassName({
			baseClass: 'kit-dropdown-content',
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

	let mergedStyle = $derived([componentStyle].filter(Boolean).join('; '));

	const positioner = getPositions();

	let contentRef = $state<HTMLElement | null>(null);
	let activatorRef = $state<HTMLElement | PointerEvent | null>(null);
	let open = $state(false);
	let axis = $state(positioner.values);
	let innerHeight = $state(0);
	let innerWidth = $state(0);
	let scrollX = $state(0);
	let scrollY = $state(0);
	let timeoutId = $state<ReturnType<typeof setTimeout> | null>(null);

	const clearHoverTimeout = () => {
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}
	};

	const updatePosition = () => {
		if (!contentRef || !activatorRef) return;
		positioner.update(activatorRef, contentRef, position, false, true);
		axis = positioner.values;
	};

	const handleToggle = (element: HTMLElement | PointerEvent | null) => {
		if (element === null) return;
		activatorRef = element;
		open = !open;
	};

	const handleClose = () => {
		clearHoverTimeout();
		open = false;
	};

	const handleContentClick = () => {
		if (closeOnClick && open) open = false;
	};

	const handleMouseEvent = (
		state: 'open' | 'close',
		element: HTMLElement | PointerEvent | null
	) => {
		if (!openOnHover) return;

		if (state === 'open') {
			clearHoverTimeout();
			if (element) activatorRef = element;
			open = true;
			return;
		}

		timeoutId = setTimeout(() => {
			open = false;
			timeoutId = null;
		}, 150);
	};

	let model: ModelDropdownProps = {
		get open() {
			return open;
		},
		close: () => handleClose(),
		toggle: (element) => handleToggle(element)
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

	onDestroy(() => {
		clearHoverTimeout();
	});
</script>

<svelte:window bind:innerHeight bind:innerWidth bind:scrollX bind:scrollY />

{@render activator?.(model, (state, element) => handleMouseEvent(state, element))}

{#if open}
	<div
		bind:this={contentRef}
		class={componentClass}
		style={`left:${axis.x}px; top:${axis.y}px; ${mergedStyle}`}
		role="menu"
		data-rounded={rounded}
		data-position={axis.location ?? position}
		data-density={density}
		onmouseover={() => handleMouseEvent('open', activatorRef)}
		onmouseleave={() => handleMouseEvent('close', activatorRef)}
		onclick={(event) => {
			event.stopPropagation();
			handleContentClick();
		}}
		data-elevation={elevationState.base}
		data-elevation-hover={elevationState.hover}
		data-elevation-active={elevationState.active}
		use:clickOutside={{ exclude: [contentRef, activatorRef], onClose: handleClose }}
		style:--kit-dropdown-fg={color && `var(--kit-color-${color})`}
		style:--kit-dropdown-bg={background && `var(--kit-color-${background})`}
		{...restProps}
	>
		{@render children?.()}
	</div>
{/if}

<style>
	.kit-dropdown-content {
		--kit-dropdown-bg: var(--kit-color-surface-3);
		--kit-dropdown-fg: var(--kit-color-text);

		position: fixed;
		z-index: 1800;
		min-width: 12rem;
		max-width: min(22rem, calc(100vw - 1rem));
		padding: 0.375rem calc(0.375rem * var(--kit-dropdown-density-scale));
		border: 0;
		border-radius: var(--kit-dropdown-radius);
		background: var(--kit-dropdown-bg);
		color: var(--kit-dropdown-fg);
		transform-origin: top left;
		animation: kit-dropdown-enter 140ms ease;
	}

	/** 
	 * rounded
	 * @link ...
	 */
	.kit-dropdown-content[data-rounded='0'] {
		--kit-dropdown-radius: var(--kit-shape-none);
	}
	.kit-dropdown-content[data-rounded='xs'] {
		--kit-dropdown-radius: var(--kit-shape-xs);
	}
	.kit-dropdown-content[data-rounded='sm'] {
		--kit-dropdown-radius: var(--kit-shape-sm);
	}
	.kit-dropdown-content[data-rounded='md'] {
		--kit-dropdown-radius: var(--kit-shape-md);
	}
	.kit-dropdown-content[data-rounded='lg'] {
		--kit-dropdown-radius: var(--kit-shape-lg);
	}
	.kit-dropdown-content[data-rounded='xl'] {
		--kit-dropdown-radius: var(--kit-shape-xl);
	}

	/** 
	 * density
	 * @link no url
	 */
	.kit-dropdown-content[data-density='none'] {
		--kit-dropdown-density-scale: 0;
	}
	.kit-dropdown-content[data-density='compact'] {
		--kit-dropdown-density-scale: 0.8;
	}
	.kit-dropdown-content[data-density='default'] {
		--kit-dropdown-density-scale: 1;
	}
	.kit-dropdown-content[data-density='comfortable'] {
		--kit-dropdown-density-scale: 1.15;
	}

	@keyframes kit-dropdown-enter {
		from {
			opacity: 0;
			scale: 0.98;
		}
	}
</style>
