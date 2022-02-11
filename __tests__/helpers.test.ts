import { getData, numberOfDaysIn } from '../src/helpers';

describe('helpers.ts', () => {
    describe('numberOfDaysIn()', () => {
        test.each`
            month | year    | expected
            ${1}  | ${2022} | ${31}
            ${2}  | ${2022} | ${28}
            ${2}  | ${1996} | ${29}
            ${3}  | ${2022} | ${31}
            ${4}  | ${2022} | ${30}
            ${5}  | ${2022} | ${31}
            ${6}  | ${2022} | ${30}
            ${7}  | ${2022} | ${31}
            ${8}  | ${2022} | ${31}
            ${9}  | ${2022} | ${30}
            ${10} | ${2022} | ${31}
            ${11} | ${2022} | ${30}
            ${12} | ${2022} | ${31}
        `('returns $expected when month=$month year=$year', ({ month, year, expected }) => {
            expect(numberOfDaysIn(month, year)).toBe(expected);
        });
    });

    describe('getData()', () => {
        test('Get correct Date array for 31 Days', () => {
            expect(getData('date', 0, { numberOfDays: 31 })).toMatchSnapshot();
        });

        test('Get correct Date array for 30 Days', () => {
            expect(getData('date', 0, { numberOfDays: 30 })).toMatchSnapshot();
        });

        test('Get correct Date array for 29 Days', () => {
            expect(getData('date', 0, { numberOfDays: 29 })).toMatchSnapshot();
        });

        test('Get correct Date array for 28 Days', () => {
            expect(getData('date', 0, { numberOfDays: 28 })).toMatchSnapshot();
        });

        test('Get correct Month array', () => {
            expect(getData('date', 1)).toMatchSnapshot();
        });

        test('Get default Year array', () => {
            expect(getData('date', 2)).toMatchSnapshot();
        });

        test('Get Year array between a range', () => {
            const startYear = 2000;
            const endYear = 2010;
            expect(getData('date', 2, { startYear, endYear })).toMatchSnapshot();
        });

        test('Get Hour array for 24-hour-format', () => {
            const is24Hour = true;
            expect(getData('time', 0, { is24Hour })).toMatchSnapshot();
        });

        test('Get Minute array for 24-hour-format', () => {
            const is24Hour = true;
            expect(getData('time', 1, { is24Hour })).toMatchSnapshot();
        });

        test('Get Hour array for 12-hour-format', () => {
            const is24Hour = false;
            expect(getData('time', 0, { is24Hour })).toMatchSnapshot();
        });

        test('Get Minute array for 12-hour-format', () => {
            const is24Hour = false;
            expect(getData('time', 1, { is24Hour })).toMatchSnapshot();
        });

        test('Get AmPM array for 12-hour-format', () => {
            const is24Hour = false;
            expect(getData('time', 2, { is24Hour })).toMatchSnapshot();
        });
    });
});
