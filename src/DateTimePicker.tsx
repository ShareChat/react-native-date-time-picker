import dayjs from 'dayjs';
import React, { Ref, useCallback } from 'react';
import { useRef, useState } from 'react';
import { FlatListProps, StyleSheet, View, ViewStyle, TextInput } from 'react-native';

import DateList from './DateList';
import { debounce, getData, numberOfDaysIn } from './helpers';
import ManualInput from './ManualInput';
import type { ItemType, ListItemStyleType, Mode, PossibleDaysInMonth } from './types';

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
    listItemStyle?: ListItemStyleType;
    /**
     * Color style for divider
     */
    separatorColor?: string;
    /**
     * Flat list props
     */
    flatListProps?: Partial<FlatListProps<ItemType>>;
    /**
     * Maximum Date
     */
    maximumDate?: Date;
    /**
     * Minimum Date
     */
    minimumDate?: Date;
    /**
     * Interval for minute list
     *
     * for example if minute interval is 5, you will see
     * 0, 5, 10, 15, 20 and so on
     */
    minuteInterval?: number;
    enableTyping?: boolean;
    setError: (err: string) => void;
    dateRef?: Ref<TextInput>;
};

const DateTimePicker = ({
    mode = 'date',
    initialValue = new Date(),
    is24Hour = false,
    onChange,
    itemHeight = 40,
    containerStyle,
    listItemStyle,
    separatorColor,
    flatListProps,
    maximumDate,
    minimumDate,
    minuteInterval = 1,
    enableTyping = false,
    dateRef,
    setError,
}: Props) => {
    /**
     * If mode === 'date' depending upon year and month selected
     * number of days will different, hence we need to re-render list
     */
    const [numberOfDays, setNumberOfDays] = useState<PossibleDaysInMonth>(
        numberOfDaysIn(initialValue.getMonth() + 1, initialValue.getFullYear())
    );
    // clubbed Date List
    const clubbedDateListData = getData(mode, -1, {
        numberOfDays,
        is24Hour,
        maximumDate,
        minimumDate,
    });
    const clubbedDateItem = useRef<Date>(initialValue);
    // Start List
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
    const middleListData = getData(mode, 1, { minuteInterval });
    const selectedMiddleItem = useRef<number>(
        mode === 'date' ? initialValue.getMonth() : initialValue.getMinutes()
    );
    // End List
    const endListData = getData(mode, 2);
    const selectedEndItem = useRef<number>(
        mode === 'date' ? initialValue.getFullYear() : initialValue.getHours() > 11 ? 2 : 1
    );

    const getInitialScrollIndex = (
        preSelected: number | Date,
        data: Array<ItemType>,
        isDate?: boolean
    ) => {
        if (preSelected === -1) {
            return data.length - 2;
        }

        let index = data.findIndex((item) => {
            if (isDate)
                return (
                    dayjs(item.value).format('DD/MM/YYYY') ===
                    dayjs(preSelected).format('DD/MM/YYYY')
                );
            return item.value === preSelected;
        });
        index = index - 1;
        index = index < 0 ? 0 : index;

        return index;
    };

    const calculateNewDate = useCallback(() => {
        let year, month, day, hour, minute;
        let newDate = new Date(initialValue.getTime());

        if (mode === 'datetime') newDate = new Date(clubbedDateItem.current.getTime());

        if (mode === 'date') {
            year = selectedEndItem.current;
            month = selectedMiddleItem.current;
            day = selectedStartItem.current;
            newDate.setFullYear(year, month, day);
        } else {
            // this else case caters time part for both time and datetime modes.
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

    const debouncedHandleChange = debounce(handleChange, 100);
    if (enableTyping) {
        return (
            <ManualInput setError={setError} dateRef={dateRef} onChange={onChange} mode={mode} />
        );
    }
    return (
        <View style={containerStyle}>
            <View style={styles.row}>
                {mode === 'datetime' && (
                    <DateList
                        data={clubbedDateListData}
                        itemHeight={itemHeight}
                        onChange={debouncedHandleChange}
                        selectedValue={clubbedDateItem}
                        listItemStyle={[listItemStyle, styles.clubbedDateListItemStyle]}
                        initialScrollIndex={getInitialScrollIndex(
                            clubbedDateItem.current,
                            clubbedDateListData,
                            true
                        )}
                        style={styles.clubbedDateListStyle}
                        separatorColor={separatorColor}
                        flatListProps={flatListProps}
                    />
                )}
                <DateList
                    data={startListData}
                    itemHeight={itemHeight}
                    onChange={debouncedHandleChange}
                    listItemStyle={listItemStyle}
                    selectedValue={selectedStartItem}
                    initialScrollIndex={getInitialScrollIndex(
                        selectedStartItem.current,
                        startListData
                    )}
                    separatorColor={separatorColor}
                    flatListProps={flatListProps}
                />
                <DateList
                    data={middleListData}
                    itemHeight={itemHeight}
                    selectedValue={selectedMiddleItem}
                    onChange={debouncedHandleChange}
                    listItemStyle={listItemStyle}
                    style={styles.middleListStyle}
                    initialScrollIndex={getInitialScrollIndex(
                        selectedMiddleItem.current,
                        middleListData
                    )}
                    separatorColor={separatorColor}
                    flatListProps={flatListProps}
                />
                {(mode === 'date' || !is24Hour) && (
                    <DateList
                        data={endListData}
                        itemHeight={itemHeight}
                        listItemStyle={listItemStyle}
                        selectedValue={selectedEndItem}
                        onChange={debouncedHandleChange}
                        initialScrollIndex={getInitialScrollIndex(
                            selectedEndItem.current,
                            endListData
                        )}
                        separatorColor={separatorColor}
                        flatListProps={flatListProps}
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
    clubbedDateListStyle: {
        marginRight: 24,
        flex: 4,
    },
    clubbedDateListItemStyle: {
        textAlign: 'left',
    },
});

export default DateTimePicker;
