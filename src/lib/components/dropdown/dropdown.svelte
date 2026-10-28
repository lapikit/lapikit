<script lang="ts">
	import { onDestroy } from 'svelte';
	import { DEV } from 'esm-env';
	import {
		clickOutside,
		floating,
		useComponentAttrs,
		useElevation,
		type FloatingAnchor
	} from '$lib/utils';
	import type {
		DropdownProps,
		DropdownTriggerModel,
		DropdownTriggerProps
	} from './dropdown.types.ts';

	let {
		ref = $bindable(),
		open = $bindable(false),
		children,
		trigger,
		activator,
		rounded = 'md',
		position = 'bottom',
		closeOnClick = false,
		openOnHover = false,
		color,
		density = 'default',
		class: className,
		style: styleAttr,
		's-class': sClass,
		's-style': sStyle,
		elevation,
		...rest
	}: DropdownProps = $props();

	$effect(() => {
		if (DEV && activator)
			console.warn('[lapikit] kit:dropdown: activator is removed, use the trigger snippet');
	});

	const menuId = $props.id();

	let attrs = $derived(
		useComponentAttrs('kit-dropdown-content', { className, sClass, styleAttr, sStyle, color }, rest)
	);
	let elevationState = $derived(useElevation(elevation));

	let contentRef = $state<HTMLElement | null>(null);
	let triggerRef = $state<HTMLElement | null>(null);
	// a point opens the menu at the position of the pointer (context menu)
	let anchor = $state<FloatingAnchor | null>(null);
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	const itemSelector = '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]';
	const focusableSelector = 'a[href], button, input, select, textarea, [tabindex]';

	const clearHoverTimeout = () => {
		if (timeoutId) clearTimeout(timeoutId);
		timeoutId = null;
	};

	const items = () => {
		if (!contentRef) return [];
		const menuItems = contentRef.querySelectorAll<HTMLElement>(itemSelector);
		const list = menuItems.length
			? menuItems
			: contentRef.querySelectorAll<HTMLElement>(focusableSelector);
		return [...list].filter(
			(item) =>
				!item.matches(':disabled, [aria-disabled="true"], [tabindex="-1"]:not([role^="menuitem"])')
		);
	};

	const focusItem = (target: 'first' | 'last' | 'next' | 'previous') => {
		const list = items();
		if (!list.length) return;
		const index = list.indexOf(document.activeElement as HTMLElement);
		const next =
			target === 'first'
				? 0
				: target === 'last'
					? list.length - 1
					: target === 'next'
						? (index + 1) % list.length
						: (index - 1 + list.length) % list.length;
		list[next].focus();
	};

	const show = (target: FloatingAnchor, focus?: 'first' | 'last') => {
		clearHoverTimeout();
		anchor = target;
		open = true;
		if (focus) requestAnimationFrame(() => focusItem(focus));
	};

	const close = (restoreFocus = false) => {
		clearHoverTimeout();
		open = false;
		if (restoreFocus) triggerRef?.focus();
	};

	const scheduleClose = () => {
		if (!openOnHover) return;
		clearHoverTimeout();
		timeoutId = setTimeout(close, 150);
	};

	let triggerProps: DropdownTriggerProps = $derived({
		'aria-haspopup': 'menu',
		'aria-expanded': open,
		'aria-controls': menuId,
		onclick: (event: MouseEvent) => {
			triggerRef = event.currentTarget as HTMLElement;
			if (open) close();
			// detail is 0 when the click comes from the keyboard (Enter, Space)
			else show(triggerRef, event.detail === 0 ? 'first' : undefined);
		},
		onkeydown: (event: KeyboardEvent) => {
			if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
			event.preventDefault();
			triggerRef = event.currentTarget as HTMLElement;
			show(triggerRef, event.key === 'ArrowDown' ? 'first' : 'last');
		},
		...(openOnHover && {
			onpointerenter: (event: PointerEvent) => {
				if (event.pointerType === 'touch') return;
				triggerRef = event.currentTarget as HTMLElement;
				show(triggerRef);
			},
			onpointerleave: scheduleClose
		})
	});

	const model: DropdownTriggerModel = {
		get open() {
			return open;
		},
		close: () => close(),
		openAt: (event) => {
			event.preventDefault();
			triggerRef = event.currentTarget as HTMLElement;
			show({ x: event.clientX, y: event.clientY });
		}
	};

	const onMenuKeydown = (event: KeyboardEvent) => {
		const keys: Record<string, 'first' | 'last' | 'next' | 'previous'> = {
			ArrowDown: 'next',
			ArrowUp: 'previous',
			Home: 'first',
			End: 'last'
		};
		if (keys[event.key]) {
			event.preventDefault();
			focusItem(keys[event.key]);
		} else if (event.key === 'Tab') {
			close();
		}
	};

	$effect(() => {
		ref = contentRef;
	});

	$effect(() => {
		if (open && !anchor) {
			triggerRef = document.querySelector<HTMLElement>(`[aria-controls="${CSS.escape(menuId)}"]`);
			anchor = triggerRef;
		}
	});

	$effect(() => {
		if (!open) return;

		const onKeydown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') close(true);
		};

		document.addEventListener('keydown', onKeydown);
		return () => document.removeEventListener('keydown', onKeydown);
	});

	onDestroy(clearHoverTimeout);
</script>

{@render trigger?.(triggerProps, model)}

{#if open}
	<div
		bind:this={contentRef}
		id={menuId}
		popover="manual"
		class={attrs.class}
		style={attrs.style}
		role="menu"
		data-rounded={rounded}
		data-density={density}
		data-elevation={elevationState.base}
		data-elevation-hover={elevationState.hover}
		data-elevation-active={elevationState.active}
		onpointerenter={() => openOnHover && clearHoverTimeout()}
		onpointerleave={scheduleClose}
		onkeydown={onMenuKeydown}
		onclick={(event) => {
			event.stopPropagation();
			if (closeOnClick) close(true);
		}}
		use:floating={{ anchor, side: position, offset: 0 }}
		use:clickOutside={{ exclude: [contentRef, triggerRef], onClose: () => close() }}
		{...attrs.rest}
	>
		{@render children?.()}
	</div>
{/if}

<style lang="scss">
	@use './dropdown';
</style>
