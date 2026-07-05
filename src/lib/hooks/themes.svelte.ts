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

export const setTheme = refGlobalTheme.set;

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
