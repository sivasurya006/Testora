import { View, Text, StyleSheet, Pressable } from 'react-native'
import React, { useState } from 'react'
import { Checkbox, IconButton } from 'react-native-paper';
import Colors from '../../styles/Colors';
import QuestionRow from './QuestionRow';
import { AppRegularText } from '../../styles/fonts';

export default function McqQuestion({ mode, question, options, questionNumber, setAllQuestions, allQuestions, selectedOptions }) {

    const [checked, setChecked] = useState([]);


    console.log(" I am getting question  ", question)

    const toggle = (opt) => {
        if (checked.includes(opt)) {
            return checked.filter(it => it !== opt);
        }
        return [...checked, opt];
    };

    if (mode === 'edit') {

        let correctAnswer = options.filter(opt => opt.isCorrect).map(opt => opt.optionText).join(", ");

        return (
            <View style={styles.container}>
                <QuestionRow question={question} questionNumber={questionNumber} setAllTestQuestions={setAllQuestions} allQuestions={allQuestions} />
                <View style={styles.optionsList}>
                    {options.map((opt, i) => {
                        const isChecked = checked.includes(opt);
                        return (
                            <View style={styles.optionContainer} key={i}>
                                <Checkbox
                                    status={isChecked ? 'checked' : 'unchecked'}
                                    onPress={() => setChecked(toggle(opt))}
                                />
                                <Text
                                    style={[styles.optionsText]}
                                >{opt.optionText}</Text>
                            </View>
                        );
                    })}
                </View>
                <View>
                    <Text style={styles.correctAnswerLabel}>{"Correct answer : "}<Text style={styles.correctAnswerText}>{correctAnswer}</Text></Text>
                </View>
            </View>
        );
    }
    const selectedIds = selectedOptions?.map(o => o.optionId) || [];

    return (
        <>
            <QuestionRow
                question={{ ...question }}
                questionNumber={questionNumber}
                mode={mode}
            />

            <View style={styles.optionsList}>
                {question.options.map((opt, i) => {
                    const isSelected = selectedIds.includes(opt.optionId);
                    const isCorrect = opt.correct;

                    let status = 'unchecked';
                    let color = undefined;

                    if (isCorrect) {
                        status = 'checked';
                        color = Colors.green;
                    }

                    if (isSelected && !isCorrect) {
                        status = 'checked';
                        color = 'red';
                    }

                    return (
                        <View style={styles.optionContainer} key={i}>
                            <Checkbox
                                status={status}
                                color={color}
                            />
                            <AppRegularText style={[styles.optionsText]}>
                                {opt.optionText}
                            </AppRegularText>
                            <AppRegularText style={{ marginLeft: 'auto' }} >{opt.optionMark}</AppRegularText>
                        </View>
                    );
                })}
            </View>
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
