const pressHandlerKeys = ['onclick', 'onpointerdown', 'onkeydown', 'onkeyup'] as const;

export function hasPressHandler(props: Record<string, unknown>): boolean {
	return pressHandlerKeys.some((key) => typeof props[key] === 'function');
}

export function useIsInteractive(
	props: Record<string, unknown>,
	tag: string,
	interactiveTags: readonly string[],
	interactive = false
): boolean {
	return interactive || interactiveTags.includes(tag) || hasPressHandler(props);
}

interface PressableOptions {
	tag: string;
	href?: string | null;
	type?: string | null;
	disabled?: boolean;
	focusableDisabled?: boolean;
}

export function pressableAttrs({
	tag,
	href,
	type,
	disabled = false,
	focusableDisabled = false
}: PressableOptions) {
	const isLink = tag === 'a';
	const isButton = tag === 'button';

	return {
		href: isLink && !disabled ? (href ?? undefined) : undefined,
		type: isButton ? (type ?? 'button') : undefined,
		disabled: isButton ? disabled && !focusableDisabled : undefined,
		tabindex: isLink && disabled ? (focusableDisabled ? 0 : -1) : undefined,
		'aria-disabled': disabled || undefined
	};
}
