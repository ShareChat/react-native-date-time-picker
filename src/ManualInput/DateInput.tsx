import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

import { ImageUrl } from '../config/ImageUrls';
import { validateDate } from '../helpers';
import { ManualInputDefault } from '../types';
import { InputWithIcon } from './InputWithIcon';

type Props = {
    defaultValue: ManualInputDefault;
    onChange: (text: Date) => void;
};
export const DateInput = ({ defaultValue, onChange }: Props) => {
    const [date, setDate] = useState<string>('');
    const onInputChange = (text: string) => {
        if (text.length === 8) {
            const day = text.substring(0, 2);
            const month = text.substring(2, 4);
            const year = text.substring(4, 8);
            const currentDate = `${year}/${month}/${day}`;
            if (validateDate(currentDate, 'YYYY/MM/DD')) {
                setDate(currentDate);
            } else {
                console.log('please enter valid date');
            }
        } else {
            setDate('');
        }
    };

    useEffect(() => {
        if (date) {
            const formattedDate = dayjs(date, 'YYYY/MM/DD').toDate();
            onChange(formattedDate);
        }
    }, [date, onChange]);

    return (
        <InputWithIcon
            onInputChange={onInputChange}
            iconUrl={ImageUrl.CALENDAR}
            defaultValue={defaultValue}
            maxLength={8}
        />
    );
};
