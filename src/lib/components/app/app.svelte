<script lang="ts">
	let { ref = $bindable(), children, ...rest } = $props();
</script>

<div id="kit-app" bind:this={ref} {...rest} class={['kit-application', rest.class]}>
	{@render children?.()}
</div>

<style>
	.kit-application {
		color-scheme: light;

		/* Hue vars — used by components for dynamic semantic color calculations */
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

		--kit-focus: hsl(35, 90%, 56%);

		/* Layout */
		--kit-radius-1: 8px;
		--kit-radius-2: 12px;
		--kit-space-1: 6px;
		--kit-space-2: 10px;
		--kit-space-3: 14px;
		--kit-disabled-opacity: 0.55;
		--kit-font:
			ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
			'Segoe UI Symbol', 'Noto Color Emoji';

		/* ─── Color tokens (light mode defaults) ─────────────────────────── */

		/* Backgrounds */
		--kit-color-bg: hsl(0 0% 100%);
		--kit-color-bg-secondary: hsl(240 15% 96.5%);
		--kit-color-bg-tertiary: hsl(240 10% 93%);

		/* Surfaces — elevated layers (cards, sheets, popovers) */
		--kit-color-surface: hsl(0 0% 100%);
		--kit-color-surface-raised: hsl(0 0% 100%);

		/* Labels — text hierarchy */
		--kit-color-label: hsl(222 20% 10%);
		--kit-color-label-secondary: hsl(220 10% 40%);
		--kit-color-label-tertiary: hsl(220 8% 58%);
		--kit-color-label-quaternary: hsl(220 5% 76%);

		/* Fills — control & input backgrounds */
		--kit-color-fill: hsl(240 4% 91%);
		--kit-color-fill-secondary: hsl(240 8% 93%);
		--kit-color-fill-tertiary: hsl(240 11% 95%);

		/* Separator */
		--kit-color-separator: hsl(220 16% 88%);

		/* Semantic */
		--kit-color-accent: hsl(220 90% 56%);
		--kit-color-success: hsl(145 50% 38%);
		--kit-color-warning: hsl(35 80% 45%);
		--kit-color-danger: hsl(5 65% 48%);
		--kit-color-info: hsl(205 60% 42%);
		--kit-color-focus: hsl(35 90% 56%);

		/* ─── Backward-compat aliases (removed once components are updated) ─ */
		/* --kit-bg: var(--kit-color-bg);
		--kit-fg: var(--kit-color-label);
		--kit-muted: var(--kit-color-label-tertiary);
		--kit-surface-1: var(--kit-color-surface);
		--kit-surface-2: var(--kit-color-bg-secondary);
		--kit-surface-3: var(--kit-color-bg-tertiary);
		--kit-border: var(--kit-color-separator);
		--kit-accent: var(--kit-color-accent);
		--kit-focus: var(--kit-color-focus); */
	}

	/* Light — explicit override (same values as defaults, forces color-scheme) */
	.light {
		color-scheme: light;

		--kit-color-bg: hsl(0 0% 100%);
		--kit-color-bg-secondary: hsl(240 15% 96.5%);
		--kit-color-bg-tertiary: hsl(240 10% 93%);

		--kit-color-surface: hsl(0 0% 100%);
		--kit-color-surface-raised: hsl(0 0% 100%);

		--kit-color-label: hsl(222 20% 10%);
		--kit-color-label-secondary: hsl(220 10% 40%);
		--kit-color-label-tertiary: hsl(220 8% 58%);
		--kit-color-label-quaternary: hsl(220 5% 76%);

		--kit-color-fill: hsl(240 4% 91%);
		--kit-color-fill-secondary: hsl(240 8% 93%);
		--kit-color-fill-tertiary: hsl(240 11% 95%);

		--kit-color-separator: hsl(220 16% 88%);

		--kit-color-accent: hsl(220 90% 56%);
		--kit-color-success: hsl(145 50% 38%);
		--kit-color-warning: hsl(35 80% 45%);
		--kit-color-danger: hsl(5 65% 48%);
		--kit-color-info: hsl(205 60% 42%);
		--kit-color-focus: hsl(35 90% 56%);
	}

	/* Dark */
	.dark {
		color-scheme: dark;

		--kit-color-bg: hsl(240 3% 11%);
		--kit-color-bg-secondary: hsl(240 2% 17.5%);
		--kit-color-bg-tertiary: hsl(240 1.5% 23%);

		--kit-color-surface: hsl(240 2% 19%);
		--kit-color-surface-raised: hsl(240 1.5% 25%);

		--kit-color-label: hsl(0 0% 100%);
		--kit-color-label-secondary: hsl(240 3% 56%);
		--kit-color-label-tertiary: hsl(240 2.5% 38%);
		--kit-color-label-quaternary: hsl(240 1.5% 25%);

		--kit-color-fill: hsl(240 2.5% 28%);
		--kit-color-fill-secondary: hsl(240 2.5% 24%);
		--kit-color-fill-tertiary: hsl(240 2% 20%);

		--kit-color-separator: hsl(240 2% 26%);

		--kit-color-accent: hsl(220 85% 65%);
		--kit-color-success: hsl(145 50% 50%);
		--kit-color-warning: hsl(35 85% 58%);
		--kit-color-danger: hsl(5 70% 60%);
		--kit-color-info: hsl(205 65% 58%);
		--kit-color-focus: hsl(35 90% 62%);
	}

	:global(.outline) {
		position: absolute;
		inset: 0;
		border: 1px solid var(--outline-color);
		border-radius: inherit;
		box-sizing: border-box;
		z-index: 1;
		pointer-events: none;
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
