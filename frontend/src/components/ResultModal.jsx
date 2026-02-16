import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';  // Example for icon
import Colors from '../../styles/Colors';

export default function ResultModal({ isResultPageOpen, totalMarks, onExit }){
  return (
    <Modal
      visible={isResultPageOpen}
      transparent
      animationType="fade"
      onRequestClose={onExit}
      onDismiss={onExit}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Icon name="check-circle" size={30} color="white" />
            <Text style={styles.headerText}>Total Marks</Text>
          </View>
          <View style={styles.resultContainer}>
            <Text style={styles.totalMarksText}>{totalMarks}</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={onExit}>
            <Text style={styles.buttonText}>Back to home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.dimBg, 
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#28a745',  
    borderRadius: 10,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    color: 'white',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginBottom: 20,
  },
  totalMarksText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  button: {
    backgroundColor: '#ffffff',  
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    color: '#28a745', 
    fontWeight: 'bold',
  },
});

