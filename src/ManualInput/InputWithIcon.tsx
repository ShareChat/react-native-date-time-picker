import React from 'react';
import { Image, StyleSheet, Text, View, ViewStyle, TextInput } from 'react-native';

import { ManualInputDefault } from '../types';
import Input from './Input';

type Props = {
    iconUrl: string;
    containerStyle?: ViewStyle;
    defaultValue: ManualInputDefault;
    onInputChange: (text: string) => void;
    errorText?: string;
    maxLength?: number;
    dateRef?: TextInput;
};
export const InputWithIcon = ({
    iconUrl,
    containerStyle,
    defaultValue,
    onInputChange,
    errorText,
    maxLength,
    dateRef,
}: Props) => {
    return (
        <View style={containerStyle}>
            <View style={styles.inputWithIconStyle}>
                <Image
                    source={{
                        uri: iconUrl,
                    }}
                    style={styles.iconStyle}
                />

                <Input
                 // @ts-ignore:next-line
                    ref={dateRef}
                    maxLength={maxLength}
                    onInputChange={onInputChange}
                    defaultValue={defaultValue}
                />
            </View>
            <Text style={styles.errorStyle}>{errorText}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    iconStyle: {
        height: 24,
        width: 24,
        marginRight: 16,
        marginVertical: 12,
    },
    inputWithIconStyle: {
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center',
        height: 48,
    },
    errorStyle: {
        color: 'red',
    },
});
