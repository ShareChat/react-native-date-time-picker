import React, { useState, useRef } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

import { ManualInputDefault } from '../types';
const obfusChars = ['/', ':'];
type Props = {
    defaultValue: ManualInputDefault;
    onInputChange: (text: string) => void;
    maxLength?: number;
};
function Input({ defaultValue, onInputChange, maxLength }: Props) {
    const [value, setValue] = useState('');
    const textInputRef = useRef<TextInput>(null);
    const minWidth = defaultValue === ManualInputDefault.LongDate ? 130 : 94;

    const handleChange = (text: string) => {
        setValue(text);
        onInputChange(text);
    };

    const renderMaskedText = (text: string) => {
        let val = defaultValue.split('');
        let j = 0;
        for (let i = 0; i < defaultValue.length; i++) {
            if (obfusChars.includes(defaultValue[i])) {
                val[i] = defaultValue[i];
            } else {
                val[i] = text[j] ?? defaultValue[i];
                j++;
            }
        }
        return <Text style={styles.maskedText}>{val.join('')}</Text>;
    };

    return (
        <View style={styles.container}>
            <View style={styles.maskedTextContainer}>
                <Text
                    onPress={() => {
                        textInputRef.current?.focus();
                    }}
                    style={styles.maskedText}>
                    {renderMaskedText(value)}
                </Text>
            </View>

            <TextInput
                ref={textInputRef}
                caretHidden={true}
                value={value}
                onChangeText={handleChange}
                style={[styles.textInputStyle, { minWidth }]}
                maxLength={maxLength}
                keyboardType="number-pad"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000000',
        position: 'relative',
        height: 48,
    },
    textInputStyle: {
        color: 'transparent',
        backgroundColor: '#131319',
        paddingHorizontal: 12,
        borderRadius: 8,
        paddingVertical: 14.5,
    },
    maskedTextContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        zIndex: 1,
    },
    maskedText: {
        color: '#8A8A8F',
        fontFamily: 'Nunito',
        fontSize: 15,
        fontWeight: '400',
        lineHeight: 19,
    },
});
export default Input;
