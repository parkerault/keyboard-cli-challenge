#!/usr/bin/env node
"use strict";
const React = require("react");
const importJsx = require("import-jsx");
const { render } = require("ink");
const meow = require("meow");

const ui = importJsx("./ui");
const { handleCliInput, nonNullish } = require("./lib");

const cli = meow(
	`
	Usage: keyfun [SEQUENCE] [INPUT]
	Return a string transformed by the input sequence. If no input is provided, opens in interactive mode.

	Options
		-s --sequence: A list of commands; "H" for flip horizontal, "V" for flip vertical, or "S" + a number for shift.
		-r --reverse: Same as sequence, but run the commands in reverse.

	Examples
	  $ keyfun --sequence=HVS12 "the quick brown fox..."
		feh ksa6q 4g;j3 t;7111

		$ keyfun --reverse=HVS12 "feh ksa6q 4g;j3 t;7111"
		the quick brown fox...

		$keyfun # open in interactive mode
`,
	{
		flags: {
			sequence: {
				type: "string",
				alias: "s",
			},
			reverse: {
				type: "string",
				alias: "r",
			},
		},
	}
);

if (nonNullish(cli.flags.sequence) || nonNullish(cli.flags.reverse)) {
	if (cli.input.length !== 0) {
		try {
			const output = `${handleCliInput(cli.flags, cli.input[0])}\n`;
			process.stdout.write(output);
			process.exit(0);
		} catch (e) {
			process.stderr.write(`Process failed with:\n    ${e.stack}\n`);
			process.exit(-1);
		}
	} else {
		cli.showHelp();
	}
} else {
	render(React.createElement(ui));
}
