import { mount } from 'svelte';
import type { TooltipOptions, TooltipTriggerProps, TooltipValue } from './tooltip.types.ts';

const sharedId = 'kit-tooltip-shared';

// one tooltip for every kit:btn, kit:chip and kit:icon, mounted on the first hover or focus
const shared = $state({
	id: sharedId,
	open: false,
	label: '',
	location: 'bottom' as TooltipOptions['location'],
	variant: undefined as TooltipOptions['variant'],
	density: 'default' as TooltipOptions['density'],
	rounded: 'xs' as TooltipOptions['rounded'],
	delayDuration: 850,
	closeDelay: 100
});

let loading: Promise<() => TooltipTriggerProps> | null = null;
let owner: HTMLElement | null = null;

function load() {
	loading ??= import('./tooltip.svelte').then(({ default: Tooltip }) => {
		const instance = mount(Tooltip, { target: document.body, props: shared });
		return instance.triggerHandlers;
	});
	return loading;
}

function normalize(value: TooltipValue): TooltipOptions | null {
	if (!value) return null;
	return typeof value === 'string' ? { label: value } : value.label ? value : null;
}

/**
 * tooltip - Shows the shared tooltip on hover and keyboard focus of the node.
 * A node without an accessible name gets the label as aria-label, the others get it as a description.
 */
export function tooltip(node: HTMLElement, value: TooltipValue) {
	let options = normalize(value);
	let named = false;
	let hovered = false;
	let listening = false;

	function syncName() {
		if (named) node.removeAttribute('aria-label');
		named = false;
		if (!options) return;
		const hasName =
			node.hasAttribute('aria-label') ||
			node.hasAttribute('aria-labelledby') ||
			!!node.textContent?.trim();
		if (hasName) return;
		node.setAttribute('aria-label', options.label);
		named = true;
	}

	function describe(on: boolean) {
		if (named) return;
		const ids = (node.getAttribute('aria-describedby') ?? '').split(' ').filter(Boolean);
		const others = ids.filter((id) => id !== sharedId);
		const next = on ? [...others, sharedId] : others;
		if (next.length) node.setAttribute('aria-describedby', next.join(' '));
		else node.removeAttribute('aria-describedby');
	}

	function activate() {
		if (!options) return;
		owner = node;
		Object.assign(shared, {
			label: options.label,
			location: options.location ?? 'bottom',
			variant: options.variant,
			density: options.density ?? 'default',
			rounded: options.rounded ?? 'xs',
			delayDuration: options.delayDuration ?? 850,
			closeDelay: options.closeDelay ?? 100
		});
	}

	// the handlers read currentTarget and target, gone once the event is dispatched
	const as = <T>(event: Event, target: EventTarget | null = event.target) =>
		({ currentTarget: node, target, pointerType: (event as PointerEvent).pointerType }) as T;

	const onPointerEnter = (event: PointerEvent) => {
		hovered = true;
		if (event.pointerType === 'touch') return;
		const fake = as<PointerEvent>(event);
		load().then((handlers) => {
			if (!hovered) return;
			activate();
			handlers().onpointerenter(fake);
		});
	};

	const onPointerLeave = (event: PointerEvent) => {
		hovered = false;
		if (owner === node) loading?.then((handlers) => handlers().onpointerleave(event));
	};

	const onPointerDown = (event: PointerEvent) => {
		if (owner === node) loading?.then((handlers) => handlers().onpointerdown(event));
	};

	const onFocusIn = (event: FocusEvent) => {
		if (node.contains(event.relatedTarget as Node | null)) return;
		describe(true);
		const fake = as<FocusEvent>(event);
		load().then((handlers) => {
			if (!node.contains(document.activeElement)) return;
			activate();
			handlers().onfocus(fake);
		});
	};

	const onFocusOut = (event: FocusEvent) => {
		if (node.contains(event.relatedTarget as Node | null)) return;
		describe(false);
		if (owner === node) loading?.then((handlers) => handlers().onblur(event));
	};

	function listen(on: boolean) {
		if (on === listening) return;
		listening = on;
		const method = on ? 'addEventListener' : 'removeEventListener';
		node[method]('pointerenter', onPointerEnter as EventListener);
		node[method]('pointerleave', onPointerLeave as EventListener);
		node[method]('pointerdown', onPointerDown as EventListener);
		node[method]('focusin', onFocusIn as EventListener);
		node[method]('focusout', onFocusOut as EventListener);
	}

	function release() {
		if (owner !== node) return;
		owner = null;
		shared.open = false;
	}

	listen(!!options);
	syncName();

	return {
		update(next: TooltipValue) {
			options = normalize(next);
			listen(!!options);
			syncName();
			if (!options) {
				describe(false);
				release();
			} else if (owner === node) {
				activate();
			}
		},
		destroy() {
			listen(false);
			if (named) node.removeAttribute('aria-label');
			describe(false);
			release();
		}
	};
}
