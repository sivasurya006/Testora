import { View, Text, StyleSheet, TextInput } from 'react-native'
import React, { useState } from 'react'
import Colors from '../../styles/Colors';
import QuestionRow from './QuestionRow';
import { AppBoldText, AppRegularText, AppSemiBoldText } from '../../styles/fonts';

export default function FillInBlankQuestion({ mode, question, options, questionNumber, setAllQuestions, allQuestions, selectedOptions }) {

    if (!question) return null;
    const blankAnswers = {};
    options?.forEach(opt => {
        console.log('option ', opt)
        const idx = opt.blankOptionProperties?.blankIdx;
        if (idx) {
            blankAnswers[idx] = {
                text: opt.optionText,
                mark: opt.optionMark
            };
        }
    });

    let blankCounter = 1;
    console.log("options ", options)
    console.log("blank answers ", blankAnswers)
    const questionWithAnswers = question.questionText.replace(/__BLANK__/g, () => {
        const answer = blankAnswers[blankCounter] || '';
        console.log("blank answer of " + blankCounter)
        blankCounter++;
        let answerText = " <b>" + answer.text + "</b> ";
        if (mode == 'grade'){
            answerText += `<small>${answer.mark}</small>`;
        }
        return answerText;
});

console.log("question with answers ", questionWithAnswers)

const [answers, setAnswers] = useState([]);

const parts = question?.questionText?.split("__BLANK__") || [];

const handleChange = (text, blankIdx) => {
    setAnswers(prev => ({
        ...prev,
        [blankIdx]: text
    }));
};

if (mode === 'edit') {
    return (
        <View style={styles.container}>
            <QuestionRow
                question={{ ...question, questionText: questionWithAnswers }}
                questionNumber={questionNumber}
                setAllTestQuestions={setAllQuestions}
                allQuestions={allQuestions}
            />

            <View style={styles.questionContainer}>
                {parts.map((part, index) => (
                    <React.Fragment key={index}>
                        <Text style={styles.questionText}>{part}</Text>

                        {index < parts.length - 1 && (
                            <TextInput
                                style={styles.blankInput}
                                value={answers[index + 1] || ""}
                                onChangeText={(text) =>
                                    handleChange(text, index + 1)
                                }
                                placeholder={`Blank ${index + 1}`}
                                placeholderTextColor={'gray'}
                            />
                        )}
                    </React.Fragment>
                ))}
            </View>
        </View>
    );
}


const writtenAnswers = selectedOptions?.length
    ? selectedOptions
        .map(opt => opt.answerPropertiesDto?.blankText || '----')
        .join(' , ')
    : '';
return (
    <>
        <QuestionRow
            question={{ ...question, questionText: questionWithAnswers }}
            questionNumber={questionNumber}
            mode={mode}
        />

        {
            mode !== 'preview' && (
                <View style={styles.yourAnswerContainer}>
                    <AppSemiBoldText style={styles.yourAnswerLabel}>
                        {mode == 'grade' ? 'Student' : 'Your'} Answers:
                    </AppSemiBoldText>

                    <AppRegularText style={styles.yourAnswerText}>
                        {writtenAnswers || 'No answer written'}
                    </AppRegularText>

                </View>
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
        flexWrap: 'wrap',
    },

    toolsRow: {
        flexDirection: 'row',
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
    },

    optionsText: {
        fontSize: 15,
    },

    correctAnswerText: {
        color: 'green',
        fontWeight: '600',
        fontSize: 16
    },

    correctAnswerLabel: {
        fontWeight: '600',
        fontSize: 16
    },

    questionContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        marginTop: 8
    },

    blankInput: {
        borderBottomWidth: 2,
        borderColor: "#ccc",
        minWidth: 100,
        padding: 4,
        marginHorizontal: 4,
        fontSize: 16
    },
    yourAnswerContainer: {
        marginTop: 12,
        padding: 12,
        backgroundColor: '#F4F6F8',
        borderRadius: 8,
        marginHorizontal: 10,
    },

    yourAnswerLabel: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 6,
    },

    yourAnswerText: {
        fontSize: 15,
        color: '#333',
        lineHeight: 22,
    },
});
