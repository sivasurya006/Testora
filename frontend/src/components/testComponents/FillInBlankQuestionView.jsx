import React from "react";
import { TextInput, Text, View, Platform } from "react-native";
import { fonts } from "../../../styles/fonts";
// import { View } from "react-native-web";
import { useEffect } from "react";

export default function FillInBlankQuestionView({ question, selectedAnswers, setSelectedAnswers , preview = false}) {


    const options = question.options;
    console.log(" options ", options)

    console.log(selectedAnswers)


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        ['c', 'v', 'x', 'a'].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
        alert("Copy/Paste is disabled during the test");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

    useEffect(() => {
      if (Platform.OS !== 'web' || typeof document === 'undefined') return;
  
      const handleCopyPaste = (e) => {
        e.preventDefault();
      };
  
      const handleContextMenu = (e) => {
        e.preventDefault();
      };
  
      const handleKeyDown = (e) => {
        if ( ['c', 'v', 'x', 'a','i'].includes(e.key.toLowerCase())) {
          e.preventDefault();
        }
      };
  
      document.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('copy', handleCopyPaste);
      document.addEventListener('paste', handleCopyPaste);
      document.addEventListener('cut', handleCopyPaste);
  
      return () => {
        document.removeEventListener('contextmenu', handleContextMenu);
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('copy', handleCopyPaste);
        document.removeEventListener('paste', handleCopyPaste);
        document.removeEventListener('cut', handleCopyPaste);
      };
    }, []);

    /**
     * 
     * optionId
     * 
     */

    const textParts = question.questionText.split("__BLANK__");

    return (
        <View style={{ flexDirection: "row" }}>
            {textParts.map((part, index) => (
                <React.Fragment key={index}>
                    {part !== "" && (
                        <Text style={{
                            // textAlign: 'center',
                            fontSize: 24,
                            // fontFamily: fonts.bold,
                            lineHeight: 62,
                        }}>{part}
                            {index < textParts.length - 1 && (
                                <TextInput
                                    style={{
                                        borderBottomWidth: 2,
                                        minWidth: 60,
                                        marginHorizontal: 4,
                                        outlineWidth: 0,
                                        borderColor: 'green',
                                        fontSize: 20,
                                        paddingHorizontal: 10,
                                        fontFamily: fonts.regular,
                                        marginVertical: 10
                                    }}

                                    value={selectedAnswers[question.questionId]?.[index]?.blankOptionProperties?.blankText || ""}

                                    onChangeText={(txt) => {
                                        options[index].blankOptionProperties = {
                                            blankText: txt,
                                            blankIdx: index + 1
                                        }
                                        setSelectedAnswers({
                                            ...selectedAnswers,
                                            [question.questionId]: options.map((o, idx) => {
                                                if (idx == index) {
                                                    return {
                                                        ...o, blankOptionProperties: {
                                                            blankText: txt,
                                                            blankIdx: index + 1
                                                        }
                                                    }
                                                }
                                                return o;
                                            })

                                        })
                                    }}
                                />
                            )}

                        </Text>
                    )}


                </React.Fragment>
            ))}
        </View>
    );
}
