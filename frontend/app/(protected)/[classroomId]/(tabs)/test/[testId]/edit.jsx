import { View, Text, Pressable, StyleSheet, Button, TextInput, FlatList } from 'react-native'
import React, { useState } from 'react'
import Colors from '../../../../../../styles/Colors';
import LabeledInput from '../../../../../../src/components/LabledInput';
import LabeledTextArea from '../../../../../../src/components/LabledTextArea';
import QuestionEditor from '../../../../../../src/components/QuestionEditor';
import { Modal } from 'react-native-paper'
import McqQuestion from '../../../../../../src/components/McqQuestion';
import SingleChoiceQuestion from '../../../../../../src/components/SingleChoiceQuestion';

let mcqDataArray = [
    {
        mode: "edit",
        question: {
            questionText: "What is React?",
            marks: 5
        },
        options: [
            { optionText: "A JavaScript library for building user interfaces", isCorrect: true },
            { optionText: "A programming language", isCorrect: false },
            { optionText: "A database", isCorrect: false },
            { optionText: "An operating system", isCorrect: false }
        ]
    },
    {
        mode: "edit",
        question: {
            questionText: "Who developed React?",
            marks: 5
        },
        options: [
            { optionText: "Facebook (Meta)", isCorrect: true },
            { optionText: "Google", isCorrect: false },
            { optionText: "Microsoft", isCorrect: false },
            { optionText: "Amazon", isCorrect: false }
        ]
    },
    {
        mode: "edit",
        question: {
            questionText: "What is JSX?",
            marks: 5
        },
        options: [
            { optionText: "A syntax extension for JavaScript", isCorrect: true },
            { optionText: "A database query language", isCorrect: false },
            { optionText: "A CSS framework", isCorrect: false },
            { optionText: "A JavaScript compiler", isCorrect: false }
        ]
    },
    {
        mode: "edit",
        question: {
            questionText: "Which hook is used for state management?",
            marks: 5
        },
        options: [
            { optionText: "useState", isCorrect: true },
            { optionText: "useEffect", isCorrect: false },
            { optionText: "useRef", isCorrect: false },
            { optionText: "useContext", isCorrect: false }
        ]
    },
    {
        mode: "edit",
        question: {
            questionText: "Which hook is used for side effects?",
            marks: 5
        },
        options: [
            { optionText: "useEffect", isCorrect: true },
            { optionText: "useState", isCorrect: false },
            { optionText: "useMemo", isCorrect: false },
            { optionText: "useCallback", isCorrect: false }
        ]
    },
    {
        mode: "edit",
        question: {
            questionText: "What is a React component?",
            marks: 5
        },
        options: [
            { optionText: "Reusable piece of UI", isCorrect: true },
            { optionText: "A database table", isCorrect: false },
            { optionText: "A server", isCorrect: false },
            { optionText: "A routing mechanism", isCorrect: false }
        ]
    },
    {
        mode: "edit",
        question: {
            questionText: "What is Virtual DOM?",
            marks: 5
        },
        options: [
            { optionText: "A lightweight copy of the real DOM", isCorrect: true },
            { optionText: "A browser API", isCorrect: false },
            { optionText: "A JavaScript engine", isCorrect: false },
            { optionText: "A CSS model", isCorrect: false }
        ]
    },
    {
        mode: "edit",
        question: {
            questionText: "Which method is used to render React to the DOM?",
            marks: 5
        },
        options: [
            { optionText: "ReactDOM.render()", isCorrect: true },
            { optionText: "renderComponent()", isCorrect: false },
            { optionText: "mount()", isCorrect: false },
            { optionText: "attach()", isCorrect: false }
        ]
    },
    {
        mode: "edit",
        question: {
            questionText: "Props in React are ____?",
            marks: 5
        },
        options: [
            { optionText: "Read-only", isCorrect: true },
            { optionText: "Mutable", isCorrect: false },
            { optionText: "Database values", isCorrect: false },
            { optionText: "CSS properties", isCorrect: false }
        ]
    },
    {
        mode: "edit",
        question: {
            questionText: "Which hook is used to access context?",
            marks: 5
        },
        options: [
            { optionText: "useContext", isCorrect: true },
            { optionText: "useReducer", isCorrect: false },
            { optionText: "useMemo", isCorrect: false },
            { optionText: "useState", isCorrect: false }
        ]
    }
];

// mcqDataArray = [];

export default function edit() {

    const [isAddQuesModalVisible, setAddQuesModalVisible] = useState(false);
    const openAddQuesModal = () => setAddQuesModalVisible(true);
    const closeAddQuesModal = () => setAddQuesModalVisible(false);

    return (
        <View style={styles.container}>
            <View style={styles.questionPaper}>
                {
                    mcqDataArray.length == 0 ? (
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                            <Pressable onPress={openAddQuesModal}>
                                <Text>Create New Question</Text>
                            </Pressable>
                        </View>
                    ) : (
                        <FlatList
                            data={mcqDataArray}
                            keyExtractor={(item, index) => index}
                            renderItem={({ item, index }) => (
                                <SingleChoiceQuestion
                                    mode={item.mode}
                                    question={item.question}
                                    options={item.options}
                                    questionNumber={index + 1}
                                    onEdit={openAddQuesModal}
                                    onDelete={openAddQuesModal}
                                />
                            )}
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
                    <Modal
                        visible={isAddQuesModalVisible}
                        transparent
                        animationType='fade'
                        onRequestClose={closeAddQuesModal}
                        contentContainerStyle={{
                            alignSelf: 'center'
                        }}
                    >
                      <QuestionEditor onCancel={closeAddQuesModal} />
                    </Modal>
                ) : null
            }
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        padding: 30,
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