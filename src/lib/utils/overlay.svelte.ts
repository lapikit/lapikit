export function onEscape(isActive: () => boolean, handler: (event: KeyboardEvent) => void) {
	$effect(() => {
		if (!isActive()) return;

		const onKeydown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') handler(event);
		};

		document.addEventListener('keydown', onKeydown);
		return () => document.removeEventListener('keydown', onKeydown);
	});
}

export function findTrigger(
	id: string,
	attribute: 'aria-controls' | 'aria-describedby' | 'aria-labelledby' = 'aria-controls'
) {
	return document.querySelector<HTMLElement>(`[${attribute}~="${CSS.escape(id)}"]`);
}
