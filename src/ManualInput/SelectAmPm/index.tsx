import React from 'react';
import { StyleSheet, View } from 'react-native';

import { SelectAmOrPm } from '../index';
import Tab from './Tab';
import { themeColors } from '../../config/constants';
type Props = {
    selected: SelectAmOrPm;
    setSelected: (flag: SelectAmOrPm) => void;
};
const SelectAmPm = ({ selected, setSelected }: Props) => {
    return (
        <View style={styles.container}>
            <Tab
                selected={selected}
                type={SelectAmOrPm.am}
                setSelected={setSelected}
                text={SelectAmOrPm.am}
            />
            <Tab
                type={SelectAmOrPm.pm}
                selected={selected}
                setSelected={setSelected}
                text={SelectAmOrPm.pm}
            />
        </View>
    );
};

export default SelectAmPm;

const styles = StyleSheet.create({
    container: {
        marginLeft: 8,
        marginBottom: 16,
    },
    tab: {
        display: 'flex',
        alignItems: 'center',
        height: 24,
        backgroundColor: themeColors.surface,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        width: 40,
    },
    text: {
        color: themeColors.disabled,
        fontFamily: 'Nunito',
        fontSize: 13,
        fontWeight: '400',
        lineHeight: 15.6,
    },
});
