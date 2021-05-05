"use strict";
const React = require("react");
const { useEffect } = require("react");
const importJsx = require("import-jsx");
const { Text, useInput, useApp } = require("ink");
const TextInput = require("ink-text-input").default;

const { defaultState, storeReducer } = importJsx("./StoreProvider");
const Keyboard = importJsx("./Views/Keyboard");
const { KeyboardSelectors, KeyboardActions } = require("./Entities/Keyboard");

const App = ({ name = "Stranger" }) => {
	const [state, dispatch] = React.useReducer(storeReducer, defaultState);
	const keyboardData = KeyboardSelectors.keyboardData(state);
	const showShiftInput = KeyboardSelectors.showShiftInput(state);
	const inputValue = KeyboardSelectors.inputValue(state);

	const { exit } = useApp();
	useInput((input, key) => {
		switch (input) {
			case "h":
				dispatch(KeyboardActions.flipH());
				break;
			case "v":
				dispatch(KeyboardActions.flipV());
				break;
			case "s":
				dispatch(KeyboardActions.shift(1));
				// dispatch(KeyboardActions.showShiftInput(true));
				break;
			case "S":
				dispatch(KeyboardActions.shift(-1));
				// dispatch(KeyboardActions.showShiftInput(true));
				break;
			case "q":
				exit();
				break;
			default:
				break;
		}
	});
	return (
		<>
			<Keyboard keyboardData={keyboardData} />
			<Text>
				Use <Text color="green">h, v, s, S</Text> to flip vertical, horizontal,
				shift 1, or shift -1.
			</Text>
			{/* {showShiftInput && <TextInput value={inputValue} onChange={(val) => dispatch(KeyboardActions.setInputValue(val))} />} */}
		</>
	);
};

module.exports = App;
