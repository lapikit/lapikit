#!/usr/bin/env node
import { ansi, terminal, createRL, toggle, select, multiselect } from './helpers.js';
import {
	resolveSveltePreprocessTarget,
	installDependency,
	findEslintConfigFile,
	addLapikitEslintConfig
} from './hooks.js';

const ADDONS = [{ title: '@lapikit/repl', value: '@lapikit/repl', key: 'repl' }];

const PKG_MANAGER = [
	{ title: 'npm', value: 'npm' },
	{ title: 'yarn', value: 'yarn' },
	{ title: 'pnpm', value: 'pnpm' },
	{ title: 'bun', value: 'bun' }
];

function buildSteps(config, projectPath) {
	const pluginKeys = config.addons
		.map((value) => ADDONS.find((addon) => addon.value === value)?.key)
		.filter(Boolean);

	const steps = [];

	steps.push({
		id: 'preprocess',
		label: 'Add lapikitPreprocess to your project',
		run: async () => {
			const target = await resolveSveltePreprocessTarget(projectPath);
			await target.add(target.file, pluginKeys);
		}
	});

	for (const addonValue of config.addons) {
		steps.push({
			id: `addon:${addonValue}`,
			label: `Install ${addonValue} (${config.pkgManager})`,
			run: () => installDependency(config.pkgManager, addonValue, projectPath)
		});
	}

	if (config.installEslintConfig) {
		steps.push({
			id: 'eslint-install',
			label: `Install eslint-config-lapikit (${config.pkgManager})`,
			run: () => installDependency(config.pkgManager, 'eslint-config-lapikit', projectPath)
		});
		steps.push({
			id: 'eslint-config',
			needs: 'eslint-install',
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
	const failed = new Set();

	for (let i = 0; i < steps.length; i++) {
		const step = steps[i];
		const tag = ansi.bold.blue(`[${i + 1}/${steps.length}]`);

		if (step.needs && failed.has(step.needs)) {
			results.push({ label: step.label, ok: false, skipped: true });
			terminal('warn', `${tag} ${step.label} - skipped (prerequisite failed)`);
			continue;
		}

		try {
			await step.run();
			results.push({ label: step.label, ok: true });
			terminal('success', `${tag} ${step.label}`);
		} catch (error) {
			if (step.id) failed.add(step.id);
			results.push({ label: step.label, ok: false, error: error.message });
			terminal('error', `${tag} ${step.label} - ${error.message}`);
		}
	}

	return results;
}

async function run() {
	const rl = createRL();
	const config = {
		installEslintConfig: false,
		addons: []
	};

	console.log(ansi.color.blue(' ██╗      █████╗ ██████╗ ██╗██╗  ██╗██╗████████╗'));
	console.log(ansi.color.blue(' ██║     ██╔══██╗██╔══██╗██║██║ ██╔╝██║╚══██╔══╝'));
	console.log(ansi.color.blue(' ██║     ███████║██████╔╝██║█████╔╝ ██║   ██║   '));
	console.log(ansi.color.blue(' ██║     ██╔══██║██╔═══╝ ██║██╔═██╗ ██║   ██║   '));
	console.log(ansi.color.blue(' ██████╗ ██║  ██║██║     ██║██║  ██╗██║   ██║   '));
	console.log(ansi.color.blue(' ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝   ╚═╝   '));

	terminal('none', `${ansi.bold.blue('Lapikit')} - Components Library for Svelte`);
	terminal('none', `Developed by ${ansi.bold.blue('Nycolaide')}`);
	terminal('none', `Documentation: https://lapikit.dev\n`);

	const confirm = await toggle(rl, 'Launch install Lapikit on your project?');
	if (!confirm) {
		terminal('warn', `installation canceled.`);
		process.exit(0);
	}

	config.installEslintConfig = await toggle(rl, 'Install eslint-config-lapikit?');
	config.pkgManager = await select(rl, 'Select package manager:', PKG_MANAGER);
	config.addons = await multiselect(rl, 'Select addons to install:', ADDONS);

	const results = await runSteps(config, process.cwd());
	rl.close();
	return results;
}

run()
	.then((results) => {
		process.exitCode = results?.some((r) => !r.ok) ? 1 : 0;
	})
	.catch((error) => {
		terminal('error', `Error: ${error}`);
		process.exitCode = 1;
	});
