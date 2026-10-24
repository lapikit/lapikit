import type { ClickOutsideOptions } from '$lib/@types';

export function clickOutside(node: HTMLElement, options: ClickOutsideOptions) {
	let { exclude = [], onClose } = options;

	function isTargetExcluded(target: Node): boolean {
		return exclude.some((ex) => {
			if (!ex) return false;

			if (ex instanceof HTMLElement) {
				return ex.contains(target);
			}

			if (ex instanceof PointerEvent && ex.target instanceof Node) {
				return ex.target.contains(target);
			}

			return false;
		});
	}

	const handleClick = (event: MouseEvent) => {
		const target = event.target as Node;

		const isExcluded = isTargetExcluded(target);
		const isInside = node.contains(target);

		if (!isInside && !isExcluded) {
			onClose();
		}
	};

	document.addEventListener('click', handleClick, true);

	return {
		update(newOptions: ClickOutsideOptions) {
			exclude = newOptions.exclude || [];
			onClose = newOptions.onClose;
		},
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
}

let scrollLocks = 0;
let previousOverflow = '';

/** Blocks the scroll of the page; each call needs its own unlockScroll() */
export function lockScroll() {
	if (typeof document === 'undefined') return;
	if (scrollLocks++ === 0) {
		previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
	}
}

export function unlockScroll() {
	if (typeof document === 'undefined' || scrollLocks === 0) return;
	if (--scrollLocks === 0) document.body.style.overflow = previousOverflow;
}
