export type ClickOutsideOptions = {
	exclude?: (HTMLElement | PointerEvent | null)[];
	onClose: () => void;
};
