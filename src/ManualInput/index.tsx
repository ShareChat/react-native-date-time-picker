import React, { Ref, useEffect, useState, useRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { ImageUrl } from '../config/ImageUrls';
import { convertTimeTo24hr, validateDate, validateTime } from '../helpers';
import { InputDefaultLength, ManualInputDefault, Mode } from '../types';
import { InputWithIcon } from './InputWithIcon';
import SelectAmPm from './SelectAmPm';
import { themeColors } from '../config/constants';

type Props = {
    onChange: (text: Date) => void;
    setError: (err: string) => void;
    mode: Mode;
    dateRef?: Ref<TextInput>;
};
export enum SelectAmOrPm {
    am = 'AM',
    pm = 'PM',
}
const ManualInput = ({ onChange, setError, mode, dateRef }: Props) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [timeError, setTimeError] = useState('');
    const [dateError, setDateError] = useState('');

    const [selected, setSelected] = useState<SelectAmOrPm>(SelectAmOrPm.am);

    const timeRef = useRef<TextInput>(null);

    useEffect(() => {
        setError('Invalid date and time');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (mode === 'datetime') {
            onChangeDateTime();
        } else {
            onChangeDate();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [date, time, selected]);

    const onInputDateChange = (text: string) => {
        setDateError('');
        const dateMaxLength =
            mode === 'date' ? InputDefaultLength.LongDate : InputDefaultLength.ShortDate;
        if (text.length === dateMaxLength) {
            const day = text.substring(0, 2);
            const month = text.substring(2, 4);
            const year = mode === 'date' ? text.substring(4, 8) : new Date().getFullYear();
            const currentDate = `${year}/${month}/${day}`;

            if (validateDate(currentDate, 'YYYY/MM/DD')) {
                setDate(currentDate);
            } else {
                setDateError('Invalid date');
            }
        } else {
            setDate('');
            setError('Invalid date');
        }
    };

    const onInputTimeChange = (text: string) => {
        setTimeError('');
        if (text.length === InputDefaultLength.Time) {
            const hour = text.substring(0, 2);
            const min = text.substring(2, 4);
            const currentTime = `${hour}:${min}`;

            if (validateTime(currentTime, /^(0?[1-9]|1[0-2]):[0-5][0-9]$/)) {
                setTime(currentTime);
            } else {
                setTimeError('Invalid time');
            }
        } else {
            setTime('');
            setError('Invalid time');
        }
    };
    const onChangeDate = () => {
        if (date) {
            setError('');
            const [year, month, day] = date.split('/');
            const formattedDate = new Date(Number(year), Number(month) - 1, Number(day));
            onChange(formattedDate);
        }
    };
    const onChangeDateTime = () => {
        if (date && time) {
            setError('');
            const [hours, minutes] = convertTimeTo24hr(`${time} ${selected}`).split(':');
            const [year, month, day] = date.split('/');
            const formattedDate = new Date(
                Number(year),
                Number(month) - 1,
                Number(day),
                Number(hours),
                Number(minutes)
            );
            onChange(formattedDate);
        }
    };

    return (
        <View style={styles.container}>
            <InputWithIcon
                onInputChange={onInputDateChange}
                iconUrl={ImageUrl.CALENDAR}
                defaultValue={
                    mode === 'date' ? ManualInputDefault.LongDate : ManualInputDefault.ShortDate
                }
                errorText={dateError}
                maxLength={
                    mode === 'date' ? InputDefaultLength.LongDate : InputDefaultLength.ShortDate
                }
                ref={dateRef}
            />
            {mode === 'datetime' ? (
                <>
                    <InputWithIcon
                        onInputChange={onInputTimeChange}
                        iconUrl={ImageUrl.CLOCK_ICON}
                        defaultValue={ManualInputDefault.Time}
                        containerStyle={styles.marginLeftAuto}
                        errorText={timeError}
                        maxLength={InputDefaultLength.Time}
                        ref={timeRef}
                    />
                    <SelectAmPm selected={selected} setSelected={setSelected} />
                </>
            ) : (
                <></>
            )}
        </View>
    );
};

export default ManualInput;

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: 114,
        backgroundColor: themeColors.black,
    },
    marginLeftAuto: {
        marginLeft: 'auto',
    },
});
