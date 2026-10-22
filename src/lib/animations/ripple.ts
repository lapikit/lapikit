import type { RippleProps } from '$lib/@types';

const triggerEvents = ['pointerdown', 'keydown'] as const;
const cancelEvents = ['pointerleave', 'pointercancel', 'dragleave', 'pointerup', 'keyup', 'blur'];
const activationKeys = ['Enter', ' '];
const nestedControls =
	'a[href], button, input, select, textarea, summary, [role="button"], [role="link"]';
const hosts = new WeakMap<Element, () => boolean>();

function isHostControl(node: EventTarget | null) {
	return node instanceof Element && node.hasAttribute('data-ripple-host');
}

function resolveDuration(options: RippleProps) {
	return options.duration && options.duration > 0 ? options.duration : undefined;
}

export function ripple(el: HTMLElement, options: RippleProps = {}) {
	// created on first interaction, removed once every ripple has faded out
	let rippleContainer: HTMLDivElement | undefined;
	const activeRipples = new Set<() => void>();

	function isAriaDisabled() {
		return el.getAttribute('aria-disabled') === 'true';
	}

	/** The click starts in a child that handles it itself: an enabled ripple (a btn in a card) or a native control */
	function isFromNestedControl(target: EventTarget | null) {
		let node = target instanceof Element ? target : null;

		while (node && node !== el) {
			if (hosts.get(node)?.()) return true;
			if (node.matches(nestedControls) && !isHostControl(node)) return true;
			node = node.parentElement;
		}
		return false;
	}

	function applyOptions(container: HTMLDivElement) {
		if (options.component) {
			container.style.setProperty(
				'--system-ripple-radius',
				`var(--kit-${options.component}-radius)`
			);
		}

		if (options.color) {
			container.style.setProperty('--system-ripple-color', options.color);
		}

		const duration = resolveDuration(options);

		if (duration) {
			container.style.setProperty('--system-animation-ripple-duration', `${duration}ms`);
		}
	}

	function mountContainer(center?: boolean) {
		if (!rippleContainer) {
			rippleContainer = document.createElement('div');
			rippleContainer.classList.add('kit-ripple--effect');
			applyOptions(rippleContainer);
		}

		rippleContainer.classList.toggle('kit-ripple--center', !!(center || options.center));

		if (!rippleContainer.isConnected) {
			el.appendChild(rippleContainer);
		}

		return rippleContainer;
	}

	function unmountContainer() {
		rippleContainer?.remove();
		rippleContainer = undefined;
	}

	function setOptions(newOptions: RippleProps) {
		options = newOptions;

		if (newOptions.disabled || isAriaDisabled()) {
			activeRipples.forEach((cleanup) => cleanup());
			activeRipples.clear();
			unmountContainer();
		} else if (rippleContainer) {
			applyOptions(rippleContainer);
		}
	}

	function createRipple(e: PointerEvent | KeyboardEvent) {
		if (options.disabled || isAriaDisabled()) {
			return;
		}

		const isKeyboard = e instanceof KeyboardEvent;

		if (isKeyboard) {
			const isOwnTarget = e.target === el || isHostControl(e.target);

			if (!activationKeys.includes(e.key) || e.repeat || !isOwnTarget) {
				return;
			}
		} else if (e.button !== 0 || isFromNestedControl(e.target)) {
			return;
		}

		const container = mountContainer(isKeyboard);

		const rect = el.getBoundingClientRect();
		const clientX = isKeyboard ? rect.left + rect.width / 2 : e.clientX;
		const clientY = isKeyboard ? rect.top + rect.height / 2 : e.clientY;

		const x = clientX - rect.left > el.offsetWidth / 2 ? 0 : el.offsetWidth;
		const y = clientY - rect.top > el.offsetHeight / 2 ? 0 : el.offsetHeight;
		const radius = Math.hypot(x - (clientX - rect.left), y - (clientY - rect.top));

		const ripple = document.createElement('div');
		ripple.classList.add('kit-ripple');

		ripple.style.left = `${clientX - rect.left - radius}px`;
		ripple.style.top = `${clientY - rect.top - radius}px`;
		ripple.style.width = ripple.style.height = `${radius * 2}px`;

		container.appendChild(ripple);

		let timeoutId: ReturnType<typeof setTimeout> | undefined;

		function cleanup() {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}

			cancelEvents.forEach((event) => el.removeEventListener(event, removeRipple));
			ripple.remove();
		}

		function release() {
			activeRipples.delete(cleanup);

			if (activeRipples.size === 0) {
				unmountContainer();
			}
		}

		function removeRipple() {
			ripple.style.opacity = '0';

			cancelEvents.forEach((event) => el.removeEventListener(event, removeRipple));

			timeoutId = setTimeout(
				() => {
					ripple.remove();
					release();
				},
				resolveDuration(options) || 1000
			);
		}

		activeRipples.add(cleanup);
		cancelEvents.forEach((event) => el.addEventListener(event, removeRipple, { passive: true }));
	}

	hosts.set(el, () => !options.disabled && !isAriaDisabled());
	triggerEvents.forEach((event) => el.addEventListener(event, createRipple, { passive: true }));

	return {
		destroy() {
			hosts.delete(el);
			triggerEvents.forEach((event) => {
				el.removeEventListener(event, createRipple);
			});

			activeRipples.forEach((cleanup) => cleanup());
			activeRipples.clear();

			unmountContainer();
		},
		update(newOptions: RippleProps) {
			setOptions(newOptions);
		}
	};
}
