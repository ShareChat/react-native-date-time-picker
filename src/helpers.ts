import type { ItemType, Mode, PossibleDaysInMonth } from './types';

type Config = {
    numberOfDays?: PossibleDaysInMonth;
    is24Hour?: boolean;
    startYear?: number;
    endYear?: number;
};

export function numberOfDaysIn(month: number, year: number): PossibleDaysInMonth {
    const monthWith30Days = [4, 6, 9, 11];
    let days: PossibleDaysInMonth = 31;
    if (monthWith30Days.includes(month)) {
        days = 30;
    } else if (month === 2) {
        if (_isLeapYear(year)) {
            days = 29;
        } else {
            days = 28;
        }
    }
    return days;
}

export function getData(mode: Mode, index: 0 | 1 | 2, config: Config = {}): Array<ItemType> {
    if (mode === 'date') {
        return _getDateData(index, config);
    }
    return _getTimeData(index, config.is24Hour ?? false);
}

function _getDateData(
    index: 0 | 1 | 2,
    { numberOfDays = 31, startYear = 1900, endYear = new Date().getFullYear() }: Config
): Array<ItemType> {
    if (index === 0) {
        switch (numberOfDays) {
            case 31:
                return date31Data;
            case 30:
                return date30Data;
            case 29:
                return date29Data;
            case 28:
                return date28Data;
        }
    } else if (index === 1) {
        return monthData;
    } else {
        return _addEmptySlots(getYearArray(startYear, endYear));
    }
}

function _getTimeData(index: 0 | 1 | 2, is24Hour: boolean): Array<ItemType> {
    if (index === 0) {
        return is24Hour ? hour24Data : hour12Data;
    } else if (index === 1) {
        return minuteData;
    } else {
        return amPmData;
    }
}

function _addEmptySlots(array: Array<ItemType>): Array<ItemType> {
    return [{ value: -1, text: '', id: '#-1' }, ...array, { value: -1, text: '', id: '#-2' }];
}

function _isLeapYear(year: number): boolean {
    // If a year is multiple of 400,
    // then it is a leap year
    if (year % 400 === 0) return true;

    // Else If a year is multiple of 100,
    // then it is not a leap year
    if (year % 100 === 0) return false;

    // Else If a year is multiple of 4,
    // then it is a leap year
    if (year % 4 === 0) return true;
    return false;
}

function _generateArray(limit: number) {
    return Array.from({ length: limit }, (_, i) => ({
        value: i + 1,
        text: ('0' + (i + 1)).slice(-2),
        id: `#${i + 1}`,
    }));
}

const getHourArray = (is24Hour: boolean) => _generateArray(is24Hour ? 24 : 12);

const getMinuteArray = () => _generateArray(60);

function getAmPmArray() {
    return ['AM', 'PM'].map((item, index) => ({
        value: index + 1,
        text: item,
        id: item,
    }));
}

function getYearArray(startYear: number, endYear: number) {
    const array = [];
    for (let i = startYear; i <= endYear; i++) {
        array.push({ value: i, text: `${i}`, id: `#${i}` });
    }
    return array;
}

function getMonthArray() {
    return [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ].map((month, index) => ({
        value: index,
        text: month,
        id: month,
    }));
}

const getDateArray = () => _generateArray(31);

const hour12Data = _addEmptySlots(getHourArray(false));
const hour24Data = _addEmptySlots(getHourArray(true));
const minuteData = _addEmptySlots(getMinuteArray());
const amPmData = _addEmptySlots(getAmPmArray());

const monthData = _addEmptySlots(getMonthArray());
const tempDateData = getDateArray();
const date31Data = _addEmptySlots(tempDateData);
const date30Data = _addEmptySlots(tempDateData.slice(0, 30));
const date29Data = _addEmptySlots(tempDateData.slice(0, 29));
const date28Data = _addEmptySlots(tempDateData.slice(0, 28));
