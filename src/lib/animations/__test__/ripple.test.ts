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

	it('keeps the native Enter and Space actions', () => {
		const { el } = setup();

		for (const [key, code] of [
			['Enter', 'Enter'],
			[' ', 'Space']
		]) {
			const event = new KeyboardEvent('keydown', { key, code, bubbles: true, cancelable: true });
			el.dispatchEvent(event);
			expect(event.defaultPrevented).toBe(false);
		}
		expect(el.querySelectorAll('.kit-ripple').length).toBe(2);
	});

	it('ignores the keys pressed inside a child (an input in a card)', () => {
		const { el } = setup();
		const input = document.createElement('input');
		el.appendChild(input);

		const event = new KeyboardEvent('keydown', {
			key: ' ',
			code: 'Space',
			bubbles: true,
			cancelable: true
		});
		input.dispatchEvent(event);

		expect(event.defaultPrevented).toBe(false);
		expect(container(el)).toBeNull();
	});

	it('creates one ripple only on touch (pointerdown and touchstart)', () => {
		const { el } = setup();
		el.dispatchEvent(new PointerEvent('pointerdown', { pointerType: 'touch' } as PointerEventInit));
		el.dispatchEvent(new Event('touchstart'));
		expect(el.querySelectorAll('.kit-ripple').length).toBe(1);
	});

	it('ignores the secondary mouse buttons', () => {
		const { el } = setup();
		el.dispatchEvent(new PointerEvent('pointerdown', { button: 2 }));
		expect(container(el)).toBeNull();
	});

	it('removes the keyboard ripple when the element loses the focus', () => {
		vi.useFakeTimers();
		const { el } = setup({ duration: 200 });
		el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter' }));
		el.dispatchEvent(new FocusEvent('blur'));
		vi.advanceTimersByTime(200);
		expect(container(el)).toBeNull();
	});

	it('leaves the click on a nested ripple (a button in a card) to the nested one', () => {
		const { el: card } = setup();
		const btn = document.createElement('button');
		const icon = document.createElement('span');
		btn.appendChild(icon);
		card.appendChild(btn);
		ripple(btn);

		icon.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));

		expect(btn.querySelector('.kit-ripple--effect')).not.toBeNull();
		expect([...card.children].some((child) => child.matches('.kit-ripple--effect'))).toBe(false);
	});

	it('leaves the click on a nested native control (an input in a card) to it', () => {
		const card = document.createElement('div');
		document.body.appendChild(card);
		ripple(card);
		const input = document.createElement('input');
		card.appendChild(input);

		input.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
		expect(container(card)).toBeNull();
	});

	it('ripples the host from its own control (the input of a btn)', () => {
		const label = document.createElement('label');
		document.body.appendChild(label);
		ripple(label);
		const input = document.createElement('input');
		input.type = 'checkbox';
		input.setAttribute('data-ripple-host', '');
		label.appendChild(input);

		input.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
		input.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true }));
		expect(label.querySelectorAll('.kit-ripple').length).toBe(2);
	});

	it('still ripples when the nested ripple is disabled', () => {
		const card = document.createElement('div');
		document.body.appendChild(card);
		ripple(card);
		const inner = document.createElement('div');
		card.appendChild(inner);
		ripple(inner, { disabled: true });

		inner.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
		expect(container(card)).not.toBeNull();
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
