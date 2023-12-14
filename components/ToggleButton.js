import React from 'react';
import { TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const ToggleButton = ({ toggleHistory }) => {
    return (
        <TouchableOpacity onPress={toggleHistory}>
            <Svg width="23" height="23" viewBox="0 0 23 23">
                {/* Top line */}
                <Path
                    d="M 2 4.5 L 21 4.5"
                    strokeWidth="3"
                    stroke="white"
                    strokeLinecap="round"
                />
                {/* Middle line */}
                <Path
                    d="M 2 11.5 L 21 11.5"
                    strokeWidth="3"
                    stroke="white"
                    strokeLinecap="round"
                />
                {/* Bottom line */}
                <Path
                    d="M 2 18.5 L 21 18.5"
                    strokeWidth="3"
                    stroke="white"
                    strokeLinecap="round"
                />
            </Svg>
        </TouchableOpacity>
    );
};

export default ToggleButton;
