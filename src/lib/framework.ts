import type { ComponentInfo, LapikitPreprocessOptions } from './@types/index.js';
import { decodeSourceMap } from './escaping.js';
import {
	lapikitImportsRef,
	lapikitImportsLabsRef,
	lapikitComponentPaths,
	lapikitLabsComponentPaths,
	lapikitPlugins
} from './constants.js';

export function componentName(shortName: string): string {
	const pascal = shortName.replace(/(^|-)([a-z])/g, (_, __, letter) => letter.toUpperCase());
	return 'Kit' + pascal;
}

export function collectDeclaredIdentifiers(content: string): Set<string> {
	const declared = new Set<string>();
	const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/g;

	for (const [, rawScript] of content.matchAll(scriptRegex)) {
		const script = rawScript.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

		const importRegex = /\bimport\s+(?:type\s+)?([^'";]*?)\s+from\s*['"]/g;
		for (const [, clause] of script.matchAll(importRegex)) {
			const braces = clause.match(/\{([^}]*)\}/);
			if (braces) {
				for (const specifier of braces[1].split(',')) {
					const local = specifier
						.trim()
						.replace(/^type\s+/, '')
						.split(/\s+as\s+/)
						.pop();
					if (local) declared.add(local.trim());
				}
			}

			const outside = clause.replace(/\{[^}]*\}/, '');
			const namespace = outside.match(/\*\s*as\s+([\w$]+)/);
			if (namespace) declared.add(namespace[1]);

			const defaultImport = outside.match(/^\s*([\w$]+)/);
			if (defaultImport) declared.add(defaultImport[1]);
		}

		const declarationRegex = /\b(?:const|let|var|function|class)\s+([\w$]+)/g;
		for (const [, name] of script.matchAll(declarationRegex)) {
			declared.add(name);
		}
	}

	return declared;
}

export function liliCore(options?: LapikitPreprocessOptions) {
	return {
		markup({ content }: { content: string; filename?: string }) {
			if (!content.includes('<kit:')) return;

			const componentInfo = new Map<string, ComponentInfo>();

			for (const [shortName, path] of Object.entries(lapikitComponentPaths)) {
				componentInfo.set(shortName, {
					name: componentName(shortName),
					ref: `${lapikitImportsRef}/${path}`,
					direct: true
				});
			}

			for (const [shortName, path] of Object.entries(lapikitLabsComponentPaths)) {
				componentInfo.set(shortName, {
					name: componentName(shortName),
					ref: `${lapikitImportsLabsRef}/${path}`,
					direct: true
				});
			}

			// plugins
			if (options?.plugins) {
				options.plugins.forEach((pluginKey) => {
					const plugin = lapikitPlugins[pluginKey as keyof typeof lapikitPlugins];
					if (plugin) {
						plugin.components.forEach((comp) => {
							componentInfo.set(comp, { name: componentName(comp), ref: plugin.ref });
						});
					}
				});
			}

			const scanResult = decodeSourceMap(content, componentInfo);

			if (!scanResult.changed) return;

			let processedContent = scanResult.code;
			const importedComponents = scanResult.importedComponents;

			// components already declared by the user (manual import, alias...) are not imported again
			const declared = collectDeclaredIdentifiers(content);
			declared.forEach((name) => importedComponents.delete(name));

			if (importedComponents.size > 0) {
				const directNames = new Set<string>();
				componentInfo.forEach((info) => {
					if (info.direct) directNames.add(info.name);
				});

				const directImports: string[] = [];
				const importsByRef = new Map<string, string[]>();
				importedComponents.forEach((ref, component) => {
					if (directNames.has(component)) {
						directImports.push(`\n\timport ${component} from '${ref}';`);
						return;
					}
					if (!importsByRef.has(ref)) {
						importsByRef.set(ref, []);
					}
					importsByRef.get(ref)!.push(component);
				});

				const importLines =
					directImports.join('') +
					Array.from(importsByRef.entries())
						.map(([ref, components]) => {
							const imports = components.join(', ');
							return `\n\timport { ${imports} } from '${ref}';`;
						})
						.join('');

				const scriptRegex = /<script(?![^>]*\bmodule\b)([^>]*)>/;
				const scriptMatch = processedContent.match(scriptRegex);

				if (scriptMatch && scriptMatch.index !== undefined) {
					const insertPos = scriptMatch.index + scriptMatch[0].length;
					processedContent =
						processedContent.slice(0, insertPos) + importLines + processedContent.slice(insertPos);
				} else {
					const moduleScriptMatch = processedContent.match(/<script[^>]*\bmodule\b[^>]*>/);

					if (moduleScriptMatch && moduleScriptMatch.index !== undefined) {
						const moduleScriptEnd =
							processedContent.indexOf('</script>', moduleScriptMatch.index) + '</script>'.length;
						processedContent =
							processedContent.slice(0, moduleScriptEnd) +
							`\n\n<script>${importLines}\n</script>` +
							processedContent.slice(moduleScriptEnd);
					} else {
						processedContent = `<script>${importLines}\n</script>\n\n` + processedContent;
					}
				}
			}

			return {
				code: processedContent
			};
		}
	};
}
