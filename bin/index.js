#!/usr/bin/env node
import { ansi, terminal, createRL, toggle } from './helpers.js';
import { addLiliPreprocess, findSvelteConfigFile } from './hooks.js';

async function run() {
	const rl = createRL();

	console.log('  _                 _ _    _ _   ');
	console.log(' | |               (_) |  (_) |  ');
	console.log(' | |     __ _ _ __  _| | ___| |_ ');
	console.log(" | |    / _` | '_ \\| | |/ / | __|");
	console.log(' | |___| (_| | |_) | |   <| | |_ ');
	console.log(' |______\\__,_| .__/|_|_|\\_\\_|\\__|');
	console.log('             | |                 ');
	console.log('             |_|                 \n');

	terminal('none', `${ansi.bold.blue('Lapikit')} - Component Library for Svelte\n\n`);

	console.log(
		'This installer will guide you through the process of installing Lapikit on your Svelte project.\n'
	);

	console.log('List actions that will be done:');
	console.log(
		ansi.green('✓') + ' Add lili preprocess (named: preprocess) on your svelte.config.js file'
	);
	console.log(ansi.inverse.purple('Setup will take less than 5 seconds\n\n\n'));

	const confirm = await toggle(rl, 'Launch install Lapikit on your project?');
	if (!confirm) {
		terminal('warn', `installation canceled.`);
		process.exit(0);
	}

	try {
		const svelteConfigFile = await findSvelteConfigFile(process.cwd());
		await addLiliPreprocess(svelteConfigFile);
	} catch (error) {
		terminal('warn', `Warning: Could not update svelte.config file: ${error.message}`);
	}
}

run()
	.then(() => {
		terminal('none', `\n\n\n\nWebsite: https://lapikit.dev`);
		terminal('none', `Github: https://github.com/lapikit/lapikit`);
		terminal('none', `Support the developement: https://buymeacoffee.com/nycolaide`);
		process.exit(0);
	})
	.catch((error) => {
		terminal('error', `Error: ${error}`);
		process.exit(1);
	});
