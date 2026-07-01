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
	const rippleContainer = document.createElement('div');
	const activeRipples = new Set<() => void>();
	addClasses();

	setOptions(options);

	function isAriaDisabled() {
		return el.getAttribute('aria-disabled') === 'true';
	}

	function addClasses(center?: boolean) {
		const shouldBeCentered = center || options.center;

		if (!rippleContainer.classList.contains('kit-ripple--effect')) {
			rippleContainer.classList.add('kit-ripple--effect');
		}

		if (!shouldBeCentered && rippleContainer.classList.contains('kit-ripple--center')) {
			rippleContainer.classList.remove('kit-ripple--center');
		}

		if (shouldBeCentered) {
			rippleContainer.classList.add('kit-ripple--center');
		}
	}

	function setOptions(newOptions: RippleProps) {
		if (newOptions.disabled || isAriaDisabled()) {
			rippleContainer.remove();
		} else {
			el.appendChild(rippleContainer);
		}

		if (newOptions.component) {
			rippleContainer.style.setProperty(
				'--system-ripple-radius',
				`var(--kit-${newOptions.component}-radius)`
			);
		}

		if (newOptions.color) {
			rippleContainer.style.setProperty('--system-ripple-color', newOptions.color);
		}

		const duration = resolveDuration(newOptions);

		if (duration) {
			rippleContainer.style.setProperty('--system-animation-ripple-duration', `${duration}ms`);
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

		addClasses(center);

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

		rippleContainer.appendChild(ripple);

		let timeoutId: ReturnType<typeof setTimeout> | undefined;

		function cleanup() {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}

			cancelEvents.forEach((event) => el.removeEventListener(event, removeRipple));
			ripple.remove();
		}

		function removeRipple() {
			ripple.style.opacity = '0';

			cancelEvents.forEach((event) => el.removeEventListener(event, removeRipple));

			timeoutId = setTimeout(() => {
				ripple.remove();
				activeRipples.delete(cleanup);
			}, resolveDuration(options) || 1000);
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

			rippleContainer.remove();
		},
		update(newOptions: RippleProps) {
			options = newOptions;

			setOptions(newOptions);
		}
	};
}
