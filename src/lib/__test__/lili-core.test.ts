import { describe, it, expect } from 'vitest';
import { componentName, liliCore } from '$lib/framework';
import { lapikitImportsLabsRef } from '$lib/constants';

describe('liliCore', () => {
	it('converts kit tags with multiline attributes and injects imports', () => {
		const preprocess = liliCore();
		const sheetName = componentName('sheet');
		const input = `<script>const ready = true;</script>\n\n<kit:sheet\n\tclass="gnome"\n\ton:click={() => a > b}\n/>`;

		const result = preprocess.markup({ content: input });

		expect(result?.code).toContain(`import { ${sheetName} } from '${lapikitImportsLabsRef}';`);
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
		expect(result?.code).toContain(`import { ${sheetName} } from '${lapikitImportsLabsRef}';`);
	});

	it('converts hyphenated component names to PascalCase', () => {
		expect(componentName('list-item')).toBe('KitListItem');
		expect(componentName('accordion-item')).toBe('KitAccordionItem');
		expect(componentName('aspect-ratio')).toBe('KitAspectRatio');
		expect(componentName('list')).toBe('KitList');
	});

	it('does nothing when kit tags exist only inside script or style', () => {
		const preprocess = liliCore();
		const input = `<script>\n\tconst template = '<kit:sheet />';\n</script>\n\n<style>\n\t.example::before { content: "<kit:sheet />"; }\n</style>`;

		const result = preprocess.markup({ content: input });

		expect(result).toBeUndefined();
	});
});
