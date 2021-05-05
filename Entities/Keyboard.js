/**
 * @typedef {{type:"flipH"}} FlipHAction
 * @typedef {{type:"flipV"}} FlipVAction
 * @typedef {{type:"shift",payload:number}} ShiftAction
 * @typedef {{type:"showShiftInput",payload:boolean}} ShowShiftInput
 * @typedef {{type:"setInputValue",payload:string}} SetInputValue
 * @typedef {FlipHAction|FlipVAction|ShiftAction|ShowShiftInput|SetInputValue} KeyboardAction
 */
const KeyboardActions = {
	/**
	 * @returns {FlipHAction}
	 */
	flipH: () => ({ type: "flipH" }),
	/**
	 * @returns {FlipVAction}
	 */
	flipV: () => ({ type: "flipV" }),
	/**
	 * @param {number} n
	 * @returns {ShiftAction}
	 */
	shift: (n) => ({ type: "shift", payload: n }),
	showShiftInput: (bool) => ({
		type: "showShiftInput",
		payload: bool,
	}),
  setInputValue: (char) => ({
    type: "setInputValue",
    payload: char
  }),
};

/**
 * @typedef KeyboardState
 * @property {string[][]} characters
 * @property {4} rowLength
 * @property {10} colLength
 * @property {boolean} showShiftInput
 * @property {string} inputValue
 */

/**
 * @type KeyboardState
 */
const KeyboardDefaultState = {
	characters: [
		["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
		["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
		["A", "S", "D", "F", "G", "H", "J", "K", "L", ";"],
		["Z", "X", "C", "V", "B", "N", "M", ".", ",", "/"],
	],
	rowLength: 4,
	colLength: 10,
	showShiftInput: false,
  inputValue: "",
};

/**
 *
 * @param {KeyboardState} state
 * @param {KeyboardAction} action
 * @returns {KeyboardState}
 */
const KeyboardReducer = (state, action) => {
	switch (action.type) {
		case "flipH": {
			const { characters } = state;
			let newCharacters = [];
			for (let row = 0; row < state.rowLength; row++) {
				let newRow = [];
				newCharacters[row] = newRow;
				for (
					let left = 0, right = state.colLength - 1;
					left < state.colLength / 2;
					left++, right--
				) {
					[newRow[left], newRow[right]] = [
						characters[row][right],
						characters[row][left],
					];
				}
			}
			return { ...state, characters: newCharacters };
		}

		case "flipV": {
			const { characters } = state;
			let newCharacters = [[], [], [], []];
			for (
				let top = 0, bottom = state.rowLength - 1;
				top < state.rowLength / 2;
				top++, bottom--
			) {
				for (let col = 0; col < state.colLength; col++) {
					const newTop = characters[bottom][col];
					const newBottom = characters[top][col];
					newCharacters[top][col] = newTop;
					newCharacters[bottom][col] = newBottom;
				}
			}
			return { ...state, characters: newCharacters };
		}

		case "shift": {
			const steps = action.payload;
			const limit = state.colLength;
			const { characters } = state;
			let newCharacters = [[], [], [], []];
			for (let row = 0; row < state.rowLength; row++) {
				for (let col = 0; col < state.colLength; col++) {
					const mod = (col + steps) % limit;
					const newCol = mod < 0 ? mod + limit : mod;
					newCharacters[row][newCol] = characters[row][col];
					newCharacters[row][col] = characters[row][newCol];
				}
			}
			return { ...state, characters: newCharacters };
		}

    case "showShiftInput": {
      return { ...state, showShiftInput: action.payload }
    }

    case "setInputValue": {
      return { ...state, inputValue: action.payload }
    }

		default:
			return state;
	}
};

const KeyboardSelectors = {
	/**
	 * @param {import("../StoreProvider").ApplicationState} state
	 * @returns {KeyboardState}
	 */
	keyboardData: (state) => state.keyboard,
	/**
	 * @param {import("../StoreProvider").ApplicationState} state
	 * @returns {KeyboardState["characters"]}
	 */
	characters: (state) => state.keyboard.characters,
	/**
	 * @param {import("../StoreProvider").ApplicationState} state
	 * @returns {KeyboardState["showShiftInput"]}
	 */
  showShiftInput: (state) => state.keyboard.showShiftInput,
	/**
	 * @param {import("../StoreProvider").ApplicationState} state
	 * @returns {KeyboardState["inputValue"]}
	 */
  inputValue: (state) => state.keyboard.inputValue,
};

module.exports = {
	KeyboardActions,
	KeyboardDefaultState,
	KeyboardReducer,
	KeyboardSelectors,
};
