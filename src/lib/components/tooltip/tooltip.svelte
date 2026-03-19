<script lang="ts">
	import { onDestroy } from 'svelte';
	import { useClassName, useStyles } from '$lib/utils';
	import { makeComponentProps } from '$lib/compiler/mapped-code';
	import { getPositionsTooltip } from './tooltip.svelte.ts';
	import type { TooltipProps } from './tooltip.types.ts';

	let {
		ref = $bindable(),
		children,
		tooltip,
		open = $bindable(false),
		forceMount = false,
		label,
		dark = false,
		light = false,
		rounded,
		color,
		background,
		location = 'bottom',
		delayDuration = 850,
		density = 'default',
		variant,
		disabled = false,
		avoidCollisions = true,
		class: className = '',
		style: styleAttr = '',
		's-class': sClass,
		's-style': sStyle,
		...rest
	}: TooltipProps = $props();

	let safeLocation = $derived(
		location === 'top' || location === 'bottom' || location === 'left' || location === 'right'
			? location
			: 'bottom'
	);
	let safeDensity = $derived(
		density === 'compact' || density === 'comfortable' || density === 'default'
			? density
			: 'default'
	);
	let safeVariant = $derived(variant === 'arrow' ? 'arrow' : undefined);

	let { classProps, styleProps, restProps } = $derived(
		makeComponentProps(rest as Record<string, unknown>)
	);

	let triggerClass = $derived(
		useClassName({
			baseClass: 'kit-tooltip-trigger',
			className: '',
			sClass,
			classProps
		})
	);

	let componentClass = $derived(
		useClassName({
			baseClass: 'kit-tooltip__content',
			className: `${className ?? ''}`.trim()
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
			background ? `--kit-tooltip-background:${background}` : '',
			color ? `--kit-tooltip-color:${color}` : '',
			typeof rounded === 'string' && rounded.includes('px') ? `--kit-tooltip-radius:${rounded}` : ''
		]
			.filter(Boolean)
			.join('; ')
	);

	const positioner = getPositionsTooltip();

	let triggerRef = $state<HTMLElement | null>(null);
	let tooltipRef = $state<HTMLElement | null>(null);
	let axis = $state(positioner.values);
	let timer = $state<ReturnType<typeof setTimeout> | null>(null);
	let innerHeight = $state(0);
	let innerWidth = $state(0);
	let scrollX = $state(0);
	let scrollY = $state(0);
	const tooltipId = `kit-tooltip-${Math.random().toString(36).slice(2, 10)}`;

	const clearTimer = () => {
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
	};

	const updatePosition = () => {
		if (!triggerRef || !tooltipRef) return;
		positioner.update(triggerRef, tooltipRef, safeLocation, true, avoidCollisions);
		axis = positioner.values;
	};

	const handleHoverOpen = () => {
		if (disabled) {
			open = false;
			return;
		}

		clearTimer();
		timer = setTimeout(() => {
			open = true;
			timer = null;
		}, delayDuration);
	};

	const handleFocusOpen = () => {
		if (disabled) {
			open = false;
			return;
		}

		clearTimer();
		open = true;
	};

	const handleClose = () => {
		clearTimer();
		open = false;
	};

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') handleClose();
	};

	$effect(() => {
		if (tooltip) forceMount = true;
	});

	$effect(() => {
		if (disabled) open = false;
	});

	$effect(() => {
		if (open && triggerRef && tooltipRef) {
			updatePosition();
		}
	});

	$effect(() => {
		if (
			open &&
			triggerRef &&
			tooltipRef &&
			(scrollX > 0 || scrollY > 0 || innerHeight > 0 || innerWidth > 0)
		) {
			updatePosition();
		}
	});

	$effect(() => {
		ref = triggerRef;
	});

	onDestroy(() => {
		clearTimer();
	});
</script>

<svelte:window bind:innerHeight bind:innerWidth bind:scrollX bind:scrollY />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<span
	bind:this={triggerRef}
	class={triggerClass}
	style="display:inline-flex"
	aria-describedby={open ? tooltipId : undefined}
	onmouseenter={handleHoverOpen}
	onmouseleave={handleClose}
	onfocusin={handleFocusOpen}
	onfocusout={handleClose}
	onkeydown={handleKeydown}
>
	{@render children?.()}
</span>

{#if open || forceMount}
	<div
		bind:this={tooltipRef}
		class="kit-tooltip"
		id={tooltipId}
		role="tooltip"
		aria-label={label}
		style={`transform: translate(${axis.x}px, ${axis.y}px); display:${open ? 'block' : 'none'}`}
	>
		<div
			class={componentClass}
			style={mergedStyle}
			data-density={safeDensity}
			data-location={axis.location ?? safeLocation}
			data-variant={safeVariant}
			data-light={light || undefined}
			data-dark={dark || undefined}
			data-rounded={rounded}
			{...restProps}
		>
			{#if tooltip}
				{@render tooltip?.()}
			{:else}
				{label}
			{/if}
		</div>
	</div>
{/if}

<style>
	.kit-tooltip-trigger {
		display: inline-flex;
		width: fit-content;
		max-width: max-content;
		justify-self: start;
		align-self: start;
	}

	.kit-tooltip-trigger:focus-visible {
		outline: 2px solid var(--kit-focus);
		outline-offset: 2px;
	}

	.kit-tooltip {
		position: fixed;
		inset: 0 auto auto 0;
		z-index: 2000;
		margin: 0;
		pointer-events: none;
	}

	.kit-tooltip__content {
		--kit-tooltip-background: var(--kit-surface-3);
		--kit-tooltip-color: var(--kit-fg);
		--kit-tooltip-radius: 8px;
		--kit-tooltip-border: color-mix(in oklab, var(--kit-tooltip-background), black 8%);
		--kit-tooltip-py: 0.15rem;
		--kit-tooltip-px: 0.625rem;

		position: relative;
		display: inline-block;
		width: max-content;
		max-width: min(20rem, calc(100vw - 1rem));
		padding: var(--kit-tooltip-py) var(--kit-tooltip-px);
		border: 1px solid var(--kit-tooltip-border);
		border-radius: var(--kit-tooltip-radius);
		background: var(--kit-tooltip-background);
		color: var(--kit-tooltip-color);
		font-size: 0.875rem;
		overflow-wrap: break-word;
		box-shadow: 0 16px 29px -10px color-mix(in oklab, black 18%, transparent);
		animation: kit-tooltip-enter 150ms ease;
	}

	.kit-tooltip__content[data-density='compact'] {
		--kit-tooltip-py: 0.125rem;
		--kit-tooltip-px: 0.5rem;
	}

	.kit-tooltip__content[data-density='comfortable'] {
		--kit-tooltip-py: 0.35rem;
		--kit-tooltip-px: 0.75rem;
	}

	.kit-tooltip__content[data-light='true'] {
		--kit-tooltip-background: color-mix(in oklab, white 92%, var(--kit-surface-1));
		--kit-tooltip-color: var(--kit-fg);
	}

	.kit-tooltip__content[data-dark='true'] {
		--kit-tooltip-background: color-mix(in oklab, black 76%, var(--kit-surface-3));
		--kit-tooltip-color: white;
		--kit-tooltip-border: color-mix(in oklab, white, transparent 78%);
	}

	.kit-tooltip__content[data-rounded='0'] {
		--kit-tooltip-radius: 0;
	}
	.kit-tooltip__content[data-rounded='xs'] {
		--kit-tooltip-radius: 2px;
	}
	.kit-tooltip__content[data-rounded='sm'] {
		--kit-tooltip-radius: 4px;
	}
	.kit-tooltip__content[data-rounded='md'] {
		--kit-tooltip-radius: 8px;
	}
	.kit-tooltip__content[data-rounded='lg'] {
		--kit-tooltip-radius: 16px;
	}
	.kit-tooltip__content[data-rounded='xl'] {
		--kit-tooltip-radius: 99999px;
	}

	.kit-tooltip__content[data-variant='arrow']::after {
		content: '';
		position: absolute;
		border-style: solid;
	}

	.kit-tooltip__content[data-variant='arrow'][data-location='bottom']::after,
	.kit-tooltip__content[data-variant='arrow'][data-location='top']::after {
		left: 50%;
		margin-left: -0.35rem;
		border-width: 0.35rem;
	}

	.kit-tooltip__content[data-variant='arrow'][data-location='bottom']::after {
		bottom: 100%;
		border-color: transparent transparent var(--kit-tooltip-background) transparent;
	}

	.kit-tooltip__content[data-variant='arrow'][data-location='top']::after {
		top: 100%;
		border-color: var(--kit-tooltip-background) transparent transparent transparent;
	}

	.kit-tooltip__content[data-variant='arrow'][data-location='left']::after,
	.kit-tooltip__content[data-variant='arrow'][data-location='right']::after {
		top: 50%;
		margin-top: -0.35rem;
		border-width: 0.35rem;
	}

	.kit-tooltip__content[data-variant='arrow'][data-location='right']::after {
		right: 100%;
		border-color: transparent var(--kit-tooltip-background) transparent transparent;
	}

	.kit-tooltip__content[data-variant='arrow'][data-location='left']::after {
		left: 100%;
		border-color: transparent transparent transparent var(--kit-tooltip-background);
	}

	.kit-tooltip__content[data-location='top'] {
		--kit-tooltip-enter-x: 0;
		--kit-tooltip-enter-y: 0.5rem;
	}

	.kit-tooltip__content[data-location='bottom'] {
		--kit-tooltip-enter-x: 0;
		--kit-tooltip-enter-y: -0.5rem;
	}

	.kit-tooltip__content[data-location='right'] {
		--kit-tooltip-enter-x: -0.5rem;
		--kit-tooltip-enter-y: 0;
	}

	.kit-tooltip__content[data-location='left'] {
		--kit-tooltip-enter-x: 0.5rem;
		--kit-tooltip-enter-y: 0;
	}

	@keyframes kit-tooltip-enter {
		from {
			opacity: 0;
			transform: translate(var(--kit-tooltip-enter-x, 0), var(--kit-tooltip-enter-y, 0)) scale(0.95);
		}
	}
</style>
