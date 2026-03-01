import { View, Text, StyleSheet, Pressable, ScrollView, useWindowDimensions } from 'react-native'
import React, { useState } from 'react'
import { Checkbox, IconButton } from 'react-native-paper';
import Colors from '../../styles/Colors';
import QuestionRow from './QuestionRow';
import { TextInput as PaperInput } from "react-native-paper";
import { MCQComponent } from './OptionComponents';
import { AppRegularText, AppSemiBoldText } from '../../styles/fonts';

export default function MatchingQuestion({ mode, question, options, questionNumber, setAllQuestions, allQuestions, selectedOptions }) {
    const { width } = useWindowDimensions();
    const enableHorizontalScroll = (mode === 'report' || mode == 'grade' || mode == 'preview' || mode == 'edit') && width < 768;
    const sectionWrapperProps = enableHorizontalScroll
        ? {
            horizontal: true,
            showsHorizontalScrollIndicator: true,
            contentContainerStyle: styles.horizontalScrollContent
        }
        : {};

    if (mode === 'edit') {
        const editRows = (
            <View style={[styles.optionsList, enableHorizontalScroll && styles.matchingRowsContainer]}>
                {options.map((opt, i) => {
                    return (
                        <View key={i + ""} style={styles.matchingRow} >
                            <PaperInput
                                style={[styles.pairInput, styles.editPairInput]}
                                label={`Left pair ${i + 1}`}
                                mode='outlined'
                                value={opt.optionText}
                            />
                            <PaperInput
                                style={[styles.pairInput, styles.editPairInput]}
                                label={`right pair ${i + 1}`}
                                mode='outlined'
                                value={opt.matchingOptionProperties?.match}
                            />
                        </View>
                    );
                })}
            </View>
        );

        return (
            <ScrollView style={styles.container} contentContainerStyle={styles.containerContent}>
                <QuestionRow mode={'edit'} question={question} questionNumber={questionNumber} setAllTestQuestions={setAllQuestions} allQuestions={allQuestions} />
                {enableHorizontalScroll ? (
                    <ScrollView {...sectionWrapperProps}>
                        {editRows}
                    </ScrollView>
                ) : (
                    editRows
                )}
            </ScrollView>
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
            <ScrollView {...sectionWrapperProps}>
                <View style={enableHorizontalScroll ? styles.matchingRowsContainer : undefined}>
                    {options.map((opt, i) => {
                        return (
                            <View key={opt.optionId || i} style={styles.matchingRow} >
                                <PaperInput
                                    style={styles.pairInput}
                                    label={`Left pair ${i + 1}`}
                                    mode='outlined'
                                    value={opt.optionText}
                                    editable={false}
                                />
                                <PaperInput
                                    style={styles.pairInput}
                                    label={`right pair ${i + 1}`}
                                    mode='outlined'
                                    value={opt.matchingOptionProperties?.match}
                                    editable={false}
                                />
                                <AppRegularText style={styles.optionMarkText} >{opt.optionMark}</AppRegularText>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>

            {
                mode !== 'preview' && (
                    <>
                        <AppSemiBoldText>{mode == 'grade' ? 'Student' : 'Your'} Matchings :</AppSemiBoldText>
                        <ScrollView {...sectionWrapperProps}>
                            <View style={enableHorizontalScroll ? styles.matchingRowsContainer : undefined}>
                                {options.map((opt, i) => {
                                    const selected = selectedMap[opt.optionId];
                                    const userMatch = selected?.answerPropertiesDto?.match;

                                    return (
                                        <View
                                            key={opt.optionId}
                                            style={styles.matchingRow}
                                        >
                                            <PaperInput
                                                style={styles.pairInput}
                                                label={`Left pair ${i + 1}`}
                                                mode="outlined"
                                                value={opt.optionText}
                                                editable={false}
                                            />

                                            <PaperInput
                                                style={styles.pairInput}
                                                label={`Right pair ${i + 1}`}
                                                mode="outlined"
                                                value={userMatch}
                                                editable={false}
                                            />
                                        </View>
                                    );
                                })}
                            </View>
                        </ScrollView>
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
    containerContent: {
        paddingBottom: 16,
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
    },
    horizontalScrollContent: {
        paddingBottom: 6,
    },
    matchingRowsContainer: {
        minWidth: 620,
    },
    matchingRow: {
        flexDirection: 'row',
        columnGap: 20,
        marginVertical: 10,
        alignItems: 'center',
    },
    pairInput: {
        flex: 1,
    },
    editPairInput: {
        flexBasis: 0,
        minWidth: 250,
    },
    optionMarkText: {
        marginLeft: 'auto',
    }
});
