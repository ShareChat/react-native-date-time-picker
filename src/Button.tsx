import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

type Props = {
    text: string;
    style?: ViewStyle;
    textStyle?: TextStyle;
    onPress: () => void;
};

const Button: React.FC<Props> = ({ text, style, textStyle, onPress }) => (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
        <Text style={[styles.text, textStyle]}>{text}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    button: {
        flex: 1,
        backgroundColor: '#2196F3',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 2,
        alignItems: 'center',
    },
    text: {
        color: '#fff',
    },
});

export default Button;
