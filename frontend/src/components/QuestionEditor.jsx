import { View, Text, StyleSheet, Modal, Button, ScrollView, useWindowDimensions, Pressable } from 'react-native'
import React, { useState } from 'react'
import Colors from '../../styles/Colors'
import LabeledInput from './LabledInput'
import LabeledTextArea from './LabledTextArea'
import MenuDropdown from './MenuDropdown'
import { BooleanComponent, FillBlankComponent, MCQComponent, SingleComponent } from './OptionComponents';
import { Checkbox } from 'react-native-paper'


const options = [
    { optionText: 'Multi choice options', value: 'MCQ' },
    { optionText: 'Single choice', value: 'SINGLE' },
    { optionText: 'Boolean', value: 'BOOLEAN' },
    { optionText: 'Fill in the blanks', value: "FILL_BLANKS" },
    { optionText: 'Matching', value: "MATCHING" }
]

function getOptionIndex(type) {
    return options.findIndex(opt => opt.value === type);
}

// {
//     mode: "edit",
//     question: {
//         questionText: "What is React?",
//         marks: 5
//     },
//     options: [
//         { optionText: "A JavaScript library for building user interfaces", isCorrect: true },
//         { optionText: "A programming language", isCorrect: false },
//         { optionText: "A database", isCorrect: false },
//         { optionText: "An operating system", isCorrect: false }
//     ]
// },



export default function QuestionEditor({ onConfirm, onCancel, mode, defaultQuestion }) {

    console.log('default question ', defaultQuestion)

    const [giveOptionMarks, setGiveOptionMarks] = useState(false);
    const [selectedType, setSelectedType] = useState(mode === 'editQuestion' ?
        getOptionIndex(defaultQuestion.type) : options[0]);
    const [questionText, setQuestionText] = useState("");
    const [questionMark, setQuestionMark] = useState(0);
    const [questionOptions, setQuestionOptions] = useState([]);
    const [error, setError] = useState("");

    const { width } = useWindowDimensions();
    function validateInput() {
        setError("")
        if (questionText.trim() === "") {
            setError("Question text cannot be empty");
            return false;
        }
        if ((selectedType.value === 'MCQ' || selectedType.value === 'SINGLE') && questionOptions.length < 2) {
            setError("At least 2 options are required for MCQ and Single choice questions");
            return false;
        }
        if (questionOptions.filter(opt => opt.optionText.trim() !== "").length == 0) {
            setError("Option text cannot be empty");
            return false;
        }
        if ((selectedType.value === 'MCQ' || selectedType.value === 'SINGLE') && questionOptions.find(opt => opt.correct) === undefined) {
            setError("At least one correct option must be selected for MCQ and Single choice questions");
            return false;
        }
        if (questionOptions.find(opt => opt.correct) === undefined) {
            setError("At least one correct option must be selected");
            return false;
        }
        if (questionOptions.find(opt => opt.correct).optionText.trim() === "") {
            setError("Correct option text cannot be empty");
            return false;
        }
        if (selectedType.value === 'BOOLEAN' && questionOptions.find(opt => opt.correct) === undefined) {
            setError("Correct answer must be selected for Boolean questions");
            return false;
        }
        return true;
    }

    const isEditMode = mode === 'editQuestion';
    defaultQuestion = isEditMode ? defaultQuestion : {};
    return (
        <View style={[styles.modalContainer, width > 861 && { maxWidth: 800, margin: 'auto', width: '100%' }]}>
            <View style={styles.modalContent}>


                <View style={styles.modalHeader}>
                    <Text style={styles.modalHeadText} >{isEditMode ? 'Edit ' : "New "} Question</Text>
                </View>
                <View>
                    <View style={styles.questionTypeModal} >
                        <View style={{ justifyContent: 'space-between', flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                            <View>
                                <MenuDropdown options={options} backgroundColor={Colors.white} selected={selectedType} setSelected={setSelectedType} />
                            </View>
                            <LabeledInput onChangeText={setQuestionMark} label={'Marks : '} placeholder={'0'}
                                customInputStyles={{ width: 50 }}
                                inputType={'numeric'}
                                defaultValue={isEditMode ? String(defaultQuestion.marks) : "0"}
                            />
                        </View>
                    </View>
                    <View>
                        <LabeledTextArea onChangeText={setQuestionText} placeholder={'Type here'} label={'Question : '}
                            defaultValue={isEditMode ? defaultQuestion.questionText : ""}
                            isFillBlank={selectedType.value === 'FILL_BLANKS'} />
                    </View>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 30 }}
                        style={{ marginVertical: 10, maxHeight: 200 }}
                    >
                        {
                            (() => {
                                switch (selectedType.value) {
                                    case 'MCQ':
                                        return (
                                            <MCQComponent defaultOptions={defaultQuestion.options} options={questionOptions} setOptions={setQuestionOptions} giveOptionMarks={giveOptionMarks} />
                                        );
                                    case 'SINGLE':
                                        return (
                                            <SingleComponent  defaultOptions={defaultQuestion.options} options={questionOptions} setOptions={setQuestionOptions} giveOptionMarks={giveOptionMarks} />
                                        );
                                    case 'BOOLEAN':
                                        return (
                                            <BooleanComponent defaultOptions={defaultQuestion.options} options={questionOptions} setOptions={setQuestionOptions} giveOptionMarks={giveOptionMarks} />
                                        );
                                    default:
                                        return (
                                            <FillBlankComponent defaultOptions={defaultQuestion.options}  options={questionOptions} setOptions={setQuestionOptions} giveOptionMarks={giveOptionMarks} />
                                        );
                                }
                            })()
                        }
                    </ScrollView>
                    <View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Checkbox.Item
                                label="Give option marks"
                                status={giveOptionMarks ? 'checked' : 'unchecked'}
                                onPress={() => setGiveOptionMarks(!giveOptionMarks)}
                                color="blue"
                            />
                        </View>
                    </View>
                    {
                        error !== "" && (
                            <View>
                                <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
                            </View>
                        )
                    }
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 20, marginTop: 20, alignItems: 'center' }}>
                        <Pressable style={styles.cancelBtn} onPress={onCancel} >
                            <Text>Cancel</Text>
                        </Pressable>

                        <Pressable style={styles.addBtn} onPress={() => {
                            if (validateInput()) {
                                onConfirm({
                                    question: {
                                        questionText,
                                        marks: questionMark
                                    },
                                    questionType: selectedType.value,
                                    options: questionOptions.filter(opt => opt.optionText.trim() !== "")
                                })
                                onCancel();
                            }
                        }
                        }>
                            <Text style={{ color: Colors.white }}>{isEditMode ? 'Update ' : 'Add '} Question</Text>
                        </Pressable>
                    </View>
                </View>


            </View>

        </View>
    )
}


const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        elevation: 6,
    },
    modalHeader: {
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 10,
    },
    modalHeadText: {
        fontSize: 18,
        fontWeight: '600',
    },
    questionTypeModal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    modalContainer: {
        paddingHorizontal: 10,
    },
    cancelBtn: {
        backgroundColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        width: 100,
        alignItems: 'center',
    },
    addBtn: {
        backgroundColor: Colors.primaryColor,
        padding: 10,
        borderRadius: 5,
        width: 120,
        alignItems: 'center',
    },
});
