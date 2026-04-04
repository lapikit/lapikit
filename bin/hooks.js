#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { terminal } from './helpers.js';

export async function findSvelteConfigFile(projectPath) {
	for (const ext of ['js', 'ts']) {
		const file = path.join(projectPath, `svelte.config.${ext}`);
		try {
			await fs.access(file);
			return file;
		} catch {
			// lapikit other step
		}
	}
	throw new Error('No svelte.config.js or svelte.config.ts file found');
}

export async function addLiliPreprocess(svelteConfigFile) {
	let content = await fs.readFile(svelteConfigFile, 'utf-8');
	const lapikitImport = `import { lapikitPreprocess } from 'lapikit/labs/preprocess';`;

	if (content.includes(`from 'lapikit/labs/preprocess'`)) {
		terminal('info', `lapikitPreprocess already imported in ${svelteConfigFile}`);
		return;
	}

	const lines = content.split('\n');
	let importInsertIndex = 0;
	for (let i = 0; i < lines.length; i++) {
		if (lines[i].trim().startsWith('import ')) importInsertIndex = i + 1;
	}
	lines.splice(importInsertIndex, 0, lapikitImport);
	content = lines.join('\n');

	if (!content.match(/preprocess\s*:/)) {
		content = content.replace(
			/(const\s+\w+\s*=\s*\{|export\s+default\s*\{)/,
			(m) => `${m}\n\tpreprocess: [lapikitPreprocess()],`
		);
	} else if (content.match(/preprocess\s*:\s*\[/)) {
		content = content.replace(/preprocess\s*:\s*\[([\s\S]*?)\]/, (_, inner) => {
			const trimmed = inner.trim();
			if (!trimmed) return `preprocess: [lapikitPreprocess()]`;

			if (inner.includes('\n')) {
				const firstItemMatch = inner.match(/\n(\s*)\S/);
				const indent = firstItemMatch ? firstItemMatch[1] : '\t\t';
				const closingMatch = inner.match(/\n(\s*)$/);
				const closingIndent = closingMatch ? closingMatch[1] : '\t';
				const innerTrimmed = inner.trimEnd();
				const sep = innerTrimmed.endsWith(',') ? '' : ',';
				return `preprocess: [${innerTrimmed}${sep}\n${indent}lapikitPreprocess()\n${closingIndent}]`;
			} else {
				const sep = trimmed.endsWith(',') ? ' ' : ', ';
				return `preprocess: [${trimmed}${sep}lapikitPreprocess()]`;
			}
		});
	} else {
		content = content.replace(
			/preprocess\s*:\s*([^,\n\]{}]+)/,
			(_, val) => `preprocess: [${val.trim()}, lapikitPreprocess()]`
		);
	}

	await fs.writeFile(svelteConfigFile, content);
	terminal('info', `lapikitPreprocess added to ${svelteConfigFile}`);
}
