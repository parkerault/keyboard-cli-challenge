const React = require("react");
const { Text, Box } = require("ink");

/**
 * @typedef {{keyboardData:import("../Entities/Keyboard").KeyboardState}} KeyboardProps
 */
/**
 * @type {React.FC<KeyboardProps>}
 * @param {KeyboardProps} props
 */
const Keyboard = (props) => {
	const { characters, colLength, rowLength } = props.keyboardData;
	return Array.from({ length: rowLength }).map((_, i) => (
		<Box flexDirection="row">
			{Array.from({ length: colLength }).map((_, j) => (
				<Box height={4} width={6} justifyContent="center" alignItems="center" borderStyle="double" borderColor="white" key={`Box_${i}${j}`}>
					<Text key={`Text_${characters[i][j]}`}>{characters[i][j]}</Text>
				</Box>
			))}
		</Box>
	));
};

module.exports = Keyboard;
