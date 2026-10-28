import type { HTMLInputAttributes } from 'svelte/elements';
import type { ChoiceBaseProps, ChoiceValue } from '../checkbox/checkbox.types';

type OwnedAttributes = keyof ChoiceBaseProps | 'type' | 'checked' | 'value' | 'size' | 'role';

export interface SwitchProps extends ChoiceBaseProps, Omit<HTMLInputAttributes, OwnedAttributes> {
	checked?: boolean;
	value?: ChoiceValue;
	/** the label before the switch */
	reverse?: boolean;
	message?: string;
	errorMessage?: string;
}
