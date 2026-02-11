import { Modal, Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native'
import React from 'react'
import Colors from '../../../styles/Colors'

export default function InputModal({placeholder,onValueChange,visible,onConfirm,onCancel, defaultValue}) {

    const { width } =  useWindowDimensions();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      onDismiss={onCancel}
    >
      <View style={styles.container}>
      <View style={[styles.modalContent,{width : width > 861 ? "45%" : "85%"}]}  >
          <TextInput
            style={styles.inputBox}
            onChangeText={onValueChange}
            placeholder={placeholder}
            placeholderTextColor={Colors.shadeGray}
            defaultValue={defaultValue}
          />
          <View style={styles.options}>
            <Pressable
              style={[styles.optionBtn, styles.cancelBtn]}
              onPress={onCancel}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>

            <Pressable
              style={[styles.optionBtn, styles.confirmBtn]}
              onPress={onConfirm}
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
      paddingVertical: 20,
      borderRadius: 12,
      alignItems: 'center',
      maxWidth: 400,
    },
  
    inputBox: {
      width: '100%',
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Colors.shadeGray,
      color: Colors.charcoal,
      marginBottom: 16,
      backgroundColor: Colors.white,
    },
  
    options: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
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
  