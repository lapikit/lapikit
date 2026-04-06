<script lang="ts">
	import { onDestroy } from 'svelte';
	import { useClassName, useStyles, clickOutside } from '$lib/utils';
	import { makeComponentProps } from '$lib/html-mapped';
	import { getPositions } from './dropdown.svelte.ts';
	import type { DropdownProps, ModelDropdownProps } from './dropdown.types.ts';

	let {
		ref = $bindable(),
		children,
		activator,
		rounded,
		position = 'bottom',
		closeOnClick = false,
		openOnHover = false,
		color,
		background,
		class: className = '',
		style: styleAttr = '',
		's-class': sClass,
		's-style': sStyle,
		...rest
	}: DropdownProps = $props();

	let safePosition = $derived(
		position === 'top' || position === 'bottom' || position === 'left' || position === 'right'
			? position
			: 'bottom'
	);

	let { classProps, styleProps, restProps } = $derived(
		makeComponentProps(rest as Record<string, unknown>)
	);

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

	let mergedStyle = $derived(
		[
			componentStyle,
			background ? `--kit-dropdown-bg:${background}` : '',
			color ? `--kit-dropdown-fg:${color}` : '',
			typeof rounded === 'string' && rounded.includes('px')
				? `--kit-dropdown-radius:${rounded}`
				: ''
		]
			.filter(Boolean)
			.join('; ')
	);

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
		positioner.update(activatorRef, contentRef, safePosition, false, true);
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
		data-position={axis.location ?? safePosition}
		onmouseover={() => handleMouseEvent('open', activatorRef)}
		onmouseleave={() => handleMouseEvent('close', activatorRef)}
		onclick={(event) => {
			event.stopPropagation();
			handleContentClick();
		}}
		use:clickOutside={{ exclude: [contentRef, activatorRef], onClose: handleClose }}
		{...restProps}
	>
		{@render children?.()}
	</div>
{/if}

<style>
	.kit-dropdown-content {
		--kit-dropdown-bg: var(--kit-surface-1);
		--kit-dropdown-fg: var(--kit-fg);
		--kit-dropdown-radius: 12px;
		--kit-dropdown-bd: color-mix(in oklab, var(--kit-fg), transparent 88%);
		--kit-dropdown-shadow: 0 18px 40px -18px color-mix(in oklab, black 24%, transparent);

		position: fixed;
		z-index: 1800;
		min-width: 12rem;
		max-width: min(22rem, calc(100vw - 1rem));
		padding: 0.375rem;
		border: 1px solid var(--kit-dropdown-bd);
		border-radius: var(--kit-dropdown-radius);
		background: var(--kit-dropdown-bg);
		color: var(--kit-dropdown-fg);
		box-shadow: var(--kit-dropdown-shadow);
		transform-origin: top left;
		animation: kit-dropdown-enter 140ms ease;
	}

	.kit-dropdown-content[data-rounded='0'] {
		--kit-dropdown-radius: 0;
	}
	.kit-dropdown-content[data-rounded='xs'] {
		--kit-dropdown-radius: 2px;
	}
	.kit-dropdown-content[data-rounded='sm'] {
		--kit-dropdown-radius: 4px;
	}
	.kit-dropdown-content[data-rounded='md'] {
		--kit-dropdown-radius: 8px;
	}
	.kit-dropdown-content[data-rounded='lg'] {
		--kit-dropdown-radius: 16px;
	}
	.kit-dropdown-content[data-rounded='xl'] {
		--kit-dropdown-radius: 99999px;
	}

	@keyframes kit-dropdown-enter {
		from {
			opacity: 0;
			scale: 0.98;
		}
	}
</style>
