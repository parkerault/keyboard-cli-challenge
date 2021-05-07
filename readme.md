# keyfun

<img src="./keyfun.jpg?raw=true" width="600">

## Install

```bash
$ npm install;
```

## CLI

```
	Usage: ./keyfun.js [SEQUENCE] [INPUT]
	Return a string transformed by the input sequence. If no input is provided, opens in interactive mode.

	Options
		-s --sequence: A list of commands; "H" for flip horizontal, "V" for flip vertical, or "S" + a number for shift.
		-r --reverse: Same as sequence, but run the commands in reverse.

	Examples
	  $ ./keyfun.js --sequence=HVS12 "the quick brown fox..."
		feh ksa6q 4g;j3 t;7111

		$ ./keyfun.js --reverse=HVS12 "feh ksa6q 4g;j3 t;7111"
		the quick brown fox...

		$ ./keyfun.js # open in interactive mode
```
