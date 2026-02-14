import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import McqOptions from './McqOptions'
import SingleChoiceOptions from './SingleChoiceOptions'
import BooleanOption from './BooleanOptions'
import { fonts } from '../../../styles/fonts'
import { Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');


export default function QuestionView({ question, selectedAnswers, setSelectedAnswers }) {


    function onSelect(option) {

        if (question.type === 'MCQ') {
            const prevQues = selectedAnswers[question.questionId] || [];
            const exists = prevQues.find(o => o.optionId === option.optionId);
            let updated;
            if (exists) {
                updated = prevQues.filter(o => o.optionId !== option.optionId);
            } else {
                updated = [...prevQues, option];
            }

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
        <View style={styles.questionViewContainer}>
            {/* Question */}
            <View style={styles.questionContainer} >
                <Text style={styles.questionText}>{question.questionText}</Text>
            </View>

            {/* Options */}
            <View style={styles.optionContainer}>
                {
                    question.type === 'MCQ' ? (
                        <McqOptions onSelect={onSelect} selected={selectedAnswers[question.questionId] || []} options={question.options} />
                    ) : question.type === 'SINGLE' ? (
                        <SingleChoiceOptions onSelect={onSelect}  selected={selectedAnswers[question.questionId]} options={question.options} />
                    ) : (
                        <BooleanOption onSelect={onSelect} options={question.options}  selected={selectedAnswers[question.questionId]} />
                    )
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    questionViewContainer: {
        flex: 1,
        paddingTop: 130,
        // paddingHorizontal : 35
        // justifyContent : 'center'
        // marginVertical : 'auto'
        // width : '100%',
        // maxWidth : 400,
    },

    questionContainer: {
        width: '100%',
        maxWidth: 1000,
        alignSelf: 'center',        // centers container (web + mobile)
        paddingHorizontal: width < 600 ? 12 : 24,  // responsive padding
    }
    , optionContainer: {

    },
    questionText: {
        textAlign: 'center',
        fontSize: 25,
        fontWeight: 600,
        fontFamily: fonts.bold
    }
})