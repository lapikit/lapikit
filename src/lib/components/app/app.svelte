<script lang="ts">
	import { makeComponentProps } from '$lib/html-mapped';
	import { useClassName, useStyles } from '$lib/utils';
	import type { AppProps } from './app.types';

	let {
		ref = $bindable(),
		children,
		class: className = '',
		style: styleAttr = '',
		's-class': sClass,
		's-style': sStyle,
		...rest
	}: AppProps = $props();

	let { classProps, styleProps, restProps } = $derived(makeComponentProps(rest));

	let componentClass = $derived(
		useClassName({
			baseClass: 'kit-application',
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
</script>

<div id="kit-app" bind:this={ref} class={componentClass} style={componentStyle} {...restProps}>
	{@render children?.()}
</div>

<style>
	.kit-application {
		--kit-shape-none: 0;
		--kit-shape-xs: 4px;
		--kit-shape-sm: 6px;
		--kit-shape-md: 10px;
		--kit-shape-lg: 14px;
		--kit-shape-xl: 18px;
		--kit-shape-full: 9999px;

		--kit-space-compact: 6px;
		--kit-space-default: 10px;
		--kit-space-comfortable: 14px;

		--kit-shadow-opacity: 30%;
		--kit-shadow-ambiant-opacity: 15%;

		--kit-disabled-opacity: 0.55;
		--kit-font:
			ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
			'Segoe UI Symbol', 'Noto Color Emoji';
	}

	.kit-application,
	:global([data-kit-theme='light']) {
		color-scheme: light;
		--kit-color-surface: hsl(0 0% 100%);
		--kit-color-surface-1: hsl(240 15% 96.5%);
		--kit-color-surface-2: hsl(240 10% 93%);
		--kit-color-surface-3: hsl(0 0% 100%);

		--kit-color-text: hsl(222 20% 10%);
		--kit-color-text-muted: hsl(220 10% 40%);
		--kit-color-text-subtle: hsl(220 8% 58%);
		--kit-color-text-disabled: hsl(220 5% 76%);

		--kit-color-fill: hsl(240 8% 93%);
		--kit-color-fill-hover: hsl(240 4% 91%);
		--kit-color-fill-active: hsl(240 4% 88%);

		--kit-color-border: hsl(220 16% 88%);
		--kit-color-shadow: hsl(240 3% 11%);

		--kit-color-accent: hsl(220 90% 56%);
		--kit-color-on-accent: hsl(0 0% 100%);
		--kit-color-success: hsl(145 50% 38%);
		--kit-color-on-success: hsl(0 0% 100%);
		--kit-color-warning: hsl(35 80% 45%);
		--kit-color-on-warning: hsl(222 20% 10%);
		--kit-color-error: hsl(5 65% 48%);
		--kit-color-on-error: hsl(0 0% 100%);
		--kit-color-info: hsl(205 60% 42%);
		--kit-color-on-info: hsl(0 0% 100%);
		--kit-color-focus: hsl(35 90% 56%);
	}

	:global([data-kit-theme='dark']) {
		color-scheme: dark;

		--kit-color-surface: hsl(240 3% 11%);
		--kit-color-surface-1: hsl(240 2% 17.5%);
		--kit-color-surface-2: hsl(240 1.5% 23%);
		--kit-color-surface-3: hsl(240 1.5% 28%);

		--kit-color-text: hsl(0 0% 100%);
		--kit-color-text-muted: hsl(240 3% 56%);
		--kit-color-text-subtle: hsl(240 2.5% 38%);
		--kit-color-text-disabled: hsl(240 1.5% 25%);

		--kit-color-fill: hsl(240 2.5% 24%);
		--kit-color-fill-hover: hsl(240 2.5% 28%);
		--kit-color-fill-active: hsl(240 2.5% 31%);

		--kit-color-border: hsl(240 2% 26%);
		--kit-color-shadow: hsl(240 3% 11%);

		--kit-color-accent: hsl(220 85% 65%);
		--kit-color-on-accent: hsl(240 3% 11%);
		--kit-color-success: hsl(145 50% 50%);
		--kit-color-on-success: hsl(240 3% 11%);
		--kit-color-warning: hsl(35 85% 58%);
		--kit-color-on-warning: hsl(240 3% 11%);
		--kit-color-error: hsl(5 70% 60%);
		--kit-color-on-error: hsl(240 3% 11%);
		--kit-color-info: hsl(205 65% 58%);
		--kit-color-on-info: hsl(240 3% 11%);
		--kit-color-focus: hsl(35 90% 62%);
	}

	@media (prefers-color-scheme: light) {
		:global([data-kit-theme='system']) {
			color-scheme: light;

			--kit-color-surface: hsl(0 0% 100%);
			--kit-color-surface-1: hsl(240 15% 96.5%);
			--kit-color-surface-2: hsl(240 10% 93%);
			--kit-color-surface-3: hsl(0 0% 100%);

			--kit-color-text: hsl(222 20% 10%);
			--kit-color-text-muted: hsl(220 10% 40%);
			--kit-color-text-subtle: hsl(220 8% 58%);
			--kit-color-text-disabled: hsl(220 5% 76%);

			--kit-color-fill: hsl(240 8% 93%);
			--kit-color-fill-hover: hsl(240 4% 91%);
			--kit-color-fill-active: hsl(240 4% 88%);

			--kit-color-border: hsl(220 16% 88%);
			--kit-color-shadow: hsl(240 3% 11%);

			--kit-color-accent: hsl(220 90% 56%);
			--kit-color-on-accent: hsl(0 0% 100%);
			--kit-color-success: hsl(145 50% 38%);
			--kit-color-on-success: hsl(0 0% 100%);
			--kit-color-warning: hsl(35 80% 45%);
			--kit-color-on-warning: hsl(222 20% 10%);
			--kit-color-error: hsl(5 65% 48%);
			--kit-color-on-error: hsl(0 0% 100%);
			--kit-color-info: hsl(205 60% 42%);
			--kit-color-on-info: hsl(0 0% 100%);
			--kit-color-focus: hsl(35 90% 56%);
		}
	}

	@media (prefers-color-scheme: dark) {
		:global([data-kit-theme='system']) {
			color-scheme: dark;

			--kit-color-surface: hsl(240 3% 11%);
			--kit-color-surface-1: hsl(240 2% 17.5%);
			--kit-color-surface-2: hsl(240 1.5% 23%);
			--kit-color-surface-3: hsl(240 1.5% 28%);

			--kit-color-text: hsl(0 0% 100%);
			--kit-color-text-muted: hsl(240 3% 56%);
			--kit-color-text-subtle: hsl(240 2.5% 38%);
			--kit-color-text-disabled: hsl(240 1.5% 25%);

			--kit-color-fill: hsl(240 2.5% 24%);
			--kit-color-fill-hover: hsl(240 2.5% 28%);
			--kit-color-fill-active: hsl(240 2.5% 31%);

			--kit-color-border: hsl(240 2% 26%);
			--kit-color-shadow: hsl(240 3% 11%);

			--kit-color-accent: hsl(220 85% 65%);
			--kit-color-on-accent: hsl(240 3% 11%);
			--kit-color-success: hsl(145 50% 50%);
			--kit-color-on-success: hsl(240 3% 11%);
			--kit-color-warning: hsl(35 85% 58%);
			--kit-color-on-warning: hsl(240 3% 11%);
			--kit-color-error: hsl(5 70% 60%);
			--kit-color-on-error: hsl(240 3% 11%);
			--kit-color-info: hsl(205 65% 58%);
			--kit-color-on-info: hsl(240 3% 11%);
			--kit-color-focus: hsl(35 90% 62%);
		}
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
		transition: 0.6s;
		animation: animation-l-ripple var(--system-animation-ripple-duration, 0.4s)
			cubic-bezier(0.4, 0, 0.2, 1);
		border-radius: 50%;
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

	:global([data-elevation='0']),
	:global([data-elevation-hover='0']:hover),
	:global([data-elevation-active='0']):active {
		box-shadow: none;
	}

	:global([data-elevation='1']),
	:global([data-elevation-hover='1']:hover),
	:global([data-elevation-active='1']:active) {
		box-shadow:
			0 1px 2px color-mix(in oklab, var(--kit-color-shadow) var(--kit-shadow-opacity), transparent),
			0 3px 8px -2px
				color-mix(in oklab, var(--kit-color-shadow) var(--kit-shadow-ambiant-opacity), transparent);
	}

	:global([data-elevation='2']),
	:global([data-elevation-hover='2']:hover),
	:global([data-elevation-active='2']:active) {
		box-shadow:
			0 1px 3px color-mix(in oklab, var(--kit-color-shadow) var(--kit-shadow-opacity), transparent),
			0 5px 12px -3px
				color-mix(in oklab, var(--kit-color-shadow) var(--kit-shadow-ambiant-opacity), transparent);
	}

	:global([data-elevation='3']),
	:global([data-elevation-hover='3']:hover),
	:global([data-elevation-active='3']:active) {
		box-shadow:
			0 2px 4px color-mix(in oklab, var(--kit-color-shadow) var(--kit-shadow-opacity), transparent),
			0 8px 20px -4px
				color-mix(in oklab, var(--kit-color-shadow) var(--kit-shadow-ambiant-opacity), transparent);
	}

	:global([data-elevation='4']),
	:global([data-elevation-hover='4']):hover,
	:global([data-elevation-active='4']):active {
		box-shadow:
			0 3px 5px color-mix(in oklab, var(--kit-color-shadow) var(--kit-shadow-opacity), transparent),
			0 11px 26px -5px
				color-mix(in oklab, var(--kit-color-shadow) var(--kit-shadow-ambiant-opacity), transparent);
	}

	:global([data-elevation='5']),
	:global([data-elevation-hover='5']:hover),
	:global([data-elevation-active='5']:active) {
		box-shadow:
			0 4px 6px color-mix(in oklab, var(--kit-color-shadow) var(--kit-shadow-opacity), transparent),
			0 14px 32px -6px
				color-mix(in oklab, var(--kit-color-shadow) var(--kit-shadow-ambiant-opacity), transparent);
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
