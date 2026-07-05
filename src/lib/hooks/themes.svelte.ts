import type { ThemeOptions, ThemeAction } from '$lib/@types';
import type { Action } from 'svelte/action';

// states
const isBrowser = typeof window !== 'undefined';

// presets
const default_theme = 'light';
const default_storage_key = '@lapikit/theme';

function generateGlobalTheme() {
	let active = $state(default_theme);
	let key = default_storage_key;
	let initialized = false;

	function applyToHtml(name: string) {
		if (!isBrowser) return;

		document.documentElement.setAttribute('data-kit-theme', name);
		active = name;
	}

	function set(name: string) {
		applyToHtml(name);
		if (isBrowser) {
			localStorage.setItem(key, name);
		}
	}

	function init(params: ThemeOptions = {}) {
		if (initialized) return;
		initialized = true;

		key = params.key ?? default_storage_key;
		const stored = isBrowser ? localStorage.getItem(key) : null;
		applyToHtml(stored ?? params.name ?? default_theme);
	}

	return {
		init,
		set,
		get active() {
			return active;
		}
	};
}

const refGlobalTheme = generateGlobalTheme();

export const useTheme = refGlobalTheme.set;

export function createGlobalTheme(params?: ThemeOptions) {
	refGlobalTheme.init(params);

	return {
		get active() {
			return refGlobalTheme.active;
		}
	};
}

export function createTheme(): ThemeAction {
	let active = $state(default_theme);
	let node: HTMLElement | undefined;
	let key: string | undefined;
	let overridden = $state(false);

	function applyTheme(name: string) {
		const target = node;
		if (!target) return;

		target.setAttribute('data-kit-theme', name);
		active = name;
	}

	function set(name: string) {
		applyTheme(name);
		if (isBrowser && key) {
			localStorage.setItem(key, name);
		}
	}

	// skip the effect's first automatic pass so the mount's own initial value (from
	// `name`, storage or default) isn't immediately clobbered by the current global value
	let firstRun = true;

	// re-syncs to the global theme whenever it changes, unless this zone is overridden
	$effect(() => {
		const value = refGlobalTheme.active;
		const isOverridden = overridden;
		const skip = firstRun;
		firstRun = false;

		if (!skip && !isOverridden) {
			applyTheme(value);
		}
	});

	const action: Action<HTMLElement, ThemeOptions | undefined> = (n, params = {}) => {
		node = n;
		key = params.key;
		overridden = params.overridden ?? false;

		const stored = isBrowser && key ? localStorage.getItem(key) : null;
		applyTheme(stored ?? params.name ?? (overridden ? default_theme : refGlobalTheme.active));

		return {
			update(newParams: ThemeOptions = {}) {
				key = newParams.key;
				overridden = newParams.overridden ?? false;
			},
			destroy() {
				node = undefined;
			}
		};
	};

	return {
		action,
		set,
		get active() {
			return active;
		}
	};
}

/** LEGACY CODE
 * NEED UPDATE documentation with new theme system before removing this legacy code. The new theme system is designed to be more flexible and easier to use, allowing for better integration with Svelte's reactivity and component structure. It also provides a more consistent API for managing themes across different components and contexts.
 * TODO: Remove this legacy code once the new theme system is fully implemented and tested. This code is kept for backward compatibility with existing components that rely on the old theme system.
 */

import { writable, type Writable } from 'svelte/store';

// presets
const themeRef: string = 'light';

export const theme: Writable<string> = writable(themeRef);

// export function useTheme(name: string, key: string = '@lapikit/theme') {
// 	theme.update(() => {
// 		if (isBrowser) {
// 			const html = document.documentElement;

// 			html.classList.forEach((cls) => {
// 				if (cls.startsWith('kit-theme--')) {
// 					html.classList.remove(cls);
// 				}
// 			});

// 			html.classList.add(`kit-theme--${name}`);
// 			localStorage.setItem(key, name);
// 		}
// 		return name;
// 	});
// }
