import { View, Text, StyleSheet, Platform, useWindowDimensions } from 'react-native'
import React from 'react'
import McqOptions from './McqOptions'
import SingleChoiceOptions from './SingleChoiceOptions'
import BooleanOption from './BooleanOptions'
import { fonts } from '../../../styles/fonts'

export default function QuestionView({ question, selectedAnswers, setSelectedAnswers }) {

    const { width } = useWindowDimensions();
    const isWeb = Platform.OS === 'web';

    function onSelect(option) {

        if (question.type === 'MCQ') {
            const prevQues = selectedAnswers[question.questionId] || [];
            const exists = prevQues.find(o => o.optionId === option.optionId);

            const updated = exists
                ? prevQues.filter(o => o.optionId !== option.optionId)
                : [...prevQues, option];

            setSelectedAnswers({
                ...selectedAnswers,
                [question.questionId]: updated
            });

        } else {
            setSelectedAnswers({
                ...selectedAnswers,
                [question.questionId]: option
            });
        }
    }

    return (
        <View style={[
            styles.questionViewContainer,
            isWeb && styles.webContainer
        ]}>

            {/* Question */}
            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>
                    {question.questionText}
                </Text>
            </View>

            {/* Options */}
            <View style={styles.optionContainer}>
                {
                    question.type === 'MCQ' ? (
                        <McqOptions
                            onSelect={onSelect}
                            selected={selectedAnswers[question.questionId] || []}
                            options={question.options}
                        />
                    ) : question.type === 'SINGLE' ? (
                        <SingleChoiceOptions
                            onSelect={onSelect}
                            selected={selectedAnswers[question.questionId]}
                            options={question.options}
                        />
                    ) : (
                        <BooleanOption
                            onSelect={onSelect}
                            options={question.options}
                            selected={selectedAnswers[question.questionId]}
                        />
                    )
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    questionViewContainer: {
        width: '100%',
        paddingVertical: 30,
        paddingHorizontal: 15,
    },

    webContainer: {
        maxWidth: 900,
        alignSelf: 'center',
        paddingHorizontal: 40,
    },

    questionContainer: {
        marginBottom: 30,
    },

    questionText: {
        textAlign: 'center',
        fontSize: 24,
        fontFamily: fonts.bold,
        lineHeight: 32,
    },

    optionContainer: {
        width: '100%',
    },
})
