import React from 'react';
import { memo, MutableRefObject, useMemo, useRef } from 'react';
import {
    Animated,
    FlatListProps,
    Platform,
    StyleSheet,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';

import type { ItemType, ListItemStyleType } from './types';

const NUMBER_OF_ITEMS = 3;

type CustomListItemStyleType = (ListItemStyleType & TextStyle) | undefined;

type Props = {
    data: Array<ItemType>;
    selectedValue: MutableRefObject<number | Date>;
    onChange: () => void;
    style?: ViewStyle;
    listItemStyle?: CustomListItemStyleType | CustomListItemStyleType[];
    itemHeight: number;
    initialScrollIndex: number;
    separatorColor?: string;
    flatListProps?: Partial<FlatListProps<ItemType>>;
};

const List = memo(
    ({
        data,
        itemHeight,
        selectedValue,
        onChange,
        initialScrollIndex,
        style,
        listItemStyle,
        separatorColor,
        flatListProps = {},
    }: Props) => {
        const scrollY = useRef(new Animated.Value(0)).current;
        const { flatListStyle, iosTextVerticalCenter, textStyle, dividerStyle } = useMemo(
            () => ({
                flatListStyle: { height: itemHeight * NUMBER_OF_ITEMS },
                iosTextVerticalCenter: { lineHeight: itemHeight },
                textStyle: { height: itemHeight },
                dividerStyle: {
                    height: itemHeight,
                    marginVertical: itemHeight,
                    ...(separatorColor ? { borderColor: separatorColor } : {}),
                },
            }),
            [itemHeight, separatorColor]
        );

        const calculateStyle = (i: number) => {
            const arr = new Array(data.length).fill(1);
            const mainStyle = 1;
            const secondaryStyle = 0.5;
            const opacity = scrollY.interpolate({
                inputRange: [...arr.map((_, index) => index * itemHeight)],
                outputRange: [
                    ...arr.map((_, index) => {
                        switch (i) {
                            case index + 1:
                                return mainStyle;
                            default:
                                return secondaryStyle;
                        }
                    }),
                ],
                extrapolate: 'clamp',
            }) as unknown as number;
            return { opacity };
        };

        const {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            data: _data,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            snapToInterval,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            decelerationRate,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            showsVerticalScrollIndicator,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            style: _style,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            initialScrollIndex: _initialScrollIndex,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            keyExtractor,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            renderItem,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            getItemLayout,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onScroll,
            ...rest
        } = flatListProps;

        return (
            <View style={[styles.container, style]}>
                <Animated.FlatList
                    data={data}
                    snapToInterval={itemHeight}
                    decelerationRate="fast"
                    showsVerticalScrollIndicator={false}
                    style={flatListStyle}
                    initialScrollIndex={initialScrollIndex}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={({ item, index }) => {
                        return (
                            <Animated.Text
                                style={[
                                    styles.text,
                                    textStyle,
                                    Platform.OS === 'android'
                                        ? styles.androidTextVerticalCenter
                                        : iosTextVerticalCenter,
                                    calculateStyle(index),
                                    listItemStyle,
                                ]}>
                                {item.text}
                            </Animated.Text>
                        );
                    }}
                    getItemLayout={(_, index) => ({
                        length: itemHeight,
                        offset: itemHeight * index,
                        index,
                    })}
                    onScroll={Animated.event(
                        [
                            {
                                nativeEvent: {
                                    contentOffset: {
                                        y: scrollY,
                                    },
                                },
                            },
                        ],
                        {
                            useNativeDriver: true,
                            listener: (e: any) => {
                                const index = Math.round(
                                    e.nativeEvent.contentOffset.y / itemHeight
                                );
                                const value = data[index + 1]?.value;
                                selectedValue.current = value;
                                onChange();
                            },
                        }
                    )}
                    {...rest}
                />
                <View pointerEvents="box-none" style={[styles.divider, dividerStyle]} />
            </View>
        );
    }
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    androidTextVerticalCenter: {
        textAlignVertical: 'center',
    },
    text: {
        color: 'black',
        textAlign: 'center',
    },
    divider: {
        position: 'absolute',
        width: '100%',
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderColor: '#131319',
    },
});

export default List;
