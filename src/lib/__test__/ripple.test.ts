// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ripple } from '$lib/animations';

// jsdom does not implement PointerEvent
if (!('PointerEvent' in globalThis)) {
	globalThis.PointerEvent = class extends MouseEvent {} as typeof PointerEvent;
}

function setup(options = {}) {
	const el = document.createElement('button');
	document.body.appendChild(el);
	const action = ripple(el, options);
	return { el, action };
}

const container = (el: HTMLElement) => el.querySelector('.kit-ripple--effect');

describe('ripple', () => {
	afterEach(() => {
		vi.useRealTimers();
		document.body.innerHTML = '';
	});

	it('does not render anything before the first interaction', () => {
		const { el } = setup();
		expect(el.children.length).toBe(0);
	});

	it('creates the container on pointerdown and removes it once the ripple faded out', () => {
		vi.useFakeTimers();
		const { el } = setup({ duration: 200, component: 'btn' });

		el.dispatchEvent(new PointerEvent('pointerdown'));
		expect(container(el)).not.toBeNull();
		expect(el.querySelectorAll('.kit-ripple').length).toBe(1);
		expect((container(el) as HTMLElement).style.getPropertyValue('--system-ripple-radius')).toBe(
			'var(--kit-btn-radius)'
		);

		el.dispatchEvent(new PointerEvent('pointerup'));
		vi.advanceTimersByTime(200);
		expect(container(el)).toBeNull();
	});

	it('keeps the container while another ripple is still active', () => {
		vi.useFakeTimers();
		const { el } = setup({ duration: 200 });

		el.dispatchEvent(new PointerEvent('pointerdown'));
		el.dispatchEvent(new PointerEvent('pointerup'));
		el.dispatchEvent(new PointerEvent('pointerdown'));
		vi.advanceTimersByTime(200);

		expect(container(el)).not.toBeNull();
		expect(el.querySelectorAll('.kit-ripple').length).toBe(1);
	});

	it('does nothing when disabled', () => {
		const { el, action } = setup({ disabled: true });
		el.dispatchEvent(new PointerEvent('pointerdown'));
		expect(container(el)).toBeNull();

		action.update({ disabled: false });
		el.dispatchEvent(new PointerEvent('pointerdown'));
		expect(container(el)).not.toBeNull();

		action.update({ disabled: true });
		expect(container(el)).toBeNull();
	});

	it('cleans up on destroy', () => {
		const { el, action } = setup();
		el.dispatchEvent(new PointerEvent('pointerdown'));
		action.destroy();
		expect(el.children.length).toBe(0);

		el.dispatchEvent(new PointerEvent('pointerdown'));
		expect(el.children.length).toBe(0);
	});
});
