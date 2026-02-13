import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import McqOptions from './McqOptions'
import SingleChoiceOptions from './SingleChoiceOptions'
import BooleanOption from './BooleanOptions'
import { fonts } from '../../../styles/fonts'
import { Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');


export default function QuestionView({ question }) {
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
                        <McqOptions options={question.options} />
                    ) : question.type === 'SINGLE' ? (
                        <SingleChoiceOptions options={question.options} />
                    ) : (
                        <BooleanOption options={question.options} />
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
    ,optionContainer: {

    },
    questionText: {
        textAlign: 'center',
        fontSize: 25,
        fontWeight: 600,
        fontFamily: fonts.bold
    }
})