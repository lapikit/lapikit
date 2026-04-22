<script lang="ts">
	import { useClassName, useStyles } from '$lib/utils';
	import { makeComponentProps } from '$lib/html-mapped';
	import type { AlertDensity, AlertProps, AlertTone, AlertVariant } from './alert.types.ts';

	function resolveVariant(value: AlertVariant | undefined): AlertVariant {
		return value === 'filled' || value === 'outline' || value === 'text' ? value : 'filled';
	}

	function resolveDensity(value: AlertDensity | undefined): AlertDensity {
		return value === 'compact' || value === 'comfortable' || value === 'default'
			? value
			: 'default';
	}

	function resolveTone({
		tone,
		info,
		success,
		warning,
		error
	}: {
		tone?: AlertTone;
		info?: boolean;
		success?: boolean;
		warning?: boolean;
		error?: boolean;
	}): AlertTone {
		if (tone && ['default', 'info', 'success', 'warning', 'error'].includes(tone)) return tone;
		if (error) return 'error';
		if (warning) return 'warning';
		if (success) return 'success';
		if (info) return 'info';
		return 'default';
	}

	let {
		ref = $bindable(),
		is = 'div',
		children = undefined,
		class: className = '',
		style: styleAttr = '',
		's-class': sClass,
		's-style': sStyle,
		open = $bindable(true),
		closable = false,
		variant = 'filled',
		density = 'default',
		rounded = 'md',
		tone = 'default',
		info = false,
		success = false,
		warning = false,
		error = false,
		color = undefined,
		background = undefined,
		prepend = undefined,
		append = undefined,
		close = undefined,
		...rest
	}: AlertProps = $props();

	let { classProps, styleProps, restProps } = $derived(
		makeComponentProps(rest as Record<string, unknown>)
	);

	let componentClass = $derived(
		useClassName({
			baseClass: 'kit-alert',
			className: `${className ?? ''}`.trim(),
			sClass,
			classProps
		})
	);

	let baseStyle = $derived(
		useStyles({
			styleAttr,
			sStyle,
			styleProps
		})
	);

	let safeVariant = $derived(resolveVariant(variant));
	let safeDensity = $derived(resolveDensity(density));
	let safeTone = $derived(resolveTone({ tone, info, success, warning, error }));
	let mergedStyle = $derived(
		[
			baseStyle,
			color ? `--kit-alert-fg:${color}` : '',
			background ? `--kit-alert-bg:${background}` : ''
		]
			.filter(Boolean)
			.join('; ')
	);
</script>

{#if !closable || (closable && open)}
	<svelte:element
		this={is}
		bind:this={ref}
		class={componentClass}
		style={mergedStyle}
		role="alert"
		data-variant={safeVariant}
		data-density={safeDensity}
		data-rounded={rounded}
		data-tone={safeTone}
		{...restProps}
	>
		{#if safeVariant === 'outline'}
			<span class="outline"></span>
		{/if}

		{#if prepend}
			<span class="kit-alert__prepend">
				{@render prepend?.()}
			</span>
		{/if}

		<div class="kit-alert__content">
			{@render children?.()}
		</div>

		{#if append}
			<span class="kit-alert__append">
				{@render append?.()}
			</span>
		{/if}

		{#if closable}
			<button
				class="kit-alert__close"
				type="button"
				aria-label="close"
				onclick={() => (open = false)}
			>
				{#if close}
					{@render close?.()}
				{:else}
					<span aria-hidden="true">×</span>
				{/if}
			</button>
		{/if}
	</svelte:element>
{/if}

<style>
	.kit-alert {
		--kit-alert-bg: var(--kit-surface-2);
		--kit-alert-fg: var(--kit-fg);
		--kit-alert-bd: var(--kit-border);
		--kit-alert-radius: 8px;
		--kit-alert-py: 0.75rem;
		--kit-alert-px: 0.875rem;
		--kit-alert-gap: 0.625rem;
		--outline-color: var(--kit-alert-bd);

		position: relative;
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto auto;
		gap: var(--kit-alert-gap);
		align-items: start;
		padding: var(--kit-alert-py) var(--kit-alert-px);
		border-radius: var(--kit-alert-radius);
		color: var(--kit-alert-fg);
		background: var(--kit-alert-bg);
		border: 1px solid var(--kit-alert-bd);
	}

	.kit-alert[data-variant='outline'] {
		background: transparent;
		color: var(--kit-alert-fg);
		border-color: var(--kit-alert-bd);
	}

	.kit-alert[data-variant='text'] {
		background: transparent;
		color: var(--kit-alert-fg);
		border-color: transparent;
	}

	.kit-alert .outline {
		pointer-events: none;
	}

	.kit-alert[data-tone='info'] {
		--kit-alert-tone-accent: hsl(var(--kit-h-info, 205) 60% 42%);
		--kit-alert-bg: hsl(var(--kit-h-info, 205) 90% 95%);
		--kit-alert-fg: hsl(var(--kit-h-info, 205) 36% 24%);
		--kit-alert-bd: hsl(var(--kit-h-info, 205) 45% 78%);
	}

	.kit-alert[data-tone='success'] {
		--kit-alert-tone-accent: hsl(var(--kit-h-success, 145) 50% 38%);
		--kit-alert-bg: hsl(var(--kit-h-success, 145) 58% 93%);
		--kit-alert-fg: hsl(var(--kit-h-success, 145) 38% 23%);
		--kit-alert-bd: hsl(var(--kit-h-success, 145) 30% 75%);
	}

	.kit-alert[data-tone='warning'] {
		--kit-alert-tone-accent: hsl(var(--kit-h-warning, 35) 80% 38%);
		--kit-alert-bg: hsl(var(--kit-h-warning, 35) 95% 92%);
		--kit-alert-fg: hsl(var(--kit-h-warning, 35) 55% 24%);
		--kit-alert-bd: hsl(var(--kit-h-warning, 35) 55% 72%);
	}

	.kit-alert[data-tone='error'] {
		--kit-alert-tone-accent: hsl(var(--kit-h-danger, 5) 65% 45%);
		--kit-alert-bg: hsl(var(--kit-h-danger, 5) 90% 94%);
		--kit-alert-fg: hsl(var(--kit-h-danger, 5) 48% 28%);
		--kit-alert-bd: hsl(var(--kit-h-danger, 5) 55% 78%);
	}

	.kit-alert[data-variant='outline'][data-tone='info'],
	.kit-alert[data-variant='outline'][data-tone='success'],
	.kit-alert[data-variant='outline'][data-tone='warning'],
	.kit-alert[data-variant='outline'][data-tone='error'] {
		--kit-alert-fg: var(--kit-alert-tone-accent);
		--kit-alert-bd: var(--kit-alert-tone-accent);
	}

	.kit-alert[data-variant='text'][data-tone='info'],
	.kit-alert[data-variant='text'][data-tone='success'],
	.kit-alert[data-variant='text'][data-tone='warning'],
	.kit-alert[data-variant='text'][data-tone='error'] {
		--kit-alert-fg: var(--kit-alert-tone-accent);
	}

	.kit-alert[data-density='compact'] {
		--kit-alert-py: 0.5rem;
		--kit-alert-px: 0.75rem;
		--kit-alert-gap: 0.5rem;
	}

	.kit-alert[data-density='default'] {
		--kit-alert-py: 0.75rem;
		--kit-alert-px: 0.875rem;
		--kit-alert-gap: 0.625rem;
	}

	.kit-alert[data-density='comfortable'] {
		--kit-alert-py: 0.95rem;
		--kit-alert-px: 1rem;
		--kit-alert-gap: 0.75rem;
	}

	.kit-alert[data-rounded='0'] {
		--kit-alert-radius: 0;
	}
	.kit-alert[data-rounded='xs'] {
		--kit-alert-radius: 2px;
	}
	.kit-alert[data-rounded='sm'] {
		--kit-alert-radius: 4px;
	}
	.kit-alert[data-rounded='md'] {
		--kit-alert-radius: 8px;
	}
	.kit-alert[data-rounded='lg'] {
		--kit-alert-radius: 16px;
	}
	.kit-alert[data-rounded='xl'] {
		--kit-alert-radius: 99999px;
	}

	.kit-alert__prepend,
	.kit-alert__append {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		line-height: 1;
	}

	.kit-alert__content {
		min-width: 0;
		line-height: 1.4;
	}

	.kit-alert__close {
		appearance: none;
		border: 0;
		background: transparent;
		color: inherit;
		padding: 0;
		width: 1.25rem;
		height: 1.25rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		border-radius: 6px;
	}

	.kit-alert__close:hover {
		background: color-mix(in oklab, currentColor 10%, transparent);
	}
</style>
