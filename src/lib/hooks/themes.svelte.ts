import type { ThemeOptions, ThemeAction } from '$lib/@types';
import type { Action } from 'svelte/action';

// states
const isBrowser = typeof window !== 'undefined';

// presets
const default_theme = 'light';
const default_storage_key = '@lapikit/theme';

// localStorage can throw (private browsing, blocked storage): the theme still applies, without being kept
function readStorage(key: string): string | null {
	if (!isBrowser) return null;
	try {
		return localStorage.getItem(key);
	} catch {
		return null;
	}
}

function writeStorage(key: string, name: string) {
	if (!isBrowser) return;
	try {
		localStorage.setItem(key, name);
	} catch {
		// ignored: see readStorage
	}
}

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
		writeStorage(key, name);
	}

	function init(params: ThemeOptions = {}) {
		if (initialized) return;
		initialized = true;

		key = params.key ?? default_storage_key;
		const stored = readStorage(key);
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
		if (key) writeStorage(key, name);
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

		const stored = key ? readStorage(key) : null;
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

/**
 * themeScript - An inline script that applies the stored theme before the page is painted (no flash with SSR).
 * Put it in the <head>: {@html themeScript()} inside <svelte:head>.
 */
export function themeScript(params: Pick<ThemeOptions, 'name' | 'key'> = {}): string {
	const key = JSON.stringify(params.key ?? default_storage_key);
	const name = JSON.stringify(params.name ?? null);
	const code = `(function(){var t=null;try{t=localStorage.getItem(${key})}catch(e){}t=t||${name};if(t)document.documentElement.setAttribute('data-kit-theme',t)})()`;
	return `<script>${code.replace(/</g, '\\u003c')}</script>`;
}
