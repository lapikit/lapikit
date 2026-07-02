#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { terminal } from './helpers.js';

const execFileAsync = promisify(execFile);

const INSTALL_ARGS = {
	npm: ['install', '--save-dev'],
	yarn: ['add', '-D'],
	pnpm: ['add', '--save-dev'],
	bun: ['add', '-D']
};

export async function installDependency(pkgManager, packageName, cwd) {
	const args = INSTALL_ARGS[pkgManager];
	if (!args) throw new Error(`Unsupported package manager: ${pkgManager}`);
	await execFileAsync(pkgManager, [...args, packageName], { cwd, stdio: 'inherit' });
}

function findMatchingDelimiter(content, openIndex, openChar, closeChar) {
	let depth = 0;
	for (let i = openIndex; i < content.length; i++) {
		if (content[i] === openChar) depth++;
		else if (content[i] === closeChar) {
			depth--;
			if (depth === 0) return i;
		}
	}
	return -1;
}

function insertImportLine(content, importLine) {
	const lines = content.split('\n');
	let importInsertIndex = 0;
	for (let i = 0; i < lines.length; i++) {
		if (lines[i].trim().startsWith('import ')) importInsertIndex = i + 1;
	}
	lines.splice(importInsertIndex, 0, importLine);
	return lines.join('\n');
}

function buildPreprocessCall(pluginKeys = []) {
	if (!pluginKeys.length) return `lapikitPreprocess()`;
	const plugins = pluginKeys.map((key) => `'${key}'`).join(', ');
	return `lapikitPreprocess({ plugins: [${plugins}] })`;
}

// `lapikitPreprocess` is already imported and called in `content` — merge
// `pluginKeys` into the existing call instead of skipping the update, so
// re-running the installer after selecting a new addon actually adds it.
// Returns the updated content, or null if there is nothing to change.
function mergeExistingPreprocessCall(content, pluginKeys) {
	if (!pluginKeys.length) return null;

	const callMatch = content.match(/lapikitPreprocess\s*\(\s*(\{[\s\S]*?\})?\s*\)/);
	if (!callMatch) return null;

	const [fullMatch, optionsSource] = callMatch;
	const existingKeys = optionsSource
		? [...optionsSource.matchAll(/'([^']+)'|"([^"]+)"/g)].map((m) => m[1] ?? m[2])
		: [];

	const merged = [...new Set([...existingKeys, ...pluginKeys])];
	if (merged.length === existingKeys.length) return null;

	const newCall = buildPreprocessCall(merged);
	return (
		content.slice(0, callMatch.index) + newCall + content.slice(callMatch.index + fullMatch.length)
	);
}

// `objectSource` is a `{ ... }` slice (e.g. the svelte.config default export,
// or the options object passed to the sveltekit() vite plugin).
function injectPreprocessEntry(objectSource, pluginKeys = []) {
	const call = buildPreprocessCall(pluginKeys);
	const preprocessMatch = objectSource.match(/preprocess\s*:\s*(\[|[^,\n\]{}]+)/);

	if (!preprocessMatch) {
		return objectSource.replace('{', `{\n\t\t\tpreprocess: [${call}],`);
	}

	if (preprocessMatch[1] === '[') {
		const openBracketIndex = preprocessMatch.index + preprocessMatch[0].length - 1;
		const closeBracketIndex = findMatchingDelimiter(objectSource, openBracketIndex, '[', ']');
		const inner = objectSource.slice(openBracketIndex + 1, closeBracketIndex);
		const trimmed = inner.trim();

		let newInner;
		if (!trimmed) {
			newInner = call;
		} else if (inner.includes('\n')) {
			const firstItemMatch = inner.match(/\n(\s*)\S/);
			const indent = firstItemMatch ? firstItemMatch[1] : '\t\t';
			const closingMatch = inner.match(/\n(\s*)$/);
			const closingIndent = closingMatch ? closingMatch[1] : '\t';
			const innerTrimmed = inner.trimEnd();
			const sep = innerTrimmed.endsWith(',') ? '' : ',';
			newInner = `${innerTrimmed}${sep}\n${indent}${call}\n${closingIndent}`;
		} else {
			const sep = trimmed.endsWith(',') ? ' ' : ', ';
			newInner = `${trimmed}${sep}${call}`;
		}

		return (
			objectSource.slice(0, openBracketIndex + 1) + newInner + objectSource.slice(closeBracketIndex)
		);
	}

	const val = preprocessMatch[1].trim();
	return (
		objectSource.slice(0, preprocessMatch.index) +
		`preprocess: [${val}, ${call}]` +
		objectSource.slice(preprocessMatch.index + preprocessMatch[0].length)
	);
}

export async function findSvelteConfigFile(projectPath) {
	for (const ext of ['js', 'mjs', 'cjs', 'ts']) {
		const file = path.join(projectPath, `svelte.config.${ext}`);
		try {
			await fs.access(file);
			return file;
		} catch {
			// lapikit other step
		}
	}
	throw new Error('No svelte.config file found');
}

export async function addLiliPreprocess(svelteConfigFile, pluginKeys = []) {
	let content = await fs.readFile(svelteConfigFile, 'utf-8');
	const lapikitImport = `import { lapikitPreprocess } from 'lapikit/preprocess';`;

	if (content.includes(`from 'lapikit/preprocess'`)) {
		const updated = mergeExistingPreprocessCall(content, pluginKeys);
		if (!updated) {
			terminal('warn', `lapikitPreprocess already imported in ${svelteConfigFile}`);
			return;
		}
		await fs.writeFile(svelteConfigFile, updated);
		terminal('success', `lapikitPreprocess plugins updated in ${svelteConfigFile}`);
		return;
	}

	const match = content.match(/(?:const\s+\w+\s*=\s*|export\s+default\s*)(\{)/);
	if (!match) {
		throw new Error(`Could not find the exported config object in ${svelteConfigFile}`);
	}

	const openBraceIndex = match.index + match[0].length - 1;
	const closeBraceIndex = findMatchingDelimiter(content, openBraceIndex, '{', '}');
	if (closeBraceIndex === -1) {
		throw new Error(`Could not parse the config object in ${svelteConfigFile}`);
	}

	const objectSource = content.slice(openBraceIndex, closeBraceIndex + 1);
	const updatedObject = injectPreprocessEntry(objectSource, pluginKeys);
	content = content.slice(0, openBraceIndex) + updatedObject + content.slice(closeBraceIndex + 1);
	content = insertImportLine(content, lapikitImport);

	await fs.writeFile(svelteConfigFile, content);
	terminal('success', `lapikitPreprocess added to ${svelteConfigFile}`);
}

export async function findViteConfigFile(projectPath) {
	for (const ext of ['ts', 'js', 'mjs', 'cjs']) {
		const file = path.join(projectPath, `vite.config.${ext}`);
		try {
			await fs.access(file);
			return file;
		} catch {
			// lapikit other step
		}
	}
	return null;
}

function findSveltekitPluginCall(content) {
	const match = content.match(/sveltekit\s*\(\s*\{/);
	if (!match) return null;

	const openBraceIndex = match.index + match[0].length - 1;
	const closeBraceIndex = findMatchingDelimiter(content, openBraceIndex, '{', '}');
	if (closeBraceIndex === -1) return null;

	return { openBraceIndex, closeBraceIndex };
}

export async function addLiliPreprocessToViteConfig(viteConfigFile, pluginKeys = []) {
	let content = await fs.readFile(viteConfigFile, 'utf-8');
	const lapikitImport = `import { lapikitPreprocess } from 'lapikit/preprocess';`;

	if (content.includes(`from 'lapikit/preprocess'`)) {
		const updated = mergeExistingPreprocessCall(content, pluginKeys);
		if (!updated) {
			terminal('warn', `lapikitPreprocess already imported in ${viteConfigFile}`);
			return;
		}
		await fs.writeFile(viteConfigFile, updated);
		terminal('success', `lapikitPreprocess plugins updated in ${viteConfigFile}`);
		return;
	}

	const pluginCall = findSveltekitPluginCall(content);
	if (!pluginCall) {
		throw new Error(`Could not find a sveltekit({ ... }) plugin call in ${viteConfigFile}`);
	}

	const { openBraceIndex, closeBraceIndex } = pluginCall;
	const objectSource = content.slice(openBraceIndex, closeBraceIndex + 1);
	const updatedObject = injectPreprocessEntry(objectSource, pluginKeys);
	content = content.slice(0, openBraceIndex) + updatedObject + content.slice(closeBraceIndex + 1);
	content = insertImportLine(content, lapikitImport);

	await fs.writeFile(viteConfigFile, content);
	terminal('success', `lapikitPreprocess added to ${viteConfigFile}`);
}

// Since SvelteKit 2.62, Svelte/preprocess config can be passed directly to the
// sveltekit() vite plugin instead of svelte.config.js — when it is, svelte.config.js
// is ignored, so the vite.config plugin call takes priority when both exist.
export async function resolveSveltePreprocessTarget(projectPath) {
	const viteConfigFile = await findViteConfigFile(projectPath);
	if (viteConfigFile) {
		const content = await fs.readFile(viteConfigFile, 'utf-8');
		if (findSveltekitPluginCall(content)) {
			return { file: viteConfigFile, add: addLiliPreprocessToViteConfig };
		}
	}

	try {
		const svelteConfigFile = await findSvelteConfigFile(projectPath);
		return { file: svelteConfigFile, add: addLiliPreprocess };
	} catch {
		throw new Error(
			'No svelte.config file found, and no sveltekit({ ... }) plugin config found in vite.config.(js|ts) ' +
				"Add lapikitPreprocess() manually: import { lapikitPreprocess } from 'lapikit/preprocess'; " +
				'then add it to your preprocess array.'
		);
	}
}

export async function findEslintConfigFile(projectPath) {
	for (const ext of ['js', 'mjs', 'cjs', 'ts']) {
		const file = path.join(projectPath, `eslint.config.${ext}`);
		try {
			await fs.access(file);
			return file;
		} catch {
			// lapikit other step
		}
	}
	throw new Error('No eslint.config.js file found');
}

export async function addLapikitEslintConfig(eslintConfigFile) {
	let content = await fs.readFile(eslintConfigFile, 'utf-8');
	const lapikitImport = `import lapikitConfig from 'eslint-config-lapikit';`;

	if (content.includes(`from 'eslint-config-lapikit'`)) {
		terminal('warn', `eslint-config-lapikit already imported in ${eslintConfigFile}`);
		return;
	}

	content = insertImportLine(content, lapikitImport);

	// Matches `export default [...]` as well as wrapped forms like
	// `export default defineConfig([...])`, `export default defineConfig(a, b)`
	// (rest-args form, no array) and member-expression wrappers like
	// `export default ts.config(...)`.
	const exportArrayPattern = /export\s+default\s*(?:\[|[\w.]+\s*\()/;
	if (!exportArrayPattern.test(content)) {
		throw new Error(
			`Could not find "export default [...]" in ${eslintConfigFile}. Please add "...lapikitConfig" manually.`
		);
	}

	content = content.replace(exportArrayPattern, (m) => `${m}\n\t...lapikitConfig,`);

	await fs.writeFile(eslintConfigFile, content);
	terminal('success', `eslint-config-lapikit added to ${eslintConfigFile}`);
}
