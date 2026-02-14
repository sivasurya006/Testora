import { Modal, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React from 'react'
import Colors from '../../../styles/Colors'


export default function ConfirmModal({ message, visible, onConfirm, onCancel, normal = false, confirmOnly = false }) {

  const { width } = useWindowDimensions();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      onDismiss={onCancel}
    >
      <View style={styles.container}>
        <View style={[styles.modalContent, { width: width > 861 ? "45%" : "85%" }]}  >
          <Text style={styles.messageText}>{message}</Text>

          <View style={[styles.options, !normal ? { flexDirection: 'row-reverse' } : null]}>

            {
              !confirmOnly ? (
                <Pressable
                  onPress={onCancel}
                  style={[styles.optionBtn, styles.cancelBtn]}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
              ) : null
            }


            <Pressable
              onPress={onConfirm}
              style={[styles.optionBtn, styles.confirmBtn]}
            >
              <Text style={styles.confirmText}>Confirm</Text>
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
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalContent: {
    backgroundColor: Colors.formBg,
    paddingHorizontal: 24,
    paddingVertical: 22,
    borderRadius: 12,
    alignItems: 'center',
    maxWidth: 400,
  },

  messageText: {
    fontSize: 16,
    color: Colors.charcoal,
    textAlign: 'center',
    marginBottom: 20,
  },

  options: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    width: '100%',
  },

  optionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 10,
  },

  confirmBtn: {
    backgroundColor: Colors.primaryColor,
  },

  cancelBtn: {
    backgroundColor: '#ddd',
  },

  confirmText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '600',
  },

  cancelText: {
    color: Colors.charcoal,
    fontSize: 15,
    fontWeight: '500',
  },
})
