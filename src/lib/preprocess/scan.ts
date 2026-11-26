import MagicString from 'magic-string';
import type { ComponentInfo, KitComponentScan } from '../@types/index.js';
import { rewriteDirectives } from './directives.js';

export const scanKitTags = (
	content: string,
	componentInfo: Map<string, ComponentInfo>
): KitComponentScan => {
	const importedComponents = new Map<string, string>();
	const magic = new MagicString(content);
	let changed = false;
	let index = 0;
	let nextBrace = -1;
	const length = content.length;

	while (index < length) {
		const nextLt = content.indexOf('<', index);
		if (nextLt === -1) break;

		if (nextBrace !== Infinity && nextBrace < index) {
			const found = content.indexOf('{', index);
			nextBrace = found === -1 ? Infinity : found;
		}

		if (nextBrace < nextLt) {
			const expressionEnd = findClosing(content, nextBrace + 1, '}');
			if (expressionEnd === -1) break;

			index = expressionEnd + 1;
			continue;
		}

		if (content.startsWith('<!--', nextLt)) {
			const commentEnd = content.indexOf('-->', nextLt + 4);
			if (commentEnd === -1) break;

			index = commentEnd + 3;
			continue;
		}

		const ch = content[nextLt + 1];
		const isClosing = ch === '/';

		if (content.startsWith('<script', nextLt) || content.startsWith('<style', nextLt)) {
			const tagName = content.startsWith('<script', nextLt) ? 'script' : 'style';
			const nameEnd = nextLt + tagName.length + 1;
			const afterName = content[nameEnd];
			if (afterName && !/[\s>/]/.test(afterName)) {
				index = nextLt + 1;
				continue;
			}

			const openEnd = findClosing(content, nameEnd, '>');
			if (openEnd === -1) break;

			const closeTag = `</${tagName}>`;
			const closeStart = content.indexOf(closeTag, openEnd + 1);
			if (closeStart === -1) break;

			index = closeStart + closeTag.length;
			continue;
		}

		const isKitTag =
			(!isClosing && content.startsWith('<kit:', nextLt)) ||
			(isClosing && content.startsWith('</kit:', nextLt));

		if (!isKitTag) {
			index = nextLt + 1;
			continue;
		}

		const prefixLength = isClosing ? 6 : 5;
		const nameStart = nextLt + prefixLength;
		let nameEnd = nameStart;
		while (nameEnd < length) {
			const c = content[nameEnd];
			if (c === '>' || c === '/' || c === ' ' || c === '\n' || c === '\t' || c === '\r') {
				break;
			}
			nameEnd++;
		}

		const shortName = content.slice(nameStart, nameEnd);
		if (!shortName) {
			index = nextLt + 1;
			continue;
		}

		const info = componentInfo.get(shortName);
		const isKnown = info !== undefined;
		if (isClosing) {
			const tagEnd = content.indexOf('>', nameEnd);
			if (tagEnd === -1) break;

			if (isKnown) {
				importedComponents.set(info!.name, info!.ref);
				magic.overwrite(nextLt, tagEnd + 1, `</${info!.name}>`);
				changed = true;
			}

			index = tagEnd + 1;
			continue;
		}

		const tagEnd = findClosing(content, nameEnd, '>');
		if (tagEnd === -1) break;

		if (isKnown) {
			importedComponents.set(info!.name, info!.ref);
			magic.overwrite(nextLt, nameEnd, `<${info!.name}`);
			// class: / style: are refused by Svelte on a component: they become s-class_ / s-style_ props
			const attributes = content.slice(nameEnd, tagEnd + 1);
			const rewritten = rewriteDirectives(attributes);
			if (rewritten !== attributes) magic.overwrite(nameEnd, tagEnd + 1, rewritten);
			changed = true;
		}

		index = tagEnd + 1;
	}

	return {
		code: changed ? magic.toString() : content,
		changed,
		magic,
		importedComponents
	};
};

const findClosing = (content: string, start: number, closing: '>' | '}'): number => {
	let inSingle = false;
	let inDouble = false;
	let inTemplate = false;
	let braceDepth = 0;

	for (let i = start; i < content.length; i++) {
		const ch = content[i];
		const prev = i > 0 ? content[i - 1] : '';

		if (inSingle) {
			if (ch === "'" && prev !== '\\') inSingle = false;
			continue;
		}

		if (inDouble) {
			if (ch === '"' && prev !== '\\') inDouble = false;
			continue;
		}

		if (inTemplate) {
			if (ch === '`' && prev !== '\\') inTemplate = false;
			continue;
		}

		if (ch === "'") {
			inSingle = true;
			continue;
		}

		if (ch === '"') {
			inDouble = true;
			continue;
		}

		if (ch === '`') {
			inTemplate = true;
			continue;
		}

		if (braceDepth === 0 && ch === closing) {
			return i;
		}

		if (ch === '{') {
			braceDepth++;
			continue;
		}

		if (ch === '}' && braceDepth > 0) {
			braceDepth--;
			continue;
		}
	}

	return -1;
};
