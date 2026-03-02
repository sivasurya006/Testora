import { View, Text, StyleSheet, Platform, useWindowDimensions } from 'react-native'
import React from 'react'
import McqOptions from './McqOptions'
import SingleChoiceOptions from './SingleChoiceOptions'
import BooleanOption from './BooleanOptions'
import { fonts } from '../../../styles/fonts'
import RenderHTML from 'react-native-render-html'

export default function QuestionView({ question, selectedAnswers, setSelectedAnswers, preview = false }) {

    const { width } = useWindowDimensions();
    const isWeb = Platform.OS === 'web';

    function onSelect(option) {



        if (question.type === 'MCQ') {
            const prevQues = selectedAnswers[question.questionId] || [];
            const exists = prevQues.find(o => o.optionId === option.optionId);

            const updated = exists ? prevQues.filter(o => o.optionId !== option.optionId) : [...prevQues, option];

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


            <View style={styles.questionContainer}>
                <RenderHTML
                    contentWidth={Math.min(900, width - 48)}
                    source={{ html: question.questionText }}
                    baseStyle={styles.htmlText}
                />
            </View>


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
        paddingVertical: 8,
        paddingHorizontal: 6,
    },

    webContainer: {
        maxWidth: 940,
        alignSelf: 'center',
        paddingHorizontal: 16,
    },

    questionContainer: {
        justifyContent: 'center',
        marginBottom: 30,
    },

    questionText: {
        textAlign: 'center',
        fontSize: 24,
        // fontFamily: fonts.bold,
        lineHeight: 32,
    },

    optionContainer: {
        width: '100%',
    },
    htmlText: {
        fontSize: Platform.OS === 'web' ? 24 : 20,
        color: '#0F172A',
    },

})
