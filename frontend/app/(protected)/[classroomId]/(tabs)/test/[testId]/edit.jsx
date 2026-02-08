import { View, Text, Pressable, StyleSheet, FlatList } from 'react-native'
import React, { useState } from 'react'
import Colors from '../../../../../../styles/Colors';
import QuestionEditor from '../../../../../../src/components/QuestionEditor';
import { Modal, Portal } from 'react-native-paper'
import SingleChoiceQuestion from '../../../../../../src/components/SingleChoiceQuestion';
import McqQuestion from '../../../../../../src/components/McqQuestion';


// {
//     "marks": 5,
//     "options": [
//         {
//             "correct": false,
//             "optionId": 11,
//             "optionMark": 1,
//             "optionText": "Programming language"
//         },
//         {
//             "correct": false,
//             "optionId": 12,
//             "optionMark": 0,
//             "optionText": "Database"
//         }
//     ],
//     "questionText": "What is Java?",
//     "type": "MCQ"
// }


export default function Edit() {

    const [allQuestions, setAllQuestions] = useState([]);

    const [isAddQuesModalVisible, setAddQuesModalVisible] = useState(false);
    const openAddQuesModal = () => setAddQuesModalVisible(true);
    const closeAddQuesModal = () => setAddQuesModalVisible(false);

    function addQuestion(question) {
        setAllQuestions([...allQuestions, question])
        console.log(question)
    }

    function deleteQuestion(question) {
        setAllQuestions(allQuestions.filter(ques => ques !== question));
    }

    return (
        <View style={styles.container}>
            <View style={styles.questionPaper}>
                {
                    allQuestions.length == 0 ? (
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                            <Pressable onPress={openAddQuesModal}>
                                <Text>Create New Question</Text>
                            </Pressable>
                        </View>
                    ) : (
                        <FlatList
                            data={allQuestions}
                            keyExtractor={(item, index) => index}
                            renderItem={({ item, index }) => {
                                switch (item.questionType) {
                                    case 'SINGLE':
                                        return (
                                            <SingleChoiceQuestion
                                                mode="edit"
                                                question={item.question}
                                                options={item.options}
                                                questionNumber={index + 1}
                                                onEdit={openAddQuesModal}
                                                onDelete={openAddQuesModal}
                                            />
                                        );
                                    case "MCQ":
                                        return (
                                            <McqQuestion
                                                mode="edit"
                                                question={item.question}
                                                options={item.options}
                                                questionNumber={index + 1}
                                                onEdit={openAddQuesModal}
                                                onDelete={openAddQuesModal}
                                            />
                                        )
                                    default:
                                        return null;
                                }
                            }}
                            showsVerticalScrollIndicator={false}
                        />
                    )
                }
                <Pressable
                    style={styles.addNew}
                    onPress={openAddQuesModal}
                >
                    <Text style={styles.addNewText}>+</Text>
                </Pressable>
            </View>
            {
                isAddQuesModalVisible ? (
                    <Portal>
                        <Modal
                            visible={isAddQuesModalVisible}
                            transparent
                            animationType='fade'
                            onRequestClose={closeAddQuesModal}
                            onDismiss={closeAddQuesModal}
                        >
                            <QuestionEditor onCancel={closeAddQuesModal} onConfirm={addQuestion} />
                        </Modal>
                    </Portal>
                ) : null
            }
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    questionPaper: {
        backgroundColor: Colors.white,
        flex: 1,
        elevation: 6,
        boxShadow: Colors.blackBoxShadow,
        width: "100%",
        borderRadius: 8,
        padding: 30
    },
    addNew: {
        position: 'absolute',
        right: 20,
        bottom: 30,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        boxShadow: Colors.blackBoxShadow
    },
    addNewText: {
        color: Colors.white,
        fontSize: 28,
        fontWeight: '900',
    },
})