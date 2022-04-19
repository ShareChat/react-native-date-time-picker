import React, { forwardRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { ManualInputDefault } from '../types';
import { themeColors } from '../config/constants';

const obfusChars = ['/', ':'];

type Props = {
    defaultValue: ManualInputDefault;
    onInputChange: (text: string) => void;
    maxLength?: number;
};
export type FocusHandle = {
    focus: () => void;
};

const Input = forwardRef<TextInput, Props>(({ defaultValue, onInputChange, maxLength }, ref) => {
    const [value, setValue] = useState('');
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
            <TouchableOpacity
                onPress={() => {
                    if (ref != null && typeof ref !== 'function') {
                        ref?.current?.focus();
                    }
                }}
                style={styles.maskedTextContainer}>
                <Text style={styles.maskedText}>{renderMaskedText(value)}</Text>
            </TouchableOpacity>

            <TextInput
                ref={ref}
                caretHidden={true}
                value={value}
                onChangeText={handleChange}
                style={[styles.textInputStyle, { minWidth }]}
                maxLength={maxLength}
                keyboardType="number-pad"
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        backgroundColor: themeColors.black,
        position: 'relative',
        height: 48,
    },
    textInputStyle: {
        color: 'transparent',
        backgroundColor: themeColors.surface,
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
        color: themeColors.disabled,
        fontFamily: 'Nunito',
        fontSize: 15,
        fontWeight: '400',
        lineHeight: 19,
    },
});
export default Input;
