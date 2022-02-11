import React, { useState } from 'react';
import { View, Button, Modal, StyleSheet } from 'react-native';
import DateTimePicker from 'react-native-date-time-picker';

const App = () => {
    const [date, setDate] = useState(new Date(1950, 6, 15));
    const [mode, setMode] = useState<'date' | 'time'>('date');
    const [show, setShow] = useState(false);

    const onConfirm = (selectedDate: Date) => {
        setShow(false);
        setDate(selectedDate);
    };

    const showMode = (currentMode: 'date' | 'time') => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };

    const closeModal = () => {
        setShow(false);
    };

    return (
        <View style={styles.container}>
            <Button onPress={showDatepicker} title="Show date picker!" />
            <View style={styles.divider} />
            <Button onPress={showTimepicker} title="Show time picker!" />
            <Modal transparent animationType="slide" visible={show} onRequestClose={closeModal}>
                <View style={styles.centeredView}>
                    <View style={styles.card}>
                        <DateTimePicker
                            value={date}
                            mode={mode}
                            is24Hour={true}
                            onConfirm={onConfirm}
                            onClose={closeModal}
                        />
                    </View>
                </View>
            </Modal>
        </View>
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
        marginBottom: 32,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,.7)',
    },
    card: {
        backgroundColor: 'white',
        padding: 24,
        margin: 16,
        borderRadius: 4,
    },
});

export default App;
