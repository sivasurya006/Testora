import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Modal } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import FillInBlankQuestion from '../components/FillIntheBlankQuestion'
import MatchingQuestion from '../components/MatchingQuestion'
import McqQuestion from '../components/McqQuestion'
import SingleChoiceQuestion from '../components/SingleChoiceQuestion'
import BooleanQuestion from '../components/BooleanQuestion'
import Colors from '../../styles/Colors'
import { AppBoldText } from '../../styles/fonts'
import { AntDesign } from '@expo/vector-icons'

export default function GradeScreen({ questions, isGradeScreenOpen, onExit }) {


    console.log('Grade Screen questions ', questions)

    return (
        <Modal
            visible={isGradeScreenOpen}
            animationType="fade"
            onRequestClose={onExit}
            onDismiss={onExit}
        >
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <AppBoldText style={styles.topHeaderText}>
                        Answer Sheet
                    </AppBoldText>

                    <TouchableOpacity onPress={onExit} style={styles.closeButton}>
                        <AntDesign name="close" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <ScrollView style={{
                    flex: 1,
                    maxWidth: 1200,
                    width: '100%',
                    boxShadow: Colors.blackBoxShadow,
                    marginHorizontal: 10,
                    elevation: 6,
                    borderRadius: 8,
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    backgroundColor: Colors.white,
                }}>
                    {
                        questions?.map((ques, index) => (
                            <View key={ques.id} style={{ margin: 20 }}>
                                {
                                    getQuestion(ques, index + 1)
                                }
                            </View>
                        ))
                    }
                </ScrollView>
            </View>
        </Modal >
    )
}


function getQuestion(item, index) {
    switch (item.type) {
        case 'SINGLE':
            return (
                <SingleChoiceQuestion
                    mode="report"
                    question={item}
                    options={item.options}
                    questionNumber={index}
                    selectedOptions={item.selectedOptions}
                />
            );
        case "MCQ":
            return (
                <McqQuestion
                    mode="report"
                    question={item}
                    options={item.options}
                    questionNumber={index}
                    selectedOptions={item.selectedOptions}
                />
            )
        case 'BOOLEAN': {
            return (
                <BooleanQuestion
                    mode="report"
                    question={item}
                    options={item.options}
                    questionNumber={index}
                    selectedOptions={item.selectedOptions}

                />
            )
        }
        case "FILL_BLANK": {
            return (
                <FillInBlankQuestion
                    mode="report"
                    question={item}
                    options={item.options}
                    questionNumber={index}
                    selectedOptions={item.selectedOptions}
                />
            )
        }
        case "MATCHING": {
            return (
                <MatchingQuestion
                    mode="report"
                    question={item}
                    options={item.options}
                    questionNumber={index}
                    selectedOptions={item.selectedOptions}
                />
            )
        }
        default:
            return null;
    }
}


const styles = StyleSheet.create({
    container: {
        userSelect: 'none',
        backgroundColor: Colors.bgColor,
        padding: 20,
        flex: 1,
        alignItems: 'center',

    },
    topHeaderText: {
        fontSize: 28,
        textAlign: 'center',
        // margin: 10,
    },
    totalMark: {
        fontSize: 24,
        color: 'black'
    },
    modalContainer: {
        width: 300,
        padding: 20,
        // backgroundColor: '#009B4D',
        borderRadius: 10,
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        // marginBottom: 20,
    },
    headerText: {
        fontSize: 20,
        color: 'white',
        marginLeft: 10,
        fontWeight: 'bold',
    },
    resultContainer: {
        // marginBottom: 20,
    },
    totalMarksText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white',
    },
    button: {
        backgroundColor: '#ffffff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 16,
        color: '#28a745',
        fontWeight: 'bold',
    },
    headerContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginBottom: 20,
    },

    closeButton: {
        position: 'absolute',
        right: 0,
    },
    statCard: {
        width: 150,
        minHeight: 100,
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

    statLabel: {
        color: 'white',
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
    },

    statValue: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 5,
        textAlign: 'center',
    },
    reportContainer: {
        flexDirection: 'row',
        backgroundColor: '#F1F3F6',
        borderRadius: 16,
        paddingVertical: 25,
        marginVertical: 20,
        borderWidth: 1,
        borderColor: '#E0E6ED',
        alignItems: 'center',
        width: '100%',
        maxWidth: 1200,
    },

    reportItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    reportTitle: {
        fontSize: 12,
        letterSpacing: 1,
        color: '#7B8794',
        marginBottom: 8,
    },

    reportNumber: {
        fontSize: 28,
        color: '#1F2933',
    },

    lightText: {
        fontSize: 16,
        color: '#9AA5B1',
    },

    line: {
        width: 1,
        height: '60%',
        backgroundColor: '#D6DDE6',
    },
})