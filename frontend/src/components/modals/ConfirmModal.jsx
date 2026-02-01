import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Colors from '../../../styles/Colors'

export default function ConfirmModal({ message, visible, onConfirm, onCancel }) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType='fade'
            onRequestClose={onCancel}
        >
            <View style={styles.container}>
                <View style={styles.modalContent}>
                    <View>
                        <Text style={styles.messageText}>{message}</Text>
                    </View>
                    <View style={styles.options}>
                        <Pressable onPress={onConfirm} style={[styles.optionBtn, styles.confirmBtn]}>
                            <Text style={styles.optionText}>Confirm</Text>
                        </Pressable>
                        <Pressable onPress={onCancel} style={[styles.optionBtn, styles.cancelBtn]}>
                            <Text style={styles.optionText}>Cancel</Text>
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
    modalContent : {
        backgroundColor : 'white',
        padding : 30,
        alignItems : 'center',
        justifyContent : 'center',
        borderRadius : 8,
        boxShadow : Colors.blackBoxShadow
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
    }
})