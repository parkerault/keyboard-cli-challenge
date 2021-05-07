const { Text } = require("ink");
const React = require("react");
const {
	KeyboardDefaultState,
	KeyboardReducer,
} = require("./Entities/Keyboard");

/**
 * @typedef {(dispatch: DispatchFn, state: ApplicationState, fetchFn?: typeof window.fetch) => void} Thunk
 * @typedef {import("./Entities/Keyboard").KeyboardAction} RootAction
 * @typedef {import("react").Dispatch<RootAction>} DispatchFn
 * @typedef {{keyboard: import("./Entities/Keyboard").KeyboardState}} ApplicationState
 */

/**
 * @type ApplicationState
 */
const defaultState = {
	keyboard: KeyboardDefaultState,
};

/**
 * @param {ApplicationState} state
 * @param {RootAction} action
 * @returns {ApplicationState}
 */
function storeReducer(state, action) {
	const nextState = {
		keyboard: KeyboardReducer(state.keyboard, action),
	};
	const eq = Object.entries(nextState).map(([key, val]) => val === state[key]);
	return eq.includes(false) ? nextState : state;
}

module.exports = {
	defaultState,
	storeReducer,
};
