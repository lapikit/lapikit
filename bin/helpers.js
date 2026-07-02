import readline from 'node:readline/promises';
import { emitKeypressEvents, moveCursor, cursorTo, clearLine } from 'node:readline';

const color = {
	red: (text) => `\x1b[31m${text}\x1b[0m`,
	green: (text) => `\x1b[32m${text}\x1b[0m`,
	yellow: (text) => `\x1b[33m${text}\x1b[0m`,
	blue: (text) => `\x1b[34m${text}\x1b[0m`,
	purple: (text) => `\x1b[35m${text}\x1b[0m`,
	cyan: (text) => `\x1b[36m${text}\x1b[0m`
};

const variant = {
	bold: (text) => `\x1b[1m${text}\x1b[0m`,
	underline: (text) => `\x1b[4m${text}\x1b[0m`,
	inverse: (text) => `\x1b[7m${text}\x1b[0m`
};

const bold = {
	red: (text) => `\x1b[1m\x1b[31m${text}\x1b[0m`,
	green: (text) => `\x1b[1m\x1b[32m${text}\x1b[0m`,
	yellow: (text) => `\x1b[1m\x1b[33m${text}\x1b[0m`,
	blue: (text) => `\x1b[1m\x1b[34m${text}\x1b[0m`,
	purple: (text) => `\x1b[1m\x1b[35m${text}\x1b[0m`,
	cyan: (text) => `\x1b[1m\x1b[36m${text}\x1b[0m`
};

const inverse = {
	red: (text) => `\x1b[7m\x1b[31m${text}\x1b[0m`,
	green: (text) => `\x1b[7m\x1b[32m${text}\x1b[0m`,
	yellow: (text) => `\x1b[7m\x1b[33m${text}\x1b[0m`,
	blue: (text) => `\x1b[7m\x1b[34m${text}\x1b[0m`,
	purple: (text) => `\x1b[7m\x1b[35m${text}\x1b[0m`,
	cyan: (text) => `\x1b[7m\x1b[36m${text}\x1b[0m`
};

const underline = {
	red: (text) => `\x1b[4m\x1b[31m${text}\x1b[0m`,
	green: (text) => `\x1b[4m\x1b[32m${text}\x1b[0m`,
	yellow: (text) => `\x1b[4m\x1b[33m${text}\x1b[0m`,
	blue: (text) => `\x1b[4m\x1b[34m${text}\x1b[0m`,
	purple: (text) => `\x1b[4m\x1b[35m${text}\x1b[0m`,
	cyan: (text) => `\x1b[4m\x1b[36m${text}\x1b[0m`
};

export const ansi = {
	color,
	variant,
	bold,
	inverse,
	underline
};

export const terminal = (type = 'info', msg) => {
	const name = ansi.color.cyan('lapikit');

	if (type === 'error') console.error(name, ansi.bold.red('[error]'), msg);
	else if (type === 'warn') console.warn(name, ansi.bold.yellow('[warn]'), msg);
	else if (type === 'success') console.warn(name, ansi.bold.green('[success]'), msg);
	else if (type === 'none') console.log(msg);
	else console.log(name, ansi.bold.blue('[info]'), msg);
};

export function createRL() {
	const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

	rl.on('SIGINT', () => {
		if (process.stdin.isTTY) process.stdin.setRawMode(false);
		console.log('\n');
		terminal('warn', 'installation canceled.');
		process.exit(0);
	});

	return rl;
}

export async function toggle(rl, message, initial = true) {
	const hint = initial ? 'Y/n' : 'y/N';
	const answer = (await rl.question(`${message} (${hint}): `)).trim().toLowerCase();
	if (answer === '') return initial;
	return answer === 'y';
}

export async function text(rl, message, initial = '', validate) {
	while (true) {
		const hint = initial ? ` (${initial})` : '';
		const answer = (await rl.question(`${message}${hint}: `)).trim();
		const value = answer === '' ? initial : answer;
		if (validate) {
			const result = validate(value);
			if (result !== true) {
				terminal('warn', result);
				continue;
			}
		}
		return value;
	}
}

async function selectFallback(rl, message, choices) {
	console.log(`\n${message}`);
	choices.forEach((c, i) => console.log(`  ${i + 1}. ${c.title}`));

	while (true) {
		const answer = (await rl.question(`Choice (1): `)).trim();
		const index = answer === '' ? 0 : parseInt(answer, 10) - 1;
		if (index >= 0 && index < choices.length) return choices[index].value;
		terminal('warn', `Please enter a number between 1 and ${choices.length}`);
	}
}

async function multiselectFallback(rl, message, choices) {
	console.log(`\n${message}`);
	choices.forEach((c, i) => console.log(`  ${i + 1}. ${c.title}`));
	console.log(`  (enter numbers separated by commas, e.g. 1,2 - leave empty for none)`);

	while (true) {
		const answer = (await rl.question(`Choice: `)).trim();
		if (answer === '') return [];

		const indexes = answer.split(',').map((part) => parseInt(part.trim(), 10) - 1);
		const valid = indexes.every((index) => index >= 0 && index < choices.length);
		if (valid) return [...new Set(indexes)].map((index) => choices[index].value);

		terminal('warn', `Please enter numbers between 1 and ${choices.length}, separated by commas`);
	}
}

async function interactiveList(rl, message, hint, choices, renderLine, onKey) {
	console.log(`\n${message}`);
	console.log(ansi.color.cyan(`  (${hint})`));
	choices.forEach((_, i) => console.log(renderLine(i)));

	const { stdin } = process;
	rl.pause();
	const wasRaw = stdin.isRaw;
	emitKeypressEvents(stdin, rl);
	stdin.setRawMode(true);
	stdin.resume();

	return new Promise((resolve) => {
		const redrawLine = (index) => {
			const rowsUp = choices.length - index;
			moveCursor(process.stdout, 0, -rowsUp);
			cursorTo(process.stdout, 0);
			clearLine(process.stdout, 1);
			process.stdout.write(renderLine(index));
			moveCursor(process.stdout, 0, rowsUp);
			cursorTo(process.stdout, 0);
		};

		const cleanup = () => {
			stdin.removeListener('keypress', onKeypress);
			stdin.setRawMode(wasRaw);
			rl.resume();
		};

		const onKeypress = (str, key) => {
			onKey(key, redrawLine, (value) => {
				cleanup();
				console.log('');
				resolve(value);
			});
		};

		stdin.on('keypress', onKeypress);
	});
}

export async function select(rl, message, choices) {
	const { stdin } = process;
	if (!stdin.isTTY || typeof stdin.setRawMode !== 'function') {
		return selectFallback(rl, message, choices);
	}

	let cursor = 0;
	const renderLine = (index) => {
		const radio = index === cursor ? ansi.color.green('(●)') : '( )';
		const pointer = index === cursor ? ansi.color.cyan('❯') : ' ';
		return `${pointer} ${radio} ${choices[index].title}`;
	};

	return interactiveList(
		rl,
		message,
		'↑/↓ move, enter to confirm',
		choices,
		renderLine,
		(key, redrawLine, resolve) => {
			const previousCursor = cursor;
			if (key.name === 'up') {
				cursor = (cursor - 1 + choices.length) % choices.length;
				redrawLine(previousCursor);
				redrawLine(cursor);
			} else if (key.name === 'down') {
				cursor = (cursor + 1) % choices.length;
				redrawLine(previousCursor);
				redrawLine(cursor);
			} else if (key.name === 'return') {
				resolve(choices[cursor].value);
			}
		}
	);
}

export async function multiselect(rl, message, choices) {
	const { stdin } = process;
	if (!stdin.isTTY || typeof stdin.setRawMode !== 'function') {
		return multiselectFallback(rl, message, choices);
	}

	const selected = new Set();
	let cursor = 0;
	const renderLine = (index) => {
		const checked = selected.has(index) ? ansi.color.green('[x]') : '[ ]';
		const pointer = index === cursor ? ansi.color.cyan('❯') : ' ';
		return `${pointer} ${checked} ${choices[index].title}`;
	};

	return interactiveList(
		rl,
		message,
		'↑/↓ move, space to select, enter to confirm',
		choices,
		renderLine,
		(key, redrawLine, resolve) => {
			const previousCursor = cursor;
			if (key.name === 'up') {
				cursor = (cursor - 1 + choices.length) % choices.length;
				redrawLine(previousCursor);
				redrawLine(cursor);
			} else if (key.name === 'down') {
				cursor = (cursor + 1) % choices.length;
				redrawLine(previousCursor);
				redrawLine(cursor);
			} else if (key.name === 'space') {
				if (selected.has(cursor)) selected.delete(cursor);
				else selected.add(cursor);
				redrawLine(cursor);
			} else if (key.name === 'return') {
				resolve([...selected].sort((a, b) => a - b).map((index) => choices[index].value));
			}
		}
	);
}
