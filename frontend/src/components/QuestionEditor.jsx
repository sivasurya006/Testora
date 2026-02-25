import { View, Text, StyleSheet, Modal, Button, ScrollView, useWindowDimensions, Pressable, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '../../styles/Colors'
import LabeledInput from './LabledInput'
import LabeledTextArea from './LabledTextArea'
import MenuDropdown from './MenuDropdown'
import { BooleanComponent, FillBlankComponent, MatchingComponents, MCQComponent, SingleComponent } from './OptionComponents';
import { Checkbox } from 'react-native-paper'
import { AppBoldText, AppMediumText, AppRegularText, AppSemiBoldText } from '../../styles/fonts'
import { AntDesign } from '@expo/vector-icons'
import MatchingQuestion from './MatchingQuestion'


const options = [
    { optionText: 'Multiple choices', value: 'MCQ' },
    { optionText: 'Single choice', value: 'SINGLE' },
    { optionText: 'True / False', value: 'BOOLEAN' },
    { optionText: 'Fill in the blanks', value: "FILL_BLANK" },
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

    // console.log('default question ', defaultQuestion)
if(Platform.OS != 'web') return null;
    const [giveOptionMarks, setGiveOptionMarks] = useState(false);
    const [selectedType, setSelectedType] = useState(mode === 'editQuestion' ?
        options[getOptionIndex(defaultQuestion.type)] : options[0]);
    const [questionText, setQuestionText] = useState("");
    const [questionMark, setQuestionMark] = useState(0);
    const [questionOptions, setQuestionOptions] = useState([]);
    const [error, setError] = useState("");
    const [textParts, setTextParts] = useState([]);
    const [makeAllCaseSensitive, setMakeAllCaseSensitive] = useState(false);

    console.log("==============> " + questionText)

    useEffect(() => {
        setQuestionText('');
    }, [selectedType])

    useEffect(() => {
        if (defaultQuestion && defaultQuestion.options && defaultQuestion.options.length > 0) {
            setGiveOptionMarks(defaultQuestion.options.some(opt => opt.optionMark && opt.optionMark > 0));
            setQuestionMark(defaultQuestion.marks);
            setQuestionText(defaultQuestion.questionText);
            if (defaultQuestion.type == "FILL_BLANK") {
                setTextParts(convertFillBlank(defaultQuestion))
                console.log("Setting text parts ", defaultQuestion.id)
            }
        }
    }, []);

    const addNewTextPart = () => {
        if (textParts[textParts.length - 1].type == 'text') {
            setError("Already a textPart added lastly.")
            setTimeout(() => {
                setError("")
            }, 3000)
            return
        }
        setTextParts([...textParts, { type: 'text', value: "" }])

    }

    const addNewBlankPart = () => {
        if (textParts[textParts.length - 1].type == 'blank') {
            setError("Already a Blank added lastly.")
            setTimeout(() => {
                setError("")
            }, 3000)
            return
        }
        setQuestionText(questionText + "__BLANK__")
        setTextParts([...textParts, {
            type: 'blank', value: "", idx: textParts.reduce((sum, tp) => {
                if (tp.type == 'blank') {
                    return sum + 1;
                }
                return sum
            }, 0) + 1, blankMark: 0, isCaseSensitive: false
        }])
    }


    const { width } = useWindowDimensions();
    function validateInput() {
        setError("")
        if (questionText.trim() === "") {
            setError("Question text cannot be empty");
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
        if (selectedType.value != 'MATCHING' && selectedType.value != 'FILL_BLANK' && questionOptions.find(opt => opt.correct) === undefined) {
            setError("At least one correct option must be selected");
            return false;
        }
        if (selectedType.value != 'MATCHING' && selectedType.value != 'FILL_BLANK' && questionOptions.find(opt => opt.correct).optionText.trim() === "") {
            setError("Correct option text cannot be empty");
            return false;
        }
        if (selectedType.value === 'BOOLEAN' && questionOptions.find(opt => opt.correct) === undefined) {
            setError("Correct answer must be selected for Boolean questions");
            return false;
        }
        return true;
    }

    console.log(textParts)

    const isEditMode = mode === 'editQuestion';
    defaultQuestion = isEditMode ? defaultQuestion : {};
    return (
        <View style={[styles.modalContainer, width > 861 && { maxWidth: 800, margin: 'auto', width: '100%' }]}>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <AntDesign name='question-circle' size={24} color={Colors.primaryColor} />
                    <AppBoldText style={styles.modalHeadText} >{isEditMode ? 'Edit ' : "New "} Question</AppBoldText>
                </View>
                <View>
                    <View style={styles.questionTypeModal} >
                        <View style={{ justifyContent: 'space-between', flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                            <View style={{ gap: 10 }}>
                                <AppSemiBoldText style={{ fontSize: 16 }} >Question type</AppSemiBoldText>
                                <MenuDropdown options={options} backgroundColor={Colors.bgColor} selected={selectedType} setSelected={setSelectedType} />
                            </View>
                            <LabeledInput onChangeText={setQuestionMark} label={'Marks'} placeholder={'0'}
                                customInputStyles={{ width: 50 }}
                                inputType={'numeric'}
                                defaultValue={isEditMode ? String(defaultQuestion.marks) : "0"}
                            />
                        </View>
                    </View>
                    <View style={{ marginVertical: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                            <AppSemiBoldText style={{ fontSize: 14 }} >Question prompt</AppSemiBoldText>
                            {selectedType.value === 'FILL_BLANK' && (
                                <View style={{ flexDirection: 'row', gap: 20 }}>
                                    <Pressable style={styles.addBlankBtn} onPress={addNewTextPart} >
                                        <AppRegularText style={{ color: Colors.white, fontWeight: '600' }}>+  Add TextPart</AppRegularText>
                                    </Pressable>
                                    <Pressable style={styles.addBlankBtn} onPress={addNewBlankPart} >
                                        <AppRegularText style={{ color: Colors.white, fontWeight: '600' }}>+  Add Blank</AppRegularText>
                                    </Pressable>
                                </View>
                            )
                            }
                        </View>
                        {
                            selectedType.value != 'FILL_BLANK' && (
                                <LabeledTextArea onChangeText={setQuestionText} placeholder={'Type here'} label={''}
                                    defaultValue={isEditMode ? defaultQuestion.questionText : questionText} />
                            )
                        }
                    </View>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 30 }}
                        style={{ marginVertical: 10, maxHeight: selectedType.value == "FILL_BLANK" ? 400 : 250 }}
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
                                            <SingleComponent defaultOptions={defaultQuestion.options} options={questionOptions} setOptions={setQuestionOptions} giveOptionMarks={giveOptionMarks} />
                                        );
                                    case 'BOOLEAN':
                                        return (
                                            <BooleanComponent defaultOptions={defaultQuestion.options} options={questionOptions} setOptions={setQuestionOptions} giveOptionMarks={giveOptionMarks} />
                                        );
                                    case 'FILL_BLANK':
                                        return (
                                            // <AppBoldText>Fill Blank</AppBoldText>
                                            <FillBlankComponent giveOptionMarks={giveOptionMarks} textParts={textParts}
                                                setTextParts={setTextParts} defaultTextParts={convertFillBlank(defaultQuestion)}
                                                questionText={questionText} setQuestionText={setQuestionText}
                                                setMakeAllCaseSensitive={setMakeAllCaseSensitive}
                                                makeAllCaseSensitive={makeAllCaseSensitive} />
                                        );
                                    default:
                                        return (
                                            <MatchingComponents defaultOptions={defaultQuestion.options} options={questionOptions} setOptions={setQuestionOptions} giveOptionMarks={giveOptionMarks} />
                                        )
                                }
                            })()
                        }
                    </ScrollView>
                    <View>
                        <View style={{ justifyContent: 'flex-end', flexDirection: 'row' }}>
                            {
                                selectedType.value == 'FILL_BLANK' && (
                                    <Checkbox.Item
                                        label="All case sensitive"
                                        status={makeAllCaseSensitive ? 'checked' : 'unchecked'}
                                        onPress={() => setMakeAllCaseSensitive(!makeAllCaseSensitive)}
                                        color="blue"
                                    />
                                )
                            }
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
                                <AppSemiBoldText style={{ color: 'red', textAlign: 'center' }}>{error}</AppSemiBoldText>
                            </View>
                        )
                    }
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 20, marginTop: 20, alignItems: 'center' }}>
                        <Pressable style={styles.cancelBtn} onPress={onCancel} >
                            <AppRegularText>Cancel</AppRegularText>
                        </Pressable>

                        <Pressable style={styles.addBtn} onPress={() => {
                            if (selectedType.value != "FILL_BLANK" && validateInput()) {
                                onConfirm({
                                    question: {
                                        questionText,
                                        marks: questionMark,
                                        ...(isEditMode && {
                                            questionId: defaultQuestion.id
                                        })
                                    },
                                    questionType: selectedType.value,
                                    options: questionOptions.filter(opt => opt.optionText.trim() !== "")
                                })
                                onCancel();
                            }
                            if (selectedType.value == 'FILL_BLANK') {

                                const questions = { ...makeBlankQuestionPayloadForUpdate(questionMark, textParts) };

                                onConfirm(isEditMode ? {
                                    ...questions,
                                    question: {
                                        ...questions.question,
                                        questionId: defaultQuestion.id
                                    }
                                } : makeBlankQuestionPayload(questionMark, textParts), false)
                                onCancel();
                            }
                        }
                        }>
                            <AppRegularText style={{ color: Colors.white }}>{isEditMode ? 'Update ' : 'Add '} Question</AppRegularText>
                        </Pressable>
                    </View>
                </View>


            </View>

        </View>
    )
}





// {
//     "marks": 0,
//     "questionText": "<p>New Question</p>",
//     "type": "FILL_BLANK",
//     "options": [
//         {
//             "optionText": "opt 1",
//             "correct": true,
//             "optionMark": 0,
//             "blankOptionProperties" : {
//                 "blankIdx" : 1,
//                 "isCaseSensitive" : false
//             }
//         },
//         {
//             "optionText": "opt2 ",
//             "correct": false,
//             "optionMark": 0,
//             "blankOptionProperties" : {
//                 "blankIdx" : 2,
//                 "isCaseSensitive" : false
//             }
//         }
//     ]
// }

function makeBlankQuestionPayload(mark, input) {

    const isLastIndexNeed = input[input.length - 1].type === "blank"

    console.log(" part.blankMark ", mark)

    const payload = {
        "marks": mark ? mark : 0,
        "questionText": input.filter(part => part.type == "text").map(part => part.value).join("__BLANK__"),
        "type": "FILL_BLANK",
        "options": input.filter(part => part.type == "blank").map(part => {
            return {
                "optionText": part.value,
                "optionMark": part.blankMark ? part.blankMark : 0,
                "blankOptionProperties": {
                    "blankIdx": part.idx,
                    "isCaseSensitive": part.isCaseSensitive
                }
            }
        })
    }

    if (isLastIndexNeed) {
        payload.questionText += "__BLANK__"
    }
    return payload
}

function makeBlankQuestionPayloadForUpdate(mark, input) {

    const isLastIndexNeed = input[input.length - 1].type === "blank"

    console.log(" part.blankMark ", mark)

    const payload = {
        question: {
            "marks": mark ? mark : 0,
            "questionText": input.filter(part => part.type == "text").map(part => part.value).join("__BLANK__"),
        },
        "options": input.filter(part => part.type == "blank").map(part => {
            return {
                "optionText": part.value,
                "optionMark": part.blankMark ? part.blankMark : 0,
                "optionId": part.optionId,
                "blankOptionProperties": {
                    "blankIdx": part.idx,
                    "isCaseSensitive": part.isCaseSensitive
                }
            }
        }),
        "questionType": "FILL_BLANK",
    }

    if (isLastIndexNeed) {
        payload.question.questionText += "__BLANK__"
    }
    return payload
}

function convertFillBlank(question) {
    if (question.type !== "FILL_BLANK") return [];

    const textParts = question.questionText.split("__BLANK__");
    const blanks = question.options;

    const result = [];

    for (let i = 0; i < textParts.length; i++) {
        if (textParts[i].trim() !== "" || i === 0) {
            result.push({
                type: "text",
                value: textParts[i]
            });
        }

        if (i < blanks.length) {
            const blankOption = blanks[i];
            const isCaseSensitive = blankOption.blankOptionProperties?.isCaseSensitive || false;
            const idx = blankOption.blankOptionProperties?.blankIdx || (i + 1);

            result.push({
                type: "blank",
                value: blankOption.optionText,
                idx: idx,
                blankMark: blankOption.optionMark || 0,
                isCaseSensitive: isCaseSensitive,
                optionId: blankOption.optionId
            });
        }
    }

    return result;
}


const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        elevation: 6,
        gap: 20,
        // width : 400,
        // maxWidth : 1000,
        // width : '100%',
        // flexShrink : 0
        // alignSelf : 'center'
    },
    modalHeader: {
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderColor,
        marginBottom: 10,
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalHeadText: {
        fontSize: 22,
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
        width: 170,
        alignItems: 'center',
    },
    addBlankBtn: {
        backgroundColor: Colors.primaryColor,
        padding: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
});
