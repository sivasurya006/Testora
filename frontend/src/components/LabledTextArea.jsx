import React from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';
import { AppMediumText } from '../../styles/fonts';
import Colors from '../../styles/Colors';

let CKEditor = null;
let ClassicEditor = null;

// Only require on web
if (Platform.OS === 'web') {
  CKEditor = require('@ckeditor/ckeditor5-react').CKEditor;
  ClassicEditor = require('@ckeditor/ckeditor5-build-classic');
}

export default function LabeledTextArea({
  label,
  placeholder,
  onChangeText,
  numberOfLines = 2,
  customInputStyles,
  customTextStyles,
  defaultValue = '',
}) {
  return (
    <View style={{ marginBottom: 15 }}>
      <AppMediumText style={[styles.label, customTextStyles]}>
        {label}
      </AppMediumText>

      {Platform.OS !== 'web' ? (
        <TextInput
          style={[styles.textArea, customInputStyles]}
          multiline
          placeholderTextColor="gray"
          onChangeText={text => onChangeText(text)}
          numberOfLines={numberOfLines}
          placeholder={placeholder}
          defaultValue={defaultValue}
        />
      ) : CKEditor ? (
        <View style={[styles.ckEditorWrapper, customInputStyles]}>
          <CKEditor
            editor={ClassicEditor}
            data={defaultValue}
            config={{
              toolbar: [
                'bold',
                'italic',
                'underline',
                'bulletedList',
                'numberedList',
                'undo',
                'redo',
              ],
              removePlugins: [
                'Image',
                'ImageToolbar',
                'ImageUpload',
                'MediaEmbed',
                'Table',
                'CKFinder',
                'EasyImage',
              ],
            }}
            onChange={(event, editor) => {
              onChangeText(editor.getData());
            }}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  textArea: {
    borderColor: Colors.borderColor,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  ckEditorWrapper: {
    borderColor: Colors.borderColor,
    borderWidth: 1,
    borderRadius: 8,
    padding: 5,
    minHeight: 150,
  },
});