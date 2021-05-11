"use strict";
const React = require("react");
const importJsx = require("import-jsx");
const { Text, useInput, useApp, Box, Newline } = require("ink");
const TextInput = require("ink-text-input").default;

const { defaultState, storeReducer } = require("./StoreProvider");
/**
 * @type {React.FC<import("./Views/Keyboard").KeyboardProps>}
 */
const Keyboard = importJsx("./Views/Keyboard");
const { KeyboardSelectors, KeyboardActions } = require("./Entities/Keyboard");
const config = require("./config");

/**
 * @type {React.FC}
 * @returns
 */
const App = () => {
	/**
	 * @type {[import("./StoreProvider").ApplicationState, import("./StoreProvider").DispatchFn]} [state, dispatch]
	 */
	const [state, dispatch] = React.useReducer(storeReducer, defaultState);
	const keyboardData = KeyboardSelectors.keyboardData(state);
	const showShiftInput = KeyboardSelectors.showShiftInput(state);
	const inputValue = KeyboardSelectors.inputValue(state);
	const outputDisplayValue = KeyboardSelectors.outputDisplayValue(state);
	const { exit } = useApp();

	useInput((input, key) => {
		switch (input) {
			case "H":
				dispatch(KeyboardActions.flipH());
				break;
			case "V":
				dispatch(KeyboardActions.flipV());
				break;
			case "S":
				dispatch(KeyboardActions.showShiftInput(true));
				break;
			case "Q":
				exit();
				break;
			default:
				if (!showShiftInput) {
					dispatch(KeyboardActions.setOutputValue({ input: input.toLowerCase(), key }));
				}
				break;
		}
	});
	return (
		<>
			<Keyboard
				keyboardData={keyboardData}
				pressed={[outputDisplayValue.slice(-1)]}
			/>
			{showShiftInput ? (
				<Box width="100%" borderStyle="singleDouble">
					<TextInput
						value={inputValue}
						placeholder="Shift by how many?"
						onChange={(val) => dispatch(KeyboardActions.setShiftValue(val))}
						onSubmit={() => {
							dispatch(KeyboardActions.shift(inputValue));
							dispatch(KeyboardActions.showShiftInput(false));
							dispatch(KeyboardActions.setShiftValue(""));
						}}
						focus={showShiftInput}
						showCursor
					/>
				</Box>
			) : (
				<>
					<Box justifyContent="center" width={config.viewWidth}>
						<Box paddingX={1}>
							<Text color={config.textColor}>
								<Text color={config.highlightColor}>⇧+H</Text> = Flip Horizontal
							</Text>
						</Box>
						<Box paddingX={1}>
							<Text color={config.textColor}>
								<Text color={config.highlightColor}>⇧+V</Text> = Flip Vertical
							</Text>
						</Box>
						<Box paddingX={1}>
							<Text color={config.textColor}>
								<Text color={config.highlightColor}>⇧+S</Text> = Shift
							</Text>
						</Box>
						<Box paddingX={1}>
							<Text color={config.textColor}>
								<Text color={config.highlightColor}>⇧+Q</Text> = Quit
							</Text>
						</Box>
					</Box>
					<Newline />
					<Text>Output:</Text>
					<Box borderStyle="double" width={70} paddingX={1} height={12}>
						{outputDisplayValue ? (
							<Text wrap="wrap">{outputDisplayValue}█</Text>
						) : (
							<Text dimColor>Type something!</Text>
						)}
					</Box>
				</>
			)}
		</>
	);
};

module.exports = App;
