import { Text, StyleSheet, TextInput } from 'react-native';
import React from 'react';

export default function LabeledTextArea({label, placeholder, onChangeText, numberOfLines = 1, customInputStyles, 
  customTextStyles,isFillBlank = false,
  defaultValue
  }) {
  return (
    <>
      <Text style={[styles.label, customTextStyles]}>
        {label}
      </Text>
      <TextInput
        style={[styles.textArea,customInputStyles]}
        multiline={true}
        onChangeText={text => onChangeText(text)}
        numberOfLines={numberOfLines}
        placeholder={placeholder}
        defaultValue={defaultValue}
      />
    </>
  );
}

const styles = StyleSheet.create({
  textArea: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    height : 50
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 600,
    marginBottom : 15
  },

 
});
