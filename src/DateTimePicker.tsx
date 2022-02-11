import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';

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
     * Confirm Button title
     */
    confirmButtonTitle?: string;
    /**
     * Style for confirm CTA
     */
    confirmButtonStyle?: ViewStyle;
    /**
     * Style for confirm CTA text
     */
    confirmTextStyle?: TextStyle;
    /**
     * Close Button title
     */
    closeButtonTitle?: string;
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
    is24Hour = false,
    onClose,
    onConfirm,
    itemHeight = 40,
    containerStyle,
    listItemStyle,
    confirmButtonTitle = 'Ok',
    confirmButtonStyle,
    confirmTextStyle,
    closeButtonTitle = 'Cancel',
    closeButtonStyle,
    closeTextStyle,
}: Props) => {
    /**
     * If mode === 'date' depending upon year and month selected
     * number of days will different, hence we need to re-render list
     */
    const [numberOfDays, setNumberOfDays] = useState<PossibleDaysInMonth>(
        numberOfDaysIn(value.getMonth() + 1, value.getFullYear())
    );
    // Start List
    const startListRef = useRef<null | FlatList>(null);
    const startListData = getData(mode, 0, { numberOfDays, is24Hour });
    const selectedStartItem = useRef<number>(
        mode === 'date'
            ? value.getDate()
            : is24Hour
            ? value.getHours()
            : value.getHours() < 13
            ? value.getHours() === 0
                ? 12
                : value.getHours()
            : value.getHours() - 12
    );
    // Middle List
    const middleListRef = useRef<null | FlatList>(null);
    const middleListData = getData(mode, 1);
    const selectedMiddleItem = useRef<number>(
        mode === 'date' ? value.getMonth() : value.getMinutes()
    );
    // End List
    const endListRef = useRef<null | FlatList>(null);
    const endListData = getData(mode, 2);
    const selectedEndItem = useRef<number>(
        mode === 'date' ? value.getFullYear() : value.getHours() > 11 ? 2 : 1
    );

    useEffect(() => {
        preScroll(selectedEndItem.current, endListData, endListRef);
        preScroll(selectedMiddleItem.current, middleListData, middleListRef);
        preScroll(selectedStartItem.current, startListData, startListRef);
    }, []);

    const preScroll = (preSelected: number, data: Array<ItemType>, flatListRef: any) => {
        if (preSelected === -1) {
            flatListRef.current?.scrollToEnd({ animated: false });
        } else {
            let index = data.findIndex((item) => {
                return item.value === preSelected;
            });
            index = index - 1;
            index = index < 0 ? 0 : index;
            setTimeout(() => {
                flatListRef.current?.scrollToIndex({ animated: false, index });
            }, 100);
        }
    };

    const handleChange = () => {
        if (mode === 'time') return;
        const newNumberOfDays = numberOfDaysIn(
            selectedMiddleItem.current + 1,
            selectedEndItem.current
        );

        if (newNumberOfDays !== numberOfDays) {
            setNumberOfDays(newNumberOfDays);
        }
    };

    const handleConfirm = () => {
        let [year, month, date, hour, minute] = [
            value.getFullYear(),
            value.getMonth(),
            value.getDate(),
            value.getHours(),
            value.getMinutes(),
        ];
        if (mode === 'date') {
            year = selectedEndItem.current;
            month = selectedMiddleItem.current;
            date = selectedStartItem.current;
        } else {
            hour =
                is24Hour || selectedEndItem.current === 1
                    ? selectedStartItem.current
                    : selectedStartItem.current + 12;
            minute = selectedMiddleItem.current;
        }
        onConfirm(new Date(year, month, date, hour, minute));
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
                {(mode === 'date' || !is24Hour) && (
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
                        text={closeButtonTitle}
                        onPress={onClose}
                        textStyle={closeTextStyle}
                        style={StyleSheet.flatten([styles.cancelButton, closeButtonStyle])}
                    />
                )}
                <Button
                    text={confirmButtonTitle}
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
