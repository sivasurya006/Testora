import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import Colors from '../../../styles/Colors'

export default function InputModal({ placeholder, onValueChange , visible, onConfirm, onCancel }) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType='fade'
            onRequestClose={onCancel}
        >
            <View style={styles.container}>
                <View style={styles.modalContent}>
                    <View style={{}}>
                        <TextInput style={styles.inputBox} onChangeText={onValueChange} placeholder={placeholder} />
                    </View>
                    <View style={styles.options}>
                        <Pressable style={[styles.cancelBtn,styles.optionBtn]} onPress={onCancel}>
                            <Text style={styles.optionText}>Cancel</Text>
                        </Pressable>
                        <Pressable style={[styles.confirmBtn,styles.optionBtn]} onPress={onConfirm}>
                            <Text style={styles.optionText}>Confirm</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        paddingHorizontal: 30,
        paddingVertical : 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        boxShadow: Colors.blackBoxShadow
    },
    options: {
        flexDirection: 'row'
    },
    optionText: {
        fontSize: 16
    },
    messageText: {
        fontSize: 16
    },
    optionBtn: {
        padding: 5,
        margin: 10
    },
    confirmBtn: {
        backgroundColor: 'green'
    },
    cancelBtn: {
        backgroundColor: 'red'
    },
    inputBox: {
        paddingVertical: 10,
        paddingHorizontal : 10,
        borderRadius: 8,
        width : 200,
        outlineWidth : 0,
        borderWidth : 1,
    }
})