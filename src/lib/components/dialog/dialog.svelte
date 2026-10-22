<script lang="ts">
	import { disabledScroll, useComponentAttrs, useElevation } from '$lib/utils';
	import type { DialogProps } from './dialog.types.ts';

	let {
		ref = $bindable(),
		children = undefined,
		class: className,
		style: styleAttr,
		's-class': sClass,
		's-style': sStyle,
		open = $bindable(false),
		persistent = false,
		size = 'md',
		position = 'center',
		density = 'default',
		rounded = 'md',
		classContent,
		color,
		elevation = '2',
		space,
		...rest
	}: DialogProps = $props();

	let attrs = $derived(
		useComponentAttrs(
			'kit-dialog',
			{
				className,
				sClass,
				styleAttr,
				sStyle: space ? { '--kit-dialog-space': space, ...sStyle } : sStyle,
				color
			},
			rest
		)
	);
	let elevationState = $derived(useElevation(elevation));

	$effect(() => {
		if (!ref) return;

		if (open && !ref.open) {
			ref.showModal();
		}

		if (!open && ref.open) {
			ref.close();
		}

		disabledScroll(open);

		return () => {
			disabledScroll(false);
		};
	});

	function handleClose() {
		if (!persistent) {
			open = false;
			return;
		}

		if (ref && !ref.open && open) {
			ref.showModal();
		}
	}

	function handleCancel(event: Event) {
		if (persistent) {
			event.preventDefault();
			return;
		}

		open = false;
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target !== ref || persistent) return;
		open = false;
	}
</script>

<dialog
	bind:this={ref}
	class={attrs.class}
	style={attrs.style}
	data-size={size}
	data-position={position}
	data-persistent={persistent}
	data-density={density}
	data-rounded={rounded}
	onclose={handleClose}
	oncancel={handleCancel}
	onclick={handleBackdropClick}
>
	<div
		{...attrs.rest}
		class={['kit-dialog__content', classContent]}
		data-elevation={elevationState.base}
		data-elevation-hover={elevationState.hover}
		data-elevation-active={elevationState.active}
		onclick={(event: MouseEvent) => event.stopPropagation()}
	>
		{@render children?.()}
	</div>
</dialog>

<style lang="scss">
	@use './dialog';
</style>
