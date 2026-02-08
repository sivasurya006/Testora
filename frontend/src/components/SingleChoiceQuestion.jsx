import { View, Text, StyleSheet, Pressable } from 'react-native'
import React, { useState } from 'react'
import { IconButton, Menu } from 'react-native-paper'
import Colors from '../../styles/Colors'
import QuestionRow from './QuestionRow';
import MenuDropdown from './MenuDropdown';

export default function SingleChoiceQuestion({mode,question,options,questionNumber,onEdit,onDelete}) {
    const [selected, setSelected] = useState(options.find((opt) => opt.isCorrect || null));
    const correctAnswer = options.find((opt) => opt.isCorrect )?.optionText || "Not given"


    if (mode === 'edit') {
        return (
            <View style={styles.container}>
                <QuestionRow onDelete={onDelete} onEdit={onEdit} question={question} questionNumber={questionNumber}/>
                <View style={styles.answerRow}>
                    <MenuDropdown options={options} selected={selected} setSelected={setSelected} backgroundColor={Colors.white}/>
                    <View>
                        <Text style={styles.correctAnswerLabel}>{"Correct answer : "}<Text style={styles.correctAnswerText}>{correctAnswer}</Text></Text>
                    </View>
                </View>
            </View>
        );
    }

    return <Text>Under Dev</Text>;
}


const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: Colors.white,
        marginVertical: 10,
        borderBottomWidth : 1,
        borderBottomColor : 'black'
    },
    answerRow :{
        gap : 20,
    },
    correctAnswerText : {
        color : 'green',
        fontWeight : 600,
        fontSize : 16
    },
    correctAnswerLabel : {
        fontWeight : 600,
        fontSize : 16
    }
});
