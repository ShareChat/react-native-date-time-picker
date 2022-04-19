import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { SelectAmOrPm } from '../index';
import { themeColors } from '../../config/constants';

type Props = {
    text: string;
    selected: SelectAmOrPm;
    setSelected: (flag: SelectAmOrPm) => void;
    type: SelectAmOrPm;
};

const Tab = ({ text, selected, setSelected, type }: Props) => {
    const handleTabPress = () => {
        if (selected !== type) {
            setSelected(type);
        }
    };
    const isTabSelected = selected === type;
    return (
        <TouchableOpacity
            onPress={handleTabPress}
            style={[
                styles.tab,
                isTabSelected && styles.tabSelected,
                type === SelectAmOrPm.am ? styles.topBorder : styles.bottomBorder,
            ]}>
            <Text style={[styles.text, isTabSelected && styles.selectedText]}>{text}</Text>
        </TouchableOpacity>
    );
};

export default Tab;

const styles = StyleSheet.create({
    container: {
        marginLeft: 8,
    },
    tab: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 24,
        backgroundColor: themeColors.surface,
        width: 40,
    },
    topBorder: {
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    bottomBorder: {
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    tabSelected: {
        backgroundColor: themeColors.primary,
    },
    text: {
        color: themeColors.disabled,
        fontFamily: 'Nunito',
        fontSize: 13,
        fontWeight: '700',
        lineHeight: 15.6,
    },
    selectedText: {
        color: themeColors.black,
    },
});
