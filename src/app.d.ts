// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { Component, ComponentProps } from 'svelte';
import type * as KitComponents from './lib/components';

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	namespace svelteHTML {
		type KitModule = typeof KitComponents;
		type AnyComponent = Component<Record<string, unknown>, Record<string, unknown>>;

		type KebabCase<S extends string> = S extends `${infer Head}${infer Tail}`
			? Tail extends Uncapitalize<Tail>
				? `${Lowercase<Head>}${KebabCase<Tail>}`
				: `${Lowercase<Head>}-${KebabCase<Tail>}`
			: S;

		type KitIntrinsicElements = {
			[K in keyof KitModule as K extends `Kit${infer Name}`
				? `kit:${KebabCase<Name>}`
				: never]: KitModule[K] extends AnyComponent ? ComponentProps<KitModule[K]> : never;
		};

		// eslint-disable-next-line @typescript-eslint/no-empty-object-type
		interface IntrinsicElements extends KitIntrinsicElements {}
	}
}

export {};
