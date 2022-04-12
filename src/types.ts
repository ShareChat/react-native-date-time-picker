export type Mode = 'date' | 'time' | 'datetime';

export type PossibleDaysInMonth = 31 | 30 | 29 | 28;

export type ItemType = { value: number | Date; text: string; id: string };

export type ListItemStyleType = { color?: string; backgroundColor?: string };

export enum ManualInputDefault {
    ShortDate = 'DD/MM',
    LongDate = 'DD/MM/YYYY',
    Time = 'HH:MM',
}
