import React from "react";
import { TextInput, Text, View, Platform, useWindowDimensions, StyleSheet } from "react-native";
import { fonts } from "../../../styles/fonts";
// import { View } from "react-native-web";
import { useEffect } from "react";

export default function FillInBlankQuestionView({ question, selectedAnswers, setSelectedAnswers, preview = false }) {


    const options = question.options;

    // responsive sizing based on width
    const { width } = useWindowDimensions();
    const isWide = width >= 600;
    const fontSize = isWide ? 24 : 18;
    const inputFontSize = isWide ? 20 : 16;
    const inputMinWidth = isWide ? 120 : 60;




    // For Web only  
    useEffect(() => {
        if (Platform.OS != 'web') return;
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
            if (['c', 'v', 'x', 'a', 'i'].includes(e.key.toLowerCase())) {
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
        <View style={styles.container}>
            {textParts.map((part, index) => (
                <React.Fragment key={index}>
                    {part !== "" && (
                        <Text style={[styles.text, { fontSize }]}>{part}</Text>
                    )}

                    {index < textParts.length - 1 && (
                        <TextInput
                            style={[
                                styles.input,
                                { fontSize: inputFontSize, minWidth: inputMinWidth }
                            ]}
                            value={selectedAnswers[question.questionId]?.[index]?.blankOptionProperties?.blankText || ""}
                            onChangeText={(txt) => {
                                options[index].blankOptionProperties = {
                                    blankText: txt,
                                    blankIdx: index + 1
                                };
                                setSelectedAnswers({
                                    ...selectedAnswers,
                                    [question.questionId]: options.map((o, idx) => {
                                        if (idx == index) {
                                            return {
                                                ...o,
                                                blankOptionProperties: {
                                                    blankText: txt,
                                                    blankIdx: index + 1
                                                }
                                            };
                                        }
                                        return o;
                                    })
                                });
                            }}
                        />
                    )}
                </React.Fragment>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: 10
  },
  text: {
    lineHeight: 30,
    marginVertical: 4
  },
  input: {
    borderBottomWidth: 2,
    marginHorizontal: 4,
    outlineWidth: 0,
    borderColor: 'green',
    paddingHorizontal: 10,
    marginVertical: 10,
    fontFamily: fonts.regular
  }
});
