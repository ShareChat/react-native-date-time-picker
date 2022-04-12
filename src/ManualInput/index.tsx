import React from 'react';

import { ManualInputDefault } from '../types';
import { DateInput } from './DateInput';
import { DateTimeInput } from './DateTimeInput';
export type Mode = 'date' | 'datetime' | 'time';

type Props = {
    mode: Mode;
    onChange: (date: Date) => void;
};
export const ManualInput = ({ mode, onChange }: Props) => {
    switch (mode) {
        case 'date':
            return <DateInput onChange={onChange} defaultValue={ManualInputDefault.LongDate} />;
        case 'datetime':
            return <DateTimeInput onChange={onChange} />;
        default:
            return <></>;
    }
};
