import { getContext, setContext } from 'svelte';

export type ListItemSemantics = 'li' | 'listitem' | undefined;

interface ListContext {
	readonly item: ListItemSemantics;
}

const LIST_CONTEXT = Symbol('kit-list');

export const setListContext = (context: ListContext) => setContext(LIST_CONTEXT, context);

export const getListContext = () => getContext<ListContext | undefined>(LIST_CONTEXT);
