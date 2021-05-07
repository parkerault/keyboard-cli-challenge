const { flipH, flipV, shift, keyboardLayout, mapKey } = require("../lib");
/**
 * @typedef {{type:"flipH"}} FlipHAction
 * @typedef {{type:"flipV"}} FlipVAction
 * @typedef {{type:"shift",payload:string}} ShiftAction
 * @typedef {{type:"showShiftInput",payload:boolean}} ShowShiftInputAction
 * @typedef {{type:"setShiftValue",payload:string}} SetInputValueAction
 * @typedef {import("ink").Key} KeyEvent
 * @typedef {{input: string, key: KeyEvent}} SetOutputValuePayload
 * @typedef {{type:"setOutputValue",payload:SetOutputValuePayload}} SetOutputValueAction
 * @typedef {FlipHAction|FlipVAction|ShiftAction|ShowShiftInputAction|SetInputValueAction|SetOutputValueAction} KeyboardAction
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
	 * @param {string} n
	 * @returns {ShiftAction}
	 */
	shift: (n) => ({ type: "shift", payload: n }),
	/**
	 * @param {boolean} bool
	 * @returns {ShowShiftInputAction}
	 */
	showShiftInput: (bool) => ({
		type: "showShiftInput",
		payload: bool,
	}),
	/**
	 * @param {string} char
	 * @returns {SetInputValueAction}
	 */
	setShiftValue: (char) => ({
		type: "setShiftValue",
		payload: char,
	}),
	/**
	 * @param {SetOutputValuePayload} payload
	 * @returns {SetOutputValueAction}
	 */
	setOutputValue: (payload) => ({
		type: "setOutputValue",
		payload,
	}),
};

/**
 * @typedef KeyboardState
 * @property {string[][]} layout
 * @property {number} rowLength
 * @property {number} colLength
 * @property {boolean} showShiftInput
 * @property {string} inputValue
 * @property {string} outputValue
 * @property {string} outputDisplayValue
 */

/**
 * @type KeyboardState
 */
const KeyboardDefaultState = {
	layout: keyboardLayout(),
	rowLength: 4,
	colLength: 10,
	showShiftInput: false,
	inputValue: "",
	outputValue: "",
	outputDisplayValue: "",
};

/**
 *
 * @param {KeyboardState} state
 * @param {import("../StoreProvider").RootAction} action
 * @returns {KeyboardState}
 */
const KeyboardReducer = (state, action) => {
	const { colLength, rowLength, layout: characters } = state;

	switch (action.type) {
		case "flipH": {
			const newLayout = flipH(state);
			const outputDisplayValue = mapOutputValues(
				newLayout,
				state.outputValue
			);
			return { ...state, layout: newLayout, outputDisplayValue };
		}

		case "flipV": {
			const newCharacters = flipV(state);
			const outputDisplayValue = mapOutputValues(
				newCharacters,
				state.outputValue
			);
			return { ...state, layout: newCharacters, outputDisplayValue };
		}

		case "shift": {
			const newCharacters = shift(state, action.payload);
			const outputDisplayValue = mapOutputValues(
				newCharacters,
				state.outputValue
			);
			return { ...state, layout: newCharacters, outputDisplayValue };
		}

		case "showShiftInput": {
			return { ...state, showShiftInput: action.payload };
		}

		case "setShiftValue": {
			return { ...state, inputValue: action.payload };
		}

		case "setOutputValue": {
			const { input, key } = action.payload;
			let outputValue;
			if (key.delete) {
				outputValue = state.outputValue.slice(0, -1);
			} else if (key.return) {
				outputValue = state.outputValue + "\n";
			} else {
				outputValue = state.outputValue + mapKey(state.layout, input);
			}
			const outputDisplayValue = mapOutputValues(state.layout, outputValue);
			return { ...state, outputValue, outputDisplayValue };
		}

		default:
			return state;
	}
};

const mapOutputValues = (characters, outputValue) => {
	const outputDisplayValue = [...outputValue]
		.map((value) => {
			const result = mapKey(characters, value);
			return result;
		})
		.join("");
	return outputDisplayValue;
};

const KeyboardSelectors = {
	/**
	 * @param {import("../StoreProvider").ApplicationState} state
	 * @returns {KeyboardState}
	 */
	keyboardData: (state) => state.keyboard,
	/**
	 * @param {import("../StoreProvider").ApplicationState} state
	 * @returns {KeyboardState["layout"]}
	 */
	characters: (state) => state.keyboard.layout,
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
	/**
	 * @param {import("../StoreProvider").ApplicationState} state
	 * @returns {KeyboardState["outputValue"]}
	 */
	outputValue: (state) => state.keyboard.outputValue,
	/**
	 * @param {import("../StoreProvider").ApplicationState} state
	 * @returns {KeyboardState["outputDisplayValue"]}
	 */
	outputDisplayValue: (state) => state.keyboard.outputDisplayValue,
};

module.exports = {
	KeyboardActions,
	KeyboardDefaultState,
	KeyboardReducer,
	KeyboardSelectors,
};
