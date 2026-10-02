import { describe, it, expect } from 'vitest';
import { collectDeclaredIdentifiers, componentName, liliCore } from '$lib/framework';
import { lapikitImportsLabsRef, lapikitImportsRef } from '$lib/constants';

const sheetImport = `import KitSheet from '${lapikitImportsLabsRef}/sheet/sheet.svelte';`;

describe('liliCore', () => {
	it('converts kit tags with multiline attributes and injects imports', () => {
		const preprocess = liliCore();
		const sheetName = componentName('sheet');
		const input = `<script>const ready = true;</script>\n\n<kit:sheet\n\tclass="gnome"\n\ton:click={() => a > b}\n/>`;

		const result = preprocess.markup({ content: input });

		expect(result?.code).toContain(sheetImport);
		expect(result?.code).toContain(`<${sheetName}`);
		expect(result?.code).toContain('class="gnome"');
		expect(result?.code).toContain('on:click={() => a > b}');
		expect(result?.code).not.toContain('<kit:sheet');
	});

	it('ignores kit tags inside script and style blocks', () => {
		const preprocess = liliCore();
		const sheetName = componentName('sheet');
		const input = `<script>\n\tconst template = '<kit:sheet />';\n</script>\n\n<style>\n\t.example::before { content: "<kit:sheet />"; }\n</style>\n\n<kit:sheet>content</kit:sheet>`;

		const result = preprocess.markup({ content: input });

		expect(result?.code).toContain("const template = '<kit:sheet />';");
		expect(result?.code).toContain('content: "<kit:sheet />";');
		expect(result?.code).toContain(`<${sheetName}>content</${sheetName}>`);
		expect(result?.code).toContain(sheetImport);
	});

	it('converts hyphenated component names to PascalCase', () => {
		expect(componentName('list-item')).toBe('KitListItem');
		expect(componentName('accordion-item')).toBe('KitAccordionItem');
		expect(componentName('aspect-ratio')).toBe('KitAspectRatio');
		expect(componentName('list')).toBe('KitList');
	});

	it('imports each component from its own file instead of the barrel', () => {
		const preprocess = liliCore();
		const input = `<script></script>\n<kit:list>\n\t<kit:list-item />\n\t<kit:list-item />\n</kit:list>`;

		const result = preprocess.markup({ content: input });
		const code = result?.code ?? '';

		expect(code).toContain(`import KitList from '${lapikitImportsRef}/list/list.svelte';`);
		expect(code).toContain(
			`import KitListItem from '${lapikitImportsRef}/list/modules/list-item.svelte';`
		);
		expect([...code.matchAll(/import KitListItem /g)]).toHaveLength(1);
		expect(code).not.toContain(`from '${lapikitImportsRef}';`);
		expect(code).not.toContain('KitList-item');
	});

	it('keeps named imports for plugin components', () => {
		const preprocess = liliCore({ plugins: ['repl'] });
		const input = `<script></script>\n<kit:repl />\n<kit:btn />`;

		const code = preprocess.markup({ content: input })?.code ?? '';

		expect(code).toContain("import { KitRepl } from '@lapikit/repl';");
		expect(code).toContain(`import KitBtn from '${lapikitImportsRef}/btn/btn.svelte';`);
	});

	it('does nothing when kit tags exist only inside script or style', () => {
		const preprocess = liliCore();
		const input = `<script>\n\tconst template = '<kit:sheet />';\n</script>\n\n<style>\n\t.example::before { content: "<kit:sheet />"; }\n</style>`;

		const result = preprocess.markup({ content: input });

		expect(result).toBeUndefined();
	});

	it('does not import a component the file already imports from the barrel', () => {
		const preprocess = liliCore();
		const input = `<script>\n\timport { KitBtn } from 'lapikit/components';\n</script>\n<kit:btn /><kit:chip />`;

		const code = preprocess.markup({ content: input })?.code ?? '';

		expect([...code.matchAll(/\bKitBtn\b(?= from| })/g)]).toHaveLength(1);
		expect(code).not.toContain('btn/btn.svelte');
		expect(code).toContain(`import KitChip from '${lapikitImportsRef}/chip/chip.svelte';`);
		expect(code).toContain('<KitBtn />');
	});

	it('does not import a component already declared in a module script', () => {
		const preprocess = liliCore();
		const input = `<script module>\n\timport KitBtn from 'lapikit/components/btn/btn.svelte';\n</script>\n<kit:btn />`;

		const result = preprocess.markup({ content: input });

		expect(result?.code).toContain('<KitBtn />');
		expect(result?.code).not.toContain('<script>');
	});

	it('detects declared identifiers in imports and declarations', () => {
		const declared = collectDeclaredIdentifiers(
			`<script lang="ts">
	import Def, { KitBtn, Other as KitChip, type KitIcon } from 'x';
	import * as KitList from 'y';
	const KitCard = 1;
	function KitAlert() {}
	// import KitModal from 'z';
	/* const KitDialog = 1; */
	const url = 'https://example.com'; let KitSpacer;
</script>`
		);

		for (const name of [
			'Def',
			'KitBtn',
			'KitChip',
			'KitIcon',
			'KitList',
			'KitCard',
			'KitAlert',
			'KitSpacer'
		]) {
			expect(declared.has(name)).toBe(true);
		}
		expect(declared.has('Other')).toBe(false);
		expect(declared.has('KitModal')).toBe(false);
		expect(declared.has('KitDialog')).toBe(false);
	});
});
