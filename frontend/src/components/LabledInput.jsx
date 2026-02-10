import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const LabeledInput = ({ label, value, onChangeText, placeholder , customInputStyles , inputType , defaultValue }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input , customInputStyles]}
        onChangeText={text => onChangeText(text)}
        value={value}
        placeholder={placeholder}
        inputMode={inputType}
        defaultValue={defaultValue}
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
    borderRadius : 5
  },
});

export default LabeledInput;
