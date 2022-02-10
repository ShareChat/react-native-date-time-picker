import React from 'react';
import { forwardRef, memo, MutableRefObject, useMemo, useRef } from 'react';
import { Animated, FlatList, Platform, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';

import type { ItemType } from './types';

const NUMBER_OF_ITEMS = 3;

type Props = {
    data: Array<ItemType>;
    selectedValue: MutableRefObject<number>;
    onChange?: ($index: number) => void;
    style?: ViewStyle;
    listItemStyle?: TextStyle;
    itemHeight: number;
};

const List = memo(
    forwardRef<FlatList, Props>(
        ({ data, itemHeight, selectedValue, onChange, style, listItemStyle }, ref) => {
            const scrollY = useRef(new Animated.Value(0)).current;
            const { flatListStyle, iosTextVerticalCenter, textStyle, dividerStyle } = useMemo(
                () => ({
                    flatListStyle: { height: itemHeight * NUMBER_OF_ITEMS },
                    iosTextVerticalCenter: { lineHeight: itemHeight },
                    textStyle: { height: itemHeight },
                    dividerStyle: { height: itemHeight, marginVertical: itemHeight },
                }),
                [itemHeight]
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

            return (
                <View style={[styles.container, style]}>
                    <Animated.FlatList
                        ref={ref}
                        data={data}
                        snapToInterval={itemHeight}
                        decelerationRate="fast"
                        showsVerticalScrollIndicator={false}
                        initialNumToRender={NUMBER_OF_ITEMS}
                        style={flatListStyle}
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
                                    onChange?.(value);
                                },
                            }
                        )}
                    />
                    <View pointerEvents="box-none" style={[styles.divider, dividerStyle]} />
                </View>
            );
        }
    )
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
