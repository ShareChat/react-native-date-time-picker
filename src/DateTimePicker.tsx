import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { FlatList, Platform, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';

import Button from './Button';
import { getData, numberOfDaysIn } from './helpers';
import DateList from './List';
import type { ItemType, Mode, PossibleDaysInMonth } from './types';

type Props = {
    mode?: Mode;
    /**
     * The currently selected date.
     */
    value?: Date;
    /**
     * Maximum date.
     *
     * Restricts the range of possible date/time values.
     */
    maximumDate?: Date;
    /**
     * Minimum date.
     *
     * Restricts the range of possible date/time values.
     */
    minimumDate?: Date;
    /**
     * Display TimePicker in 24 hour.
     */
    is24Hour?: boolean;
    /**
     * Callback for when user presses cancel button.
     */
    onClose?: () => void;
    /**
     * Date callback when user presses confirm button
     */
    onConfirm: (date: Date) => void;
    /**
     * Height of single item in list
     */
    itemHeight?: number;
    /**
     * Outermost View style
     */
    containerStyle?: ViewStyle;
    /**
     * Style for individual list item text
     */
    listItemStyle?: TextStyle;
    /**
     * Style for confirm CTA
     */
    confirmButtonStyle?: ViewStyle;
    /**
     * Style for confirm CTA text
     */
    confirmTextStyle?: TextStyle;
    /**
     * Style for close CTA
     */
    closeButtonStyle?: ViewStyle;
    /**
     * Style for close CTA text
     */
    closeTextStyle?: TextStyle;
};

const DateTimePicker = ({
    mode = 'date',
    value = new Date(),
    maximumDate = new Date(),
    minimumDate = new Date(1900, 0, 1),
    is24Hour = false,
    onClose,
    onConfirm,
    itemHeight = 40,
    containerStyle,
    listItemStyle,
    confirmButtonStyle,
    confirmTextStyle,
    closeButtonStyle,
    closeTextStyle,
}: Props) => {
    /**
     * If mode === 'date' depending upon year and month selected
     * number of days will different, hence we need to re-render list
     */
    const [numberOfDays, setNumberOfDays] = useState<PossibleDaysInMonth>(30);
    // Start List
    const startListRef = useRef<null | FlatList>(null);
    const startListData = getData(mode, 0, { numberOfDays });
    const selectedStartItem = useRef<number>(
        mode === 'date' ? value.getDate() : !is24Hour ? value.getHours() - 12 : value.getHours()
    );
    // Middle List
    const middleListRef = useRef<null | FlatList>(null);
    const middleListData = getData(mode, 1);
    const selectedMiddleItem = useRef<number>(
        mode === 'date' ? value.getMonth() : value.getMinutes()
    );
    // End List
    const endListRef = useRef<null | FlatList>(null);
    const endListData = getData(mode, 2, {
        startYear: minimumDate.getFullYear(),
        endYear: maximumDate.getFullYear(),
    });
    const selectedEndItem = useRef<number>(
        mode === 'date' ? value.getFullYear() : !is24Hour && value.getHours() > 11 ? 1 : 0
    );

    useEffect(() => {
        preScroll(selectedStartItem.current, startListData, startListRef);
        preScroll(selectedMiddleItem.current, middleListData, middleListRef);
        preScroll(selectedEndItem.current, endListData, endListRef);
    }, []);

    const performScroll = (flatListRef: any, index: number) => {
        if (Platform.OS === 'ios') {
            // https://github.com/facebook/react-native/issues/13202
            setTimeout(() => {
                flatListRef.current?.scrollToIndex({ animated: false, index });
            }, 100);
        } else {
            flatListRef.current?.scrollToIndex({ animated: false, index });
        }
    };

    const preScroll = (preSelected: number, data: Array<ItemType>, flatListRef: any) => {
        if (preSelected === -1) {
            flatListRef.current?.scrollToEnd({ animated: false });
        } else {
            let index = data.findIndex((item) => {
                return item.value === preSelected;
            });
            index = index - 1;
            index = index < 0 ? 0 : index;

            performScroll(flatListRef, index);
        }
    };

    const handleChange = () => {
        if (mode === 'time') return;
        const newNumberOfDays = numberOfDaysIn(selectedMiddleItem.current, selectedEndItem.current);

        if (newNumberOfDays !== numberOfDays) {
            setNumberOfDays(newNumberOfDays);
        }
    };

    const handleConfirm = () => {
        onConfirm(new Date());
    };

    return (
        <View style={containerStyle}>
            <View style={styles.row}>
                <DateList
                    ref={startListRef}
                    data={startListData}
                    itemHeight={itemHeight}
                    listItemStyle={listItemStyle}
                    selectedValue={selectedStartItem}
                />
                <DateList
                    ref={middleListRef}
                    data={middleListData}
                    itemHeight={itemHeight}
                    selectedValue={selectedMiddleItem}
                    onChange={handleChange}
                    listItemStyle={listItemStyle}
                    style={styles.middleListStyle}
                />
                {!(mode === 'time' && !is24Hour) && (
                    <DateList
                        ref={endListRef}
                        data={endListData}
                        itemHeight={itemHeight}
                        listItemStyle={listItemStyle}
                        selectedValue={selectedEndItem}
                        onChange={handleChange}
                    />
                )}
            </View>
            <View style={[styles.row, styles.buttonContainer]}>
                {onClose && (
                    <Button
                        text="CANCEL"
                        onPress={onClose}
                        textStyle={closeTextStyle}
                        style={StyleSheet.flatten([styles.cancelButton, closeButtonStyle])}
                    />
                )}
                <Button
                    text="OK"
                    onPress={handleConfirm}
                    textStyle={confirmTextStyle}
                    style={
                        onClose
                            ? StyleSheet.flatten([styles.confirmButton, confirmButtonStyle])
                            : confirmButtonStyle
                    }
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    middleListStyle: {
        marginHorizontal: 16,
    },
    row: {
        flexDirection: 'row',
    },
    buttonContainer: {
        marginTop: 16,
    },
    cancelButton: {
        marginEnd: 8,
    },
    confirmButton: {
        marginStart: 8,
    },
});

export default DateTimePicker;
