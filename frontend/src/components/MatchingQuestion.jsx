import { View, Text, StyleSheet, Pressable } from 'react-native'
import React, { useState } from 'react'
import { Checkbox, IconButton } from 'react-native-paper';
import Colors from '../../styles/Colors';
import QuestionRow from './QuestionRow';
import { TextInput as PaperInput } from "react-native-paper";
import { MCQComponent } from './OptionComponents';
import { AppRegularText, AppSemiBoldText } from '../../styles/fonts';

export default function MatchingQuestion({ mode, question, options, questionNumber, setAllQuestions, allQuestions, selectedOptions }) {

    if (mode === 'edit') {
        return (
            <View style={styles.container}>
                <QuestionRow question={question} questionNumber={questionNumber} setAllTestQuestions={setAllQuestions} allQuestions={allQuestions} />
                <View style={styles.optionsList}>
                    {options.map((opt, i) => {
                        return (
                            <View style={{ flexDirection: 'row', columnGap: 20, marginVertical: 10 }} >
                                <PaperInput
                                    label={`Left pair ${i + 1}`}
                                    mode='outlined'
                                    value={opt.optionText}
                                />
                                <PaperInput
                                    label={`right pair ${i + 1}`}
                                    mode='outlined'
                                    value={opt.matchingOptionProperties?.match}
                                />
                            </View>
                        );
                    })}
                </View>
            </View>
        );
    }

    const selectedMap =
        selectedOptions?.reduce((acc, item) => {
            acc[item.optionId] = item;
            return acc;
        }, {}) || {};

    return (
        <>
            <QuestionRow
                question={{ ...question }}
                questionNumber={questionNumber}
                mode={mode}
            />

            <AppSemiBoldText>Correct Matchings :</AppSemiBoldText>

            {options.map((opt, i) => {
                return (
                    <View style={{ flexDirection: 'row', columnGap: 20, marginVertical: 10 }} >
                        <PaperInput
                            label={`Left pair ${i + 1}`}
                            mode='outlined'
                            value={opt.optionText}
                            editable={false}
                        />
                        <PaperInput
                            label={`right pair ${i + 1}`}
                            mode='outlined'
                            value={opt.matchingOptionProperties?.match}
                            editable={false}
                        />
                        <AppRegularText style={{ marginLeft: 'auto' }} >{opt.optionMark}</AppRegularText>
                    </View>
                );
            })}

            {
                mode !== 'preview' && (
                    <>
                        <AppSemiBoldText>{mode == 'grade' ? 'Student' : 'Your'} Matchings :</AppSemiBoldText>

                        {options.map((opt, i) => {
                            const selected = selectedMap[opt.optionId];

                            const correctMatch = opt.matchingOptionProperties?.match;
                            const userMatch = selected?.answerPropertiesDto?.match;

                            const isCorrect = correctMatch === userMatch;

                            return (
                                <View
                                    key={opt.optionId}
                                    style={{ flexDirection: 'row', columnGap: 20, marginVertical: 10 }}
                                >
                                    <PaperInput
                                        label={`Left pair ${i + 1}`}
                                        mode="outlined"
                                        value={opt.optionText}
                                        editable={false}
                                    />

                                    <PaperInput
                                        label={`Right pair ${i + 1}`}
                                        mode="outlined"
                                        value={userMatch}
                                        editable={false}
                                    />
                                </View>
                            );
                        })}
                    </>
                )
            }
        </>
    );
}


const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: Colors.white,
        marginVertical: 5,
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
        borderRadius: 8,
        marginHorizontal: 10
    },

    questionRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    questionNumber: {
        fontWeight: '700',
    },
    questionText: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
        marginRight: 8,
    },
    toolsRow: {
        flexDirection: 'row',
        marginRight: 6,
    },
    questionMark: {
        fontSize: 14,
        fontWeight: '500',
        alignSelf: 'center',
    },
    optionsList: {
        marginTop: 8,
        marginBottom: 12,
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
    },
    optionsText: {
        fontSize: 15,
    },
    correctAnswerText: {
        color: 'green',
        fontWeight: 600,
        fontSize: 16
    },
    correctAnswerLabel: {
        fontWeight: 600,
        fontSize: 16
    }
});
