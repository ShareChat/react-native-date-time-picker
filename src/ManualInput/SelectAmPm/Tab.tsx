import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { SelectAmOrPm } from '../index';

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
        backgroundColor: '#131319',
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
        backgroundColor: '#D7D7D8',
    },
    text: {
        color: '#8A8A8F',
        fontFamily: 'Nunito',
        fontSize: 13,
        fontWeight: '700',
        lineHeight: 15.6,
    },
    selectedText: {
        color: '#000000',
    },
});
