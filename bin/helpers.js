import readline from 'node:readline/promises';

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
	return readline.createInterface({ input: process.stdin, output: process.stdout });
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

export async function select(rl, message, choices) {
	console.log(`\n${message}`);
	choices.forEach((c, i) => console.log(`  ${i + 1}. ${c.title}`));

	while (true) {
		const answer = (await rl.question(`Choice (1): `)).trim();
		const index = answer === '' ? 0 : parseInt(answer, 10) - 1;
		if (index >= 0 && index < choices.length) return choices[index].value;
		terminal('warn', `Please enter a number between 1 and ${choices.length}`);
	}
}
