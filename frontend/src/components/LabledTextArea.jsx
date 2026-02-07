import { Text, StyleSheet, TextInput } from 'react-native';
import React from 'react';

export default function LabeledTextArea({label, placeholder, numberOfLines = 1, customInputStyles, customTextStyles,isFillBlank = false}) {
  return (
    <>
      <Text style={[styles.label, customTextStyles]}>
        {label}
      </Text>
      <TextInput
        style={[styles.textArea,customInputStyles]}
        multiline={true}
        numberOfLines={numberOfLines}
        placeholder={placeholder}
      />
    </>
  );
}

const styles = StyleSheet.create({
  textArea: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
  },

 
});
