<script lang="ts">
	import { useClassName, useStyles, clickOutside } from '$lib/utils';
	import { makeComponentProps } from '$lib/html-mapped';
	import { getPositions } from './popover.svelte.ts';
	import type { ModelPopoverProps, PopoverProps } from './popover.types.ts';

	let {
		ref = $bindable(),
		open = $bindable(false),
		children,
		activator,
		dark = false,
		light = false,
		rounded,
		position = 'bottom',
		color,
		background,
		class: className = '',
		style: styleAttr = '',
		's-class': sClass,
		's-style': sStyle,
		...rest
	}: PopoverProps = $props();

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

	let mergedStyle = $derived(
		[
			componentStyle,
			background ? `--kit-popover-background:${background}` : '',
			color ? `--kit-popover-color:${color}` : '',
			typeof rounded === 'string' && rounded.includes('px') ? `--kit-popover-radius:${rounded}` : ''
		]
			.filter(Boolean)
			.join('; ')
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
		positioner.update(activatorRef, contentRef, safePosition, false, true);
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
</script>

<svelte:window bind:innerHeight bind:innerWidth bind:scrollX bind:scrollY />

{@render activator?.(model)}

{#if open}
	<div
		bind:this={contentRef}
		class={componentClass}
		style={`left:${axis.x}px; top:${axis.y}px; ${mergedStyle}`}
		role="dialog"
		data-light={light || undefined}
		data-dark={dark || undefined}
		data-rounded={rounded}
		data-position={axis.location ?? safePosition}
		use:clickOutside={{ exclude: [contentRef, activatorRef], onClose: () => (open = false) }}
		{...restProps}
	>
		{@render children?.()}
	</div>
{/if}

<style>
	.kit-popover-content {
		--kit-popover-background: var(--kit-surface-1);
		--kit-popover-color: var(--kit-fg);
		--kit-popover-radius: 12px;
		--kit-popover-border: color-mix(in oklab, var(--kit-fg), transparent 88%);
		--kit-popover-shadow: 0 18px 40px -18px color-mix(in oklab, black 24%, transparent);

		position: fixed;
		z-index: 1900;
		display: inline-block;
		width: auto;
		max-width: min(28rem, calc(100vw - 1rem));
		padding: 1rem;
		border: 1px solid var(--kit-popover-border);
		border-radius: var(--kit-popover-radius);
		background: var(--kit-popover-background);
		color: var(--kit-popover-color);
		box-shadow: var(--kit-popover-shadow);
		opacity: 1;
		transition: opacity 140ms ease;
	}

	.kit-popover-content[data-light='true'] {
		--kit-popover-background: color-mix(in oklab, white 94%, var(--kit-surface-1));
		--kit-popover-color: var(--kit-fg);
	}

	.kit-popover-content[data-dark='true'] {
		--kit-popover-background: color-mix(in oklab, black 78%, var(--kit-surface-3));
		--kit-popover-color: white;
		--kit-popover-border: color-mix(in oklab, white, transparent 80%);
	}

	.kit-popover-content[data-rounded='0'] {
		--kit-popover-radius: 0;
	}
	.kit-popover-content[data-rounded='xs'] {
		--kit-popover-radius: 2px;
	}
	.kit-popover-content[data-rounded='sm'] {
		--kit-popover-radius: 4px;
	}
	.kit-popover-content[data-rounded='md'] {
		--kit-popover-radius: 8px;
	}
	.kit-popover-content[data-rounded='lg'] {
		--kit-popover-radius: 16px;
	}
	.kit-popover-content[data-rounded='xl'] {
		--kit-popover-radius: 99999px;
	}
</style>
