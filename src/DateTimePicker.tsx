import React, { useCallback } from 'react';
import { useRef, useState } from 'react';
import { FlatList, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';

import DateList from './DateList';
import { getData, numberOfDaysIn } from './helpers';
import type { ItemType, Mode, PossibleDaysInMonth } from './types';

type Props = {
    mode?: Mode;
    /**
     * Initial Date to scroll to
     */
    initialValue?: Date;
    /**
     * Display TimePicker in 24 hour.
     */
    is24Hour?: boolean;
    /**
     * Callback to be called every time user change date
     */
    onChange: ($date: Date) => void;
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
};

const DateTimePicker = ({
    mode = 'date',
    initialValue = new Date(),
    is24Hour = false,
    onChange,
    itemHeight = 40,
    containerStyle,
    listItemStyle,
}: Props) => {
    /**
     * If mode === 'date' depending upon year and month selected
     * number of days will different, hence we need to re-render list
     */
    const [numberOfDays, setNumberOfDays] = useState<PossibleDaysInMonth>(
        numberOfDaysIn(initialValue.getMonth() + 1, initialValue.getFullYear())
    );
    // Start List
    const startListRef = useRef<null | FlatList>(null);
    const startListData = getData(mode, 0, { numberOfDays, is24Hour });
    const selectedStartItem = useRef<number>(
        mode === 'date'
            ? initialValue.getDate()
            : is24Hour
            ? initialValue.getHours()
            : initialValue.getHours() < 13
            ? initialValue.getHours() === 0
                ? 12
                : initialValue.getHours()
            : initialValue.getHours() - 12
    );
    // Middle List
    const middleListRef = useRef<null | FlatList>(null);
    const middleListData = getData(mode, 1);
    const selectedMiddleItem = useRef<number>(
        mode === 'date' ? initialValue.getMonth() : initialValue.getMinutes()
    );
    // End List
    const endListRef = useRef<null | FlatList>(null);
    const endListData = getData(mode, 2);
    const selectedEndItem = useRef<number>(
        mode === 'date' ? initialValue.getFullYear() : initialValue.getHours() > 11 ? 2 : 1
    );

    const preScroll = useCallback(
        (preSelected: number, data: Array<ItemType>, flatListRef: any) => {
            if (preSelected === -1) {
                flatListRef.current?.scrollToEnd({ animated: false });
            } else {
                let index = data.findIndex((item) => {
                    return item.value === preSelected;
                });
                index = index - 1;
                index = index < 0 ? 0 : index;
                setTimeout(() => {
                    flatListRef.current?.scrollToIndex({ animated: true, index });
                }, 100);
            }
        },
        []
    );

    const calculateNewDate = useCallback(() => {
        let year, month, day, hour, minute;
        let newDate = new Date(initialValue.getTime());
        if (mode === 'date') {
            year = selectedEndItem.current;
            month = selectedMiddleItem.current;
            day = selectedStartItem.current;
            newDate.setFullYear(year, month, day);
        } else {
            hour =
                is24Hour || selectedEndItem.current === 1
                    ? selectedStartItem.current
                    : selectedStartItem.current + 12;
            minute = selectedMiddleItem.current;
            if (hour === 24) {
                hour = 12;
            } else if (!is24Hour && selectedEndItem.current === 1 && hour === 12) {
                hour = 0;
            }
            newDate.setHours(hour, minute);
        }
        return newDate;
    }, [initialValue, is24Hour, mode]);

    const handleChange = useCallback(() => {
        if (mode === 'date') {
            const newNumberOfDays = numberOfDaysIn(
                selectedMiddleItem.current + 1, //month
                selectedEndItem.current // year
            );

            if (newNumberOfDays !== numberOfDays) {
                setNumberOfDays(newNumberOfDays);
            }
        }
        onChange(calculateNewDate());
    }, [mode, onChange, calculateNewDate, numberOfDays]);

    return (
        <View style={containerStyle}>
            <View style={styles.row}>
                <DateList
                    ref={startListRef}
                    data={startListData}
                    itemHeight={itemHeight}
                    onChange={handleChange}
                    listItemStyle={listItemStyle}
                    selectedValue={selectedStartItem}
                    onLayout={() =>
                        preScroll(selectedStartItem.current, startListData, startListRef)
                    }
                />
                <DateList
                    ref={middleListRef}
                    data={middleListData}
                    itemHeight={itemHeight}
                    selectedValue={selectedMiddleItem}
                    onChange={handleChange}
                    listItemStyle={listItemStyle}
                    style={styles.middleListStyle}
                    onLayout={() =>
                        preScroll(selectedMiddleItem.current, middleListData, middleListRef)
                    }
                />
                {(mode === 'date' || !is24Hour) && (
                    <DateList
                        ref={endListRef}
                        data={endListData}
                        itemHeight={itemHeight}
                        listItemStyle={listItemStyle}
                        selectedValue={selectedEndItem}
                        onChange={handleChange}
                        onLayout={() => preScroll(selectedEndItem.current, endListData, endListRef)}
                    />
                )}
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
