/**
 * @param {number} x
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
 * @typedef {import("./Entities/Keyboard").KeyboardState} KS
 * @typedef {{rowLength:KS["rowLength"],colLength:KS["colLength"],layout:KS["layout"]}} Props
 */
/**
 * @param {Props} props
 * @returns {Props["layout"]}
 */
const flipH = ({ colLength, rowLength, layout }) => {
	const newLayout = [...layout];
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
 * @param {Props} props
 * @returns {Props["layout"]}
 */
const flipV = ({ colLength, rowLength, layout }) => {
	const newCharacters = [...layout];
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
 * @param {Props} props
 * @param {string} count
 * @returns {Props["layout"]}
 */
const shift = ({ colLength, rowLength, layout }, count) => {
	const inputValue = parseInt(count);
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

const keyboardLayout = () => [
	["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
	["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
	["a", "s", "d", "f", "g", "h", "j", "k", "l", ";"],
	["z", "x", "c", "v", "b", "n", "m", ".", ",", "/"],
];

/**
 *
 * @param {string[][]} layout
 * @param {string} input
 */
const mapKey = (layout, input) => {
	const newLayout = keyboardLayout();
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
 * @param {{sequence:string, reverse: string}} flags
 * @param {string} input
 * @returns {string}
 */
const handleCliInput = (flags, input) => {
	const commands = parseSequence(flags);
	let layout = keyboardLayout();
	const rowLength = layout.length;
	const colLength = layout[0].length;
	commands.forEach((command) => {
		switch (command.command) {
			case "H":
				layout = flipH({ colLength, rowLength, layout });
				break;
			case "V":
				layout = flipV({ colLength, rowLength, layout });
				break;
			case "S":
				layout = shift({ colLength, rowLength, layout }, command.steps);
				break;
			default:
				break;
		}
	});
	const result = [...input]
		.map((character) => mapKey(layout, character))
		.join("");
	return result;
};

/**
 * @typedef {{command:("H"|"V")}} FlipCommand
 * @typedef {{command:"S",steps:string}} ShiftCommand
 * @typedef {(FlipCommand|ShiftCommand)} Command
 * @param {{sequence?:string, reverse?: string}} flags
 * @returns {Command[]}
 */
const parseSequence = ({ sequence, reverse }) => {
	/**
	 * @type {Command[]}
	 */
	let commands = [];
	const isReverse = reverse !== undefined;
	let newSequence = isReverse ? reverse : sequence;
	const insert = isReverse
		? Array.prototype.unshift.bind(commands)
		: Array.prototype.push.bind(commands);
	let i = 0;
	while (i < newSequence.length) {
		const value = newSequence[i];
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
			while (
				i < newSequence.length &&
				newSequence[i].match(/[-|\d]/) !== null
			) {
				steps += newSequence[i];
				i++;
			}
			if (isReverse) {
				steps =
					steps.match("-") !== null ? steps.replace("-", "") : "-" + steps;
			}
			if (steps.length > 0) {
				insert({ command: "S", steps });
			}
		}
	}
	return commands;
};

module.exports = {
	flipH,
	flipV,
	shift,
	keyboardLayout,
	mapKey,
	handleCliInput,
};
