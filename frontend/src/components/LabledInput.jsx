import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const LabeledInput = ({ label, value, onChangeText, placeholder , customInputStyles , inputType }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input , customInputStyles]}
        onChangeText={onChangeText}
        value={value}
        placeholder={placeholder}
        inputMode={inputType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    flexDirection : 'row',
    alignItems : 'center'
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
});

export default LabeledInput;
