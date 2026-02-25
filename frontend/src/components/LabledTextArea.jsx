import { Text, StyleSheet, TextInput, Platform } from 'react-native';
import React, { useRef } from 'react';
import { AppBoldText, AppMediumText } from '../../styles/fonts';
import Colors from '../../styles/Colors';
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default function LabeledTextArea({ label, placeholder, onChangeText, numberOfLines = 2, customInputStyles,
  customTextStyles, isFillBlank = false,
  defaultValue
}) {

  return (
    <>
      <AppMediumText style={[styles.label, customTextStyles]}>
        {label}
      </AppMediumText>
      {
        Platform.OS != 'web' ? (
          <TextInput
            style={[styles.textArea, customInputStyles]}
            multiline={true}
            placeholderTextColor={'gray'}
            onChangeText={text => onChangeText(text)}
            numberOfLines={numberOfLines}
            placeholder={placeholder}
            defaultValue={defaultValue}
          />
        ) : (
          <CKEditor
            editor={ClassicEditor}
            data={defaultValue}
            config={{
              toolbar: [
                "bold",
                "italic",
                "underline",
                "bulletedList",
                "numberedList",
                "undo",
                "redo"
              ],
              removePlugins: [
                "Image",
                "ImageToolbar",
                "ImageUpload",
                "MediaEmbed",
                "Table",
                "CKFinder",
                "EasyImage"
              ]
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              onChangeText(data)
            }}
          />
        )
      }
    </>
  );
}

const styles = StyleSheet.create({
  textArea: {
    borderColor: Colors.borderColor,
    outlineColor: Colors.primaryColor,
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    height: 50
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    // fontWeight: 600,
    marginBottom: 15
  },


});
