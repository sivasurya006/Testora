import { View, Text, StyleSheet, Pressable } from 'react-native'
import React, { useState } from 'react'
import { IconButton, Menu, RadioButton } from 'react-native-paper'
import Colors from '../../styles/Colors'
import QuestionRow from './QuestionRow';
import MenuDropdown from './MenuDropdown';
import { AppRegularText } from '../../styles/fonts';

export default function SingleChoiceQuestion({ mode, question, options, questionNumber, setAllQuestions, allQuestions, selectedOptions }) {
    const [selected, setSelected] = useState(options.find((opt) => opt.isCorrect || null));
    const correctAnswer = options.find((opt) => opt.isCorrect)?.optionText || "Not given"

    console.log("selectedOptions =================== ", selectedOptions)

    if (mode === 'edit') {
        return (
            <View style={styles.container}>
                <QuestionRow mode={'edit'} question={question} questionNumber={questionNumber} setAllTestQuestions={setAllQuestions} allQuestions={allQuestions} />
                <View style={styles.answerRow}>
                    <MenuDropdown options={options} selected={selected} setSelected={setSelected} backgroundColor={Colors.white} />
                    <View>
                        <Text style={styles.correctAnswerLabel}>{"Correct answer : "}<Text style={styles.correctAnswerText}>{correctAnswer}</Text></Text>
                    </View>
                </View>
            </View>
        );
    }


    const selectedId = selectedOptions?.[0]?.optionId;

    return (
        <>
            <QuestionRow
                question={{ ...question }}
                questionNumber={questionNumber}
                mode={mode}
            />

            {options.map((opt, i) => {
                const isSelected = selectedId === opt.optionId;
                const isCorrect = opt.correct;

                let status = 'unchecked';
                let color = 'white';

                if (isCorrect) {
                    status = 'checked';
                    color = 'green';
                }

                if (isSelected && !isCorrect) {
                    status = 'checked';
                    color = 'red';
                }

                return (
                    <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                        key={i}
                    >
                        <RadioButton
                            status={status}
                            color={color}
                        />

                        <AppRegularText style={[styles.optionText]}>
                            {opt.optionText}
                        </AppRegularText>

                        <AppRegularText style={{marginLeft : 'auto'}} >{opt.optionMark}</AppRegularText>
                    </View>
                );
            })}
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
        answerRow: {
            gap: 20,
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
