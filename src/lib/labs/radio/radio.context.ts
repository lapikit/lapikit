import { getContext, setContext } from 'svelte';
import type { RadioGroupContext } from './radio.types';

const key = Symbol('kit-radio-group');

export const setRadioGroup = (context: RadioGroupContext) => setContext(key, context);

export const getRadioGroup = () => getContext<RadioGroupContext | undefined>(key);
