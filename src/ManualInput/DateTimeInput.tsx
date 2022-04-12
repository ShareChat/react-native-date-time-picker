import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ImageUrl } from '../config/ImageUrls';
import { validateDate, validateTime } from '../helpers';
import { ManualInputDefault } from '../types';
import { InputWithIcon } from './InputWithIcon';
import SelectAmPm from './SelectAmPm';

type Props = {
    onChange: (text: Date) => void;
};
export enum SelectAmOrPm {
    am = 'AM',
    pm = 'PM',
}
const timeMaxLength = 4;
const dateMaxLength = 4;
export const DateTimeInput = ({ onChange }: Props) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [timeError, setTimeError] = useState('');
    const [dateError, setDateError] = useState('');

    const [selected, setSelected] = useState<SelectAmOrPm>(SelectAmOrPm.am);
    const onInputDateChange = (text: string) => {
        setDateError('');
        if (text.length === dateMaxLength) {
            const day = text.substring(0, 2);
            const month = text.substring(2, 4);
            const year = new Date().getFullYear();
            const currentDate = `${year}/${month}/${day}`;
            if (validateDate(currentDate, 'YYYY/MM/DD')) {
                setDate(currentDate);
            } else {
                setDateError('Invalid date');
            }
        } else {
            setDate('');
        }
    };

    const onInputTimeChange = (text: string) => {
        setTimeError('');
        if (text.length === timeMaxLength) {
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
        }
    };

    useEffect(() => {
        if (date && time) {
            const formattedDate = dayjs(
                `${date}, ${time} ${selected}`,
                'YYYY/MM/DD, hh:mm a'
            ).toDate();
            onChange(formattedDate);
        }
    }, [date, time, selected, onChange]);

    return (
        <View style={styles.container}>
            <InputWithIcon
                onInputChange={onInputDateChange}
                iconUrl={ImageUrl.CALENDAR}
                defaultValue={ManualInputDefault.ShortDate}
                errorText={dateError}
                maxLength={dateMaxLength}
            />
            <InputWithIcon
                onInputChange={onInputTimeChange}
                iconUrl={ImageUrl.CLOCK_ICON}
                defaultValue={ManualInputDefault.Time}
                containerStyle={styles.marginLeftAuto}
                errorText={timeError}
                maxLength={timeMaxLength}
            />
            <SelectAmPm selected={selected} setSelected={setSelected} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: 114,
        backgroundColor: '#000000',
    },
    marginLeftAuto: {
        marginLeft: 'auto',
    },
});
