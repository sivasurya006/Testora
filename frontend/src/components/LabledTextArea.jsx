import { StyleSheet, View } from 'react-native';
import React, { useRef } from 'react';
import { AppMediumText } from '../../styles/fonts';
import Colors from '../../styles/Colors';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';

export default function LabeledTextArea({label,placeholder,onChangeText,customInputStyles,customTextStyles,defaultValue}) {

  const richText = useRef();

  return (
    <View>
      <AppMediumText style={[styles.label, customTextStyles]}>
        {label}
      </AppMediumText>

      <View style={[styles.editorContainer, customInputStyles]}>
        <RichEditor
          ref={richText}
          initialContentHTML={defaultValue}
          placeholder={placeholder}
          editorStyle={{
            backgroundColor: "#fff",
            contentCSSText: "font-size: 14px;"
          }}
          onChange={(text) => onChangeText(text)}
        />
      </View>

      <RichToolbar
        editor={richText}
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.undo,
          actions.redo,
        ]}
        style={styles.toolbar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  editorContainer: {
    borderColor: Colors.borderColor,
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 150,
    marginBottom: 10,
    padding: 5,
  },
  toolbar: {
    borderColor: Colors.borderColor,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 15,
  },
});