/**
 * matches null|undefined, but allows other falsey values
 * @param {*} x
 * @returns {boolean}
 */
function nonNullish(x) {
	return x != null;
}

/**
 * @typedef {(i:number)=>void} LoopFn
 * @param {number} x
 * @returns {(fn:LoopFn)=>void}
 */
function doTimes(x) {
	return (fn) => Array.from({ length: x }).forEach((__, i) => fn(i));
}

/**
 *
 * @param {number} aIdx
 * @param {number} bIdx
 * @param {any[]} listA
 * @param {any[]} listB
 */
function unsafeSwap(aIdx, bIdx, listA, listB = listA) {
	[listA[aIdx], listB[bIdx]] = [listB[bIdx], listA[aIdx]];
}

/**
 *
 * @param {number} a
 * @param {number} b
 * @returns
 */
function trueMod(a, b) {
	return ((a % b) + b) % b;
}
/**
 * @typedef {string[][]} Layout
 * @typedef {{rowLength:number,colLength:number,layout:Layout}} Props
 */

/**
 * @returns {Layout}
 */
const createLayout = () => [
	["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
	["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
	["a", "s", "d", "f", "g", "h", "j", "k", "l", ";"],
	["z", "x", "c", "v", "b", "n", "m", ".", ",", "/"],
];

/**
 * @typedef {{rowLength:number,colLength:number}} Dimensions
 * @param {Layout} layout
 * @returns {Dimensions}
 */
const getDimensions = (layout) => ({
	rowLength: nonNullish(layout) ? layout.length : 0,
	colLength: nonNullish(layout) && nonNullish(layout[0]) ? layout[0].length : 0,
});

/**
 * @param {Layout} layout
 * @returns {Layout}
 */
const flipH = (layout) => {
	const newLayout = [...layout];
	const { rowLength, colLength } = getDimensions(layout);
	doTimes(rowLength)((rowIdx) => {
		newLayout[rowIdx] = [...layout[rowIdx]];
		doTimes(colLength / 2)((leftIdx) => {
			const rightIdx = colLength - 1 - leftIdx;
			unsafeSwap(leftIdx, rightIdx, newLayout[rowIdx]);
		});
	});
	return newLayout;
};

/**
 * @param {Layout} layout
 * @returns {Layout}
 */
const flipV = (layout) => {
	const newCharacters = [...layout];
	const { rowLength, colLength } = getDimensions(layout);
	doTimes(rowLength / 2)((rowTopIdx) => {
		const rowBottomIdx = rowLength - rowTopIdx - 1;
		newCharacters[rowTopIdx] = [...layout[rowTopIdx]];
		newCharacters[rowBottomIdx] = [...layout[rowBottomIdx]];
		doTimes(colLength)((colIdx) => {
			unsafeSwap(
				colIdx,
				colIdx,
				newCharacters[rowTopIdx],
				newCharacters[rowBottomIdx]
			);
		});
	});
	return newCharacters;
};

/**
 * @param {Layout} layout
 * @param {string} count
 * @returns {Layout}
 */
const shift = (layout, count) => {
	const inputValue = parseInt(count);
	const { rowLength, colLength } = getDimensions(layout);
	const steps = trueMod(inputValue, colLength);
	if (isNaN(steps)) return layout;
	let newCharacters = [...layout];
	doTimes(rowLength)((rowIdx) => {
		newCharacters[rowIdx] = [
			...layout[rowIdx].slice(steps, colLength),
			...layout[rowIdx].slice(0, steps),
		];
	});
	return newCharacters;
};

/**
 * @param {Layout} layout
 * @param {string} input
 */
const mapKey = (layout, input) => {
	const newLayout = createLayout();
	let value = input;
	for (let rowIdx = 0; rowIdx < newLayout.length; rowIdx++) {
		const colIdx = newLayout[rowIdx].indexOf(input);
		if (colIdx !== -1) {
			value = layout[rowIdx][colIdx];
			break;
		}
	}
	return value;
};

/**
 * @typedef {{command:("H"|"V")}} FlipCommand
 * @typedef {{command:"S",steps:string}} ShiftCommand
 * @typedef {(FlipCommand|ShiftCommand)} Command
 */

/**
 * @param {{sequence?:string, reverse?: string}} flags
 * @param {string} input
 * @returns {string}
 */
const handleCliInput = (flags, input) => {
	const { sequence, reverse } = flags;
	let commandsGroup;
	if (nonNullish(sequence) && nonNullish(reverse)) {
		commandsGroup = [
			parseSequence(flags.sequence),
			parseSequence(flags.reverse, { reverse: true }),
		];
	} else if (nonNullish(sequence)) {
		commandsGroup = [parseSequence(flags.sequence)];
	} else {
		commandsGroup = [parseSequence(flags.reverse, { reverse: true })];
	}
	const layout = applyCommandsGroup(commandsGroup, createLayout());
	const result = [...input]
		.map((character) => mapKey(layout, character))
		.join("");
	return result;
};

/**
 * @param {string} sequence
 * @param {{reverse:boolean}} [opts]
 * @returns {Command[]}
 */
const parseSequence = (sequence, opts = { reverse: false }) => {
	/**
	 * @type {Command[]}
	 */
	let commands = [];
	const isReverse = opts.reverse;
	const insert = isReverse
		? Array.prototype.unshift.bind(commands)
		: Array.prototype.push.bind(commands);
	let i = 0;
	while (i < sequence.length) {
		const value = sequence[i];
		if (value === "H") {
			insert({ command: "H" });
			i++;
		} else if (value === "V") {
			insert({
				command: "V",
			});
			i++;
		} else if (value === "S") {
			i++;
			let steps = "";
			while (i < sequence.length && nonNullish(sequence[i].match(/[-|\d]/))) {
				steps += sequence[i];
				i++;
			}
			if (isReverse) {
				steps =
					nonNullish(steps.match("-")) ? steps.replace("-", "") : "-" + steps;
			}
			if (steps.length > 0) {
				insert({ command: "S", steps });
			}
		}
	}
	return commands;
};

/**
 * @param {Command[][]} commandsGroup
 * @param {Layout} layout
 * @returns {Layout}
 */
const applyCommandsGroup = (commandsGroup, layout) => {
	let nextLayout = [...layout];
	commandsGroup.forEach((commands) => {
		commands.forEach((command) => {
			switch (command.command) {
				case "H":
					nextLayout = flipH(nextLayout);
					break;
				case "V":
					nextLayout = flipV(nextLayout);
					break;
				case "S":
					nextLayout = shift(nextLayout, command.steps);
					break;
				default:
					break;
			}
		});
	});
	return nextLayout;
};

module.exports = {
	nonNullish,
	flipH,
	flipV,
	shift,
	keyboardLayout: createLayout,
	mapKey,
	handleCliInput,
};
