<script lang="ts">
	import { useClassName, useStyles } from '$lib/labs/utils/index.js';
	import { makeComponentProps } from '$lib/labs/compiler/mapped-code.js';

	type BtnVariant = 'default' | 'text' | 'filled';

	let {
		class: className = '',
		style: styleAttr = '',
		children = () => null,
		's-class': sClass,
		's-style': sStyle,
		variant = 'default',
		...rest
	} = $props();

	let safeVariant = $derived<BtnVariant>(
		variant === 'default' || variant === 'text' || variant === 'filled' ? variant : 'default'
	); // Test this solution ...

	let { classProps, styleProps, restProps } = $derived(
		makeComponentProps(rest as Record<string, unknown>)
	);

	let componentClass = $derived(
		useClassName({
			baseClass: 'kit-btn',
			className: `${className ?? ''} kit-btn--${safeVariant}`.trim(),
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

<button class={componentClass} style={componentStyle} {...restProps}>
	{@render children()}
</button>

<style>
	/** Global */
	:root {
		--kit-radius: 0.625rem;
	}

	:root {
		--kit-btn-color: rgb(255, 255, 255);
		--kit-btn-bg: rgb(0, 0, 0);
		--kit-btn-radius: 8px;
		--kit-btn-padding-y: 0.625rem;
		--kit-btn-padding-x: 1rem;
	}

	.kit-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		height: 40px;
		padding: 0 16px;
		font-weight: 500;
		border-radius: 8px;
		transition:
			background 150ms,
			color 150ms,
			box-shadow 150ms;
		cursor: pointer;
	}

	.kit-btn--default,
	.kit-btn--filled {
		border-color: rgb(0, 0, 0);
		background-color: rgb(0, 0, 0);
		color: rgb(255, 255, 255);
	}

	.kit-btn--default:hover:not(:disabled),
	.kit-btn--filled:hover:not(:disabled) {
		background-color: rgb(24, 24, 24);
	}

	.kit-btn:focus-visible {
		outline: none;
		box-shadow:
			0 0 0 2px rgb(255, 255, 255),
			0 0 0 4px rgb(0, 0, 0);
	}

	.kit-btn--text {
		background-color: transparent;
		border-color: transparent;
		color: rgb(0, 0, 0);
	}

	.kit-btn--text:hover:not(:disabled) {
		background-color: rgb(239, 239, 239);
	}

	.kit-btn--text:focus-visible {
		box-shadow: 0 0 0 3px rgb(0 0 0 / 20%);
	}

	.kit-btn:disabled {
		background-color: rgb(96, 96, 96);
		border-color: rgb(96, 96, 96);
		color: rgb(226, 226, 226);
		cursor: not-allowed;
		opacity: 0.75;
	}

	.kit-btn--text:disabled {
		background-color: transparent;
		border-color: transparent;
		color: rgb(140, 140, 140);
		opacity: 1;
	}
</style>
