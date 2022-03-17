import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, SafeAreaView } from 'react-native';
import DateTimePicker from '@mohalla-tech/react-native-date-time-picker';

const App = () => {
    const initialDate = new Date(1950, 6, 15, 7, 30);
    const [datetime, setDatetime] = useState(initialDate);
    const [date, setDate] = useState(initialDate);
    const [time, setTime] = useState(initialDate);

    return (
        <SafeAreaView style={styles.view}>
            <ScrollView contentContainerStyle={styles.container} contentInset={{ top: 32 }}>
                <Text style={styles.text}>mode="datetime"</Text>
                <View style={styles.card}>
                    <DateTimePicker
                        mode="datetime"
                        onChange={setDatetime}
                        minimumDate={new Date(2022, 3, 2)}
                        maximumDate={new Date(2022, 4, 7)}
                    />
                </View>
                <View style={styles.divider} />

                <Text style={styles.text}>mode="date"</Text>
                <View style={styles.card}>
                    <DateTimePicker mode="date" onChange={setDate} />
                </View>
                <View style={styles.divider} />

                <Text style={styles.text}>mode="time"</Text>
                <View style={styles.card}>
                    <DateTimePicker
                        mode="time"
                        is24Hour={false}
                        initialValue={initialDate}
                        onChange={setTime}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: 'black',
    },
    container: {
        backgroundColor: 'black',
        justifyContent: 'center',
    },
    divider: {
        height: 1,
        width: '100%',
        backgroundColor: '#e1e1e1',
        marginVertical: 32,
    },
    text: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: 'white',
        padding: 24,
        margin: 16,
        marginTop: 56,
        borderRadius: 4,
    },
});

export default App;
