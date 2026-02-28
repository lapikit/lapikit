<script lang="ts">
	let { ref = $bindable(), children, ...rest } = $props();
</script>

<div id="kit-app" bind:this={ref} {...rest} class={['kit-application', rest.class]}>
	{@render children?.()}
</div>

<style>
	:root {
		color-scheme: light;

		--kit-h-neutral: 220;
		--kit-h-success: 145;
		--kit-h-warning: 35;
		--kit-h-danger: 5;
		--kit-h-info: 205;

		--kit-bg: hsl(0 0% 100%);
		--kit-fg: hsl(222 20% 10%);
		--kit-muted: hsl(220 10% 45%);

		--kit-surface-1: hsl(0 0% 100%);
		--kit-surface-2: hsl(220 20% 98%);
		--kit-surface-3: hsl(220 18% 94%);

		--kit-border: hsl(220 16% 88%);

		--kit-accent: hsl(220 90% 56%);

		--kit-radius-1: 8px;
		--kit-radius-2: 12px;
		--kit-space-1: 6px;
		--kit-space-2: 10px;
		--kit-space-3: 14px;

		--kit-focus: hsl(35, 90%, 56%);

		--kit-disabled-opacity: 0.55;

		--kit-font:
			ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
			'Segoe UI Symbol', 'Noto Color Emoji';
	}

	:root {
		--kit-neutral-bg: color-mix(in oklab, var(--kit-neutral), var(--kit-bg) 85%);
		--kit-neutral-bd: color-mix(in oklab, var(--kit-neutral), var(--kit-border) 70%);
		--kit-neutral-fg: var(--kit-fg);

		--kit-success-bg: color-mix(in oklab, var(--kit-success), var(--kit-bg) 85%);
		--kit-success-bd: color-mix(in oklab, var(--kit-success), var(--kit-border) 70%);
		--kit-success-fg: var(--kit-fg);

		--kit-warning-bg: color-mix(in oklab, var(--kit-warning), var(--kit-bg) 85%);
		--kit-warning-bd: color-mix(in oklab, var(--kit-warning), var(--kit-border) 70%);
		--kit-warning-fg: var(--kit-fg);

		--kit-danger-bg: color-mix(in oklab, var(--kit-danger), var(--kit-bg) 85%);
		--kit-danger-bd: color-mix(in oklab, var(--kit-danger), var(--kit-border) 70%);
		--kit-danger-fg: var(--kit-fg);

		--kit-info-bg: color-mix(in oklab, var(--kit-info), var(--kit-bg) 85%);
		--kit-info-bd: color-mix(in oklab, var(--kit-info), var(--kit-border) 70%);
		--kit-info-fg: var(--kit-fg);
	}

	:root {
		--kit-outline-w: 1px;
		--btn-radius: 8px;

		--kit-btn-gap: 8px;

		--bg: #111827;
		--fg: #ffffff;
		--bg-hover: #0b1220;
		--border: rgba(255, 255, 255, 0.08);
		--focus: blue;
		--font:
			ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
			'Segoe UI Symbol', 'Noto Color Emoji';
	}

	:global(.outline) {
		--container-shape-start-start: var(--btn-radius);
		--container-shape-start-end: var(--btn-radius);
		--container-shape-end-start: var(--btn-radius);
		--container-shape-end-end: var(--btn-radius);

		border-width: var(--kit-outline-w);
		inset: 0;
		border-style: solid;
		position: absolute;
		box-sizing: border-box;
		border-color: var(--outline-color);
		z-index: 1;
		border-start-start-radius: var(--container-shape-start-start);
		border-start-end-radius: var(--container-shape-start-end);
		border-end-start-radius: var(--container-shape-end-start);
		border-end-end-radius: var(--container-shape-end-end);
	}

	:global(.kit-ripple) {
		background-color: currentColor;
		opacity: 0.1;
		position: absolute;
		border-radius: 50%;
		pointer-events: none;
		-webkit-transition: 0.6s;
		transition: 0.6s;
		-webkit-animation: animation-l-ripple var(--system-animation-ripple-duration, 0.4s)
			cubic-bezier(0.4, 0, 0.2, 1);
		animation: animation-l-ripple var(--system-animation-ripple-duration, 0.4s)
			cubic-bezier(0.4, 0, 0.2, 1);
		border-radius: var(--system-ripple-radius);
	}

	:global(.kit-ripple--center) {
		top: 50% !important;
		left: 50% !important;
		translate: -50% -50% !important;
	}

	:global(.kit-ripple--effect) {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		overflow: hidden;
		background: none;
		pointer-events: none;
		z-index: 999;
		border-radius: var(--system-ripple-radius);
	}

	@keyframes -global-animation-l-ripple {
		from {
			scale: 0;
		}

		to {
			scale: 1;
		}
	}
</style>
