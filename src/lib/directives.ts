/**
 * Svelte refuses the class: and style: directives on a component. On a <kit:...> tag, Lili turns them
 * into the s-class_ / s-style_ props the components already handle:
 *   class:active          -> s-class_active={active}
 *   class:gap={4}         -> s-class_gap={4}         (the component gives the class gap-4)
 *   style:opacity={0}     -> s-style_opacity={0}
 *   style:color="red"     -> s-style_color="red"
 * A directive with a modifier (style:color|important) is left as it is: Svelte reports it.
 */

const identifier = /^[A-Za-z_$][\w$]*$/;
const nameEnd = /[\s=/>]/;

/** End index (exclusive) of the string starting at `start` (a quote or a backtick) */
function skipString(source: string, start: number): number {
	const quote = source[start];
	let i = start + 1;

	while (i < source.length) {
		const ch = source[i];
		if (ch === '\\') {
			i += 2;
			continue;
		}
		if (ch === quote) return i + 1;
		// ${ ... } inside a template literal can hold braces and strings
		if (quote === '`' && ch === '$' && source[i + 1] === '{') {
			i = skipBraces(source, i + 1);
			continue;
		}
		i++;
	}
	return source.length;
}

/** End index (exclusive) of the {...} expression starting at `start`, nested braces and strings included */
function skipBraces(source: string, start: number): number {
	let depth = 0;
	let i = start;

	while (i < source.length) {
		const ch = source[i];
		if (ch === '"' || ch === "'" || ch === '`') {
			i = skipString(source, i);
			continue;
		}
		if (ch === '{') depth++;
		else if (ch === '}') {
			depth--;
			if (depth === 0) return i + 1;
		}
		i++;
	}
	return source.length;
}

/** End index (exclusive) of an attribute value starting at `start` ({expr}, "text", 'text' or bare) */
function skipValue(source: string, start: number): number {
	const ch = source[start];
	if (ch === '{') return skipBraces(source, start);
	if (ch === '"' || ch === "'") return skipString(source, start);

	let i = start;
	while (i < source.length && !/[\s/>]/.test(source[i])) i++;
	return i;
}

/**
 * Rewrites the class: and style: directives of the attributes of a tag (everything after its name).
 * The values of the other attributes are skipped, so a "class:" inside a string or an expression is kept.
 */
export function rewriteDirectives(attributes: string): string {
	let output = '';
	let i = 0;

	while (i < attributes.length) {
		const ch = attributes[i];

		// A value (string or expression) of another attribute: copied as it is
		if (ch === '"' || ch === "'") {
			const end = skipString(attributes, i);
			output += attributes.slice(i, end);
			i = end;
			continue;
		}
		if (ch === '{') {
			const end = skipBraces(attributes, i);
			output += attributes.slice(i, end);
			i = end;
			continue;
		}

		const startsAttribute = i === 0 || /\s/.test(attributes[i - 1]);
		const kind = attributes.startsWith('class:', i)
			? 'class'
			: attributes.startsWith('style:', i)
				? 'style'
				: undefined;

		if (!startsAttribute || !kind) {
			output += ch;
			i++;
			continue;
		}

		const nameStart = i + kind.length + 1;
		let end = nameStart;
		while (end < attributes.length && !nameEnd.test(attributes[end])) end++;
		const name = attributes.slice(nameStart, end);

		// No name, or a modifier: left to Svelte
		if (!name || name.includes('|')) {
			output += ch;
			i++;
			continue;
		}

		const prop = `s-${kind}_${name}`;

		if (attributes[end] === '=') {
			const valueEnd = skipValue(attributes, end + 1);
			output += `${prop}=${attributes.slice(end + 1, valueEnd)}`;
			i = valueEnd;
		} else if (identifier.test(name)) {
			// Shorthand: class:active uses the variable active
			output += `${prop}={${name}}`;
			i = end;
		} else {
			// A shorthand needs a variable name (class:my-class has none): left to Svelte
			output += attributes.slice(i, end);
			i = end;
		}
	}

	return output;
}
