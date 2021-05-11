const React = require("react");
const { Text, Box } = require("ink");
const config = require("../config");

/**
 * @typedef {{pressed: string[], keyboardData:import("../Entities/Keyboard").KeyboardState}} KeyboardProps
 * @type {React.FC<KeyboardProps>}
 */
const Keyboard = (props) => {
	const { colLength, rowLength, layout: characters } = props.keyboardData;
	const rowIdxs = Array.from({ length: rowLength }).map((_, i) => i);
	const colIdxs = Array.from({ length: colLength }).map((_, i) => i);
	return (
		<Box
			flexDirection="column"
			borderStyle="round"
      borderColor={config.textColor}
			paddingX={1}
			width={config.viewWidth}
			alignItems="center"
		>
			{rowIdxs.map((i) => (
				<Box key={`Box_${i}`} flexDirection="row">
					{colIdxs.map((j) => {
						const text = characters[i][j];
						return (
							<KeyDisplay
								key={`Key_${j}`}
								text={text}
								highlight={props.pressed.includes(text)}
							></KeyDisplay>
						);
					})}
				</Box>
			))}
			<Box
				width={config.viewWidth - 20}
				height={3}
				borderStyle="round"
				justifyContent="center"
				borderColor={getColor(props.pressed.includes(" "))}
			>
				<Text color={getColor(props.pressed.includes(" "))}>Space</Text>
			</Box>
		</Box>
	);
};

/**
 * @typedef {{text: string, highlight: boolean}} KeyDisplayProps
 * @type {React.FC<KeyDisplayProps>}
 */

const KeyDisplay = (props) => {
	const { highlight, text } = props;
	return (
		<Box
			height={3}
			width={5}
			justifyContent="center"
			alignItems="center"
			borderStyle="round"
			borderColor={getColor(highlight)}
		>
			<Text color={getColor(highlight)}>{text}</Text>
		</Box>
	);
};

const getColor = (highlight) =>
	highlight ? config.highlightColor : config.textColor;

module.exports = Keyboard;
