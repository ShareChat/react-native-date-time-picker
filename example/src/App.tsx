import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, SafeAreaView } from 'react-native';
import DateTimePicker from 'react-native-date-time-picker';

const App = () => {
    const initialDate = new Date(1950, 6, 15, 7, 30);
    const [datetime, setDatetime] = useState(initialDate);
    const [date, setDate] = useState(initialDate);
    const [time, setTime] = useState(initialDate);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>mode="datetime"</Text>
            <View style={styles.card}>
                <DateTimePicker mode="datetime" onChange={setDatetime} />
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
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 32,
        flex: 1,
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
