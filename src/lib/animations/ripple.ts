import type { RippleProps } from '$lib/@types';

const triggerEvents = ['pointerdown', 'touchstart', 'keydown'] as const;
const cancelEvents = ['mouseleave', 'dragleave', 'touchmove', 'touchcancel', 'pointerup', 'keyup'];

function resolveDuration(options: RippleProps) {
	return options.duration && options.duration > 0 ? options.duration : undefined;
}

function getCoords(e: PointerEvent | TouchEvent) {
	if (window.TouchEvent && e instanceof TouchEvent) {
		return { x: e.touches[0].clientX, y: e.touches[0].clientY };
	}

	return { x: (e as PointerEvent).clientX, y: (e as PointerEvent).clientY };
}

export function ripple(el: HTMLElement, options: RippleProps = {}) {
	// created on first interaction, removed once every ripple has faded out
	let rippleContainer: HTMLDivElement | undefined;
	const activeRipples = new Set<() => void>();

	function isAriaDisabled() {
		return el.getAttribute('aria-disabled') === 'true';
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

	function createRipple(e: PointerEvent | KeyboardEvent | TouchEvent, center?: boolean) {
		if (options.disabled || isAriaDisabled()) {
			return;
		}

		if (e instanceof KeyboardEvent) {
			if (!['Enter', 'Space'].includes(e.code) || e.repeat) {
				return;
			}

			e.preventDefault();
			const click = new PointerEvent('pointerdown');
			createRipple(click, true);

			return;
		}

		const container = mountContainer(center);

		const rect = el.getBoundingClientRect();
		const { x: clientX, y: clientY } = getCoords(e);

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

	triggerEvents.forEach((event) =>
		el.addEventListener(event, createRipple, { passive: event === 'touchstart' })
	);

	return {
		destroy() {
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
