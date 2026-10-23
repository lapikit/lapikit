export type FloatingSide = 'top' | 'bottom' | 'left' | 'right';
export type FloatingAlign = 'start' | 'center' | 'end';

/** An element, or a point of the viewport (the position of a pointer event) */
export type FloatingAnchor = HTMLElement | { x: number; y: number };

export interface FloatingOptions {
	anchor: FloatingAnchor | null | undefined;
	/** false hides the element without removing it (default true) */
	open?: boolean;
	side?: FloatingSide;
	align?: FloatingAlign;
	/** space between the anchor and the floating element, in px */
	offset?: number;
	/** minimal space between the floating element and the edges of the viewport, in px */
	padding?: number;
	/** moves to the opposite side when there is not enough space */
	flip?: boolean;
}

export interface FloatingRect {
	top: number;
	right: number;
	bottom: number;
	left: number;
	width: number;
	height: number;
}

export interface FloatingPosition {
	x: number;
	y: number;
	side: FloatingSide;
	/** position of the center of the anchor along the floating element, for an arrow */
	arrow: number;
}

const opposite: Record<FloatingSide, FloatingSide> = {
	top: 'bottom',
	bottom: 'top',
	left: 'right',
	right: 'left'
};

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), Math.max(min, max));
}

/**
 * computeFloating - The position of a floating element next to an anchor (pure function).
 * @param anchor - The rect of the anchor, in the viewport.
 * @param size - The size of the floating element (offsetWidth / offsetHeight: not affected by a transform).
 * @param viewport - The size of the viewport, without the scrollbars.
 */
export function computeFloating(
	anchor: FloatingRect,
	size: { width: number; height: number },
	viewport: { width: number; height: number },
	{
		side = 'bottom',
		align = 'start',
		offset = 6,
		padding = 8,
		flip = true
	}: Omit<FloatingOptions, 'anchor'> = {}
): FloatingPosition {
	const space: Record<FloatingSide, number> = {
		top: anchor.top - offset - padding,
		bottom: viewport.height - anchor.bottom - offset - padding,
		left: anchor.left - offset - padding,
		right: viewport.width - anchor.right - offset - padding
	};
	const vertical = side === 'top' || side === 'bottom';
	const needed = vertical ? size.height : size.width;

	let resolvedSide = side;
	if (flip && space[side] < needed && space[opposite[side]] > space[side]) {
		resolvedSide = opposite[side];
	}

	let x: number;
	let y: number;

	if (vertical) {
		y = resolvedSide === 'top' ? anchor.top - offset - size.height : anchor.bottom + offset;
		x =
			align === 'start'
				? anchor.left
				: align === 'end'
					? anchor.right - size.width
					: anchor.left + (anchor.width - size.width) / 2;
	} else {
		x = resolvedSide === 'left' ? anchor.left - offset - size.width : anchor.right + offset;
		y =
			align === 'start'
				? anchor.top
				: align === 'end'
					? anchor.bottom - size.height
					: anchor.top + (anchor.height - size.height) / 2;
	}

	// shift: the floating element stays in the viewport
	x = clamp(x, padding, viewport.width - size.width - padding);
	y = clamp(y, padding, viewport.height - size.height - padding);

	const arrow = vertical
		? clamp(anchor.left + anchor.width / 2 - x, 8, size.width - 8)
		: clamp(anchor.top + anchor.height / 2 - y, 8, size.height - 8);

	return { x, y, side: resolvedSide, arrow };
}

function anchorRect(anchor: FloatingAnchor): FloatingRect {
	if (anchor instanceof HTMLElement) return anchor.getBoundingClientRect();
	return { top: anchor.y, right: anchor.x, bottom: anchor.y, left: anchor.x, width: 0, height: 0 };
}

function supportsPopover(node: HTMLElement) {
	return typeof node.showPopover === 'function';
}

/**
 * floating - Shows an element in the top layer (Popover API) next to its anchor, and keeps it there.
 * The element needs the popover attribute. It gets its position (left / top), its side (data-side)
 * and the position of the arrow (--kit-floating-arrow).
 * It follows the scroll of every ancestor, the resize of the viewport and the size of both elements.
 */
export function floating(node: HTMLElement, options: FloatingOptions) {
	let frame = 0;

	function toggle() {
		if (!supportsPopover(node)) return;
		const shown = node.matches(':popover-open');
		if (options.open !== false && !shown) node.showPopover();
		if (options.open === false && shown) node.hidePopover();
	}

	function update() {
		const { anchor, open, ...rest } = options;
		if (open === false || !anchor || !node.isConnected) return;
		if (anchor instanceof HTMLElement && !anchor.isConnected) return;

		const position = computeFloating(
			anchorRect(anchor),
			{ width: node.offsetWidth, height: node.offsetHeight },
			{
				width: document.documentElement.clientWidth,
				height: document.documentElement.clientHeight
			},
			rest
		);

		node.style.left = `${position.x}px`;
		node.style.top = `${position.y}px`;
		node.style.setProperty('--kit-floating-arrow', `${position.arrow}px`);
		node.dataset.side = position.side;
	}

	function schedule() {
		cancelAnimationFrame(frame);
		frame = requestAnimationFrame(update);
	}

	toggle();
	update();

	// capture: the scroll of any ancestor, not only the window
	window.addEventListener('scroll', schedule, { capture: true, passive: true });
	window.addEventListener('resize', schedule, { passive: true });

	const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule);
	observer?.observe(node);
	if (options.anchor instanceof HTMLElement) observer?.observe(options.anchor);

	return {
		update(next: FloatingOptions) {
			if (next.anchor !== options.anchor) {
				if (options.anchor instanceof HTMLElement) observer?.unobserve(options.anchor);
				if (next.anchor instanceof HTMLElement) observer?.observe(next.anchor);
			}
			options = next;
			toggle();
			schedule();
		},
		destroy() {
			cancelAnimationFrame(frame);
			window.removeEventListener('scroll', schedule, { capture: true });
			window.removeEventListener('resize', schedule);
			observer?.disconnect();
			if (supportsPopover(node) && node.matches(':popover-open')) node.hidePopover();
		}
	};
}
