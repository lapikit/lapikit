#!/usr/bin/env node
import { ansi, terminal, createRL, toggle, select, multiselect } from './helpers.js';
import {
	resolveSveltePreprocessTarget,
	installDependency,
	findEslintConfigFile,
	addLapikitEslintConfig
} from './hooks.js';

const ADDONS = [{ title: '@lapikit/repl', value: '@lapikit/repl' }];
const PKG_MANAGER = [
	{ title: 'npm', value: 'npm' },
	{ title: 'yarn', value: 'yarn' },
	{ title: 'pnpm', value: 'pnpm' },
	{ title: 'bun', value: 'bun' }
];

async function run() {
	const rl = createRL();

	console.log(ansi.color.blue(' ██╗      █████╗ ██████╗ ██╗██╗  ██╗██╗████████╗'));
	console.log(ansi.color.blue(' ██║     ██╔══██╗██╔══██╗██║██║ ██╔╝██║╚══██╔══╝'));
	console.log(ansi.color.blue(' ██║     ███████║██████╔╝██║█████╔╝ ██║   ██║   '));
	console.log(ansi.color.blue(' ██║     ██╔══██║██╔═══╝ ██║██╔═██╗ ██║   ██║   '));
	console.log(ansi.color.blue(' ██████╗ ██║  ██║██║     ██║██║  ██╗██║   ██║   '));
	console.log(ansi.color.blue(' ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝   ╚═╝   '));

	terminal('none', `${ansi.bold.blue('Lapikit')} - Components Library for Svelte\n\n`);

	const config = {
		installEslintConfig: false,
		addons: []
	};

	const confirm = await toggle(rl, 'Launch install Lapikit on your project?');
	if (!confirm) {
		terminal('warn', `installation canceled.`);
		process.exit(0);
	}

	config.installEslintConfig = await toggle(rl, 'Install eslint-config-lapikit?');
	config.pkgManager = await select(rl, 'Select package manager:', PKG_MANAGER);
	config.addons = await multiselect(rl, 'Select addons to install:', ADDONS);

	console.log('\n');
	terminal('info', 'Configuration summary:');
	console.log(`  - Install eslint-config-lapikit: ${config.installEslintConfig ? 'yes' : 'no'}`);
	console.log(`  - Package manager: ${config.pkgManager}`);
	console.log(`  - Addons: ${config.addons.length ? config.addons.join(', ') : 'none'}`);
	console.log('\n');

	await runSteps(config, process.cwd());

	// TODO: use `config.addons` to launch addons installation processes
}

function buildSteps(config, projectPath) {
	const steps = [
		{
			label: 'Add lapikitPreprocess to your project',
			run: async () => {
				const target = await resolveSveltePreprocessTarget(projectPath);
				await target.add(target.file);
			}
		}
	];

	if (config.installEslintConfig) {
		steps.push({
			label: `Install eslint-config-lapikit (${config.pkgManager})`,
			run: () => installDependency(config.pkgManager, 'eslint-config-lapikit', projectPath)
		});
		steps.push({
			label: 'Add eslint-config-lapikit to eslint.config',
			run: async () => {
				const eslintConfigFile = await findEslintConfigFile(projectPath);
				await addLapikitEslintConfig(eslintConfigFile);
			}
		});
	}

	return steps;
}

async function runSteps(config, projectPath) {
	const steps = buildSteps(config, projectPath);
	const results = [];

	for (let i = 0; i < steps.length; i++) {
		const step = steps[i];
		terminal('info', `${ansi.bold.blue(`[${i + 1}/${steps.length}]`)} ${step.label}`);

		try {
			await step.run();
			results.push({ label: step.label, ok: true });
		} catch (error) {
			terminal('warn', `Warning: ${error.message}`);
			results.push({ label: step.label, ok: false, error: error.message });
		}
	}

	console.log('\n');
	terminal('info', 'Installation summary:');
	for (const result of results) {
		const icon = result.ok ? ansi.color.green('✓') : ansi.color.red('✗');
		console.log(`  ${icon} ${result.label}`);
	}
	console.log('\n');

	return results;
}

run()
	.then(() => {
		terminal('none', `\n\nThank's for installing Lapikit!\n`);
		terminal('none', `Website: https://lapikit.dev`);
		terminal('none', `Github: https://github.com/lapikit/lapikit`);
		terminal('none', `Support the developement: https://buymeacoffee.com/nycolaide`);
		process.exit(0);
	})
	.catch((error) => {
		terminal('error', `Error: ${error}`);
		process.exit(1);
	});
