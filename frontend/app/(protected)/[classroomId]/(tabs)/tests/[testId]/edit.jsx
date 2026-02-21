import { View, Text, Pressable, StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '../../../../../../styles/Colors';
import QuestionEditor from '../../../../../../src/components/QuestionEditor';
import { Modal, Portal } from 'react-native-paper'
import SingleChoiceQuestion from '../../../../../../src/components/SingleChoiceQuestion';
import McqQuestion from '../../../../../../src/components/McqQuestion';
import BooleanQuestion from '../../../../../../src/components/BooleanQuestion';
import api from '../../../../../../util/api';
import { useGlobalSearchParams } from 'expo-router';
import FillInBlankQuestion from '../../../../../../src/components/FillIntheBlankQuestion';
import MatchingQuestion from '../../../../../../src/components/MatchingQuestion';
import { AppRegularText } from '../../../../../../styles/fonts';


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

    const { classroomId, testId } = useGlobalSearchParams();

    const [allQuestions, setAllQuestions] = useState([]);
    const [isAddQuesModalVisible, setAddQuesModalVisible] = useState(false);
    const [hovered, setHovered] = useState(false);
    const openAddQuesModal = () => setAddQuesModalVisible(true);
    const closeAddQuesModal = () => setAddQuesModalVisible(false);

    async function addQuestion(question, constructPayload = true) {
        console.log('question to add ', question)
        const newQuestion = await createNewQuestion(constructPayload ? makeQuestionPayload(question) : question, classroomId, testId);
        console.log(newQuestion)
        if (!newQuestion) return;
        setAllQuestions([...allQuestions, makeResultToQuestion(newQuestion)]);
    }

    useEffect(() => {
        if (!testId) return
        const fetchQuestions = async function () {
            const questions = await getAllTestQuestion(classroomId, testId);
            // console.log( makeResultToQuestion(questions[questions.length-1]))
            setAllQuestions(questions.map(ques => makeResultToQuestion(ques)));
        }
        if (testId) {
            fetchQuestions();
        }
    }, [classroomId, testId]);

    return (
        <View style={styles.container}>
            <View style={styles.questionPaper}>
                {
                    allQuestions.length == 0 ? (
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                            <Pressable style={{ backgroundColor: Colors.primaryColor, padding: 16, borderRadius: 8 }} onPress={openAddQuesModal}>
                                <AppRegularText style={{ color: Colors.white }}  >Create New Question</AppRegularText>
                            </Pressable>
                        </View>
                    ) : (
                        <FlatList
                            data={allQuestions}
                            keyExtractor={(item, index) => index}
                            renderItem={({ item, index }) => {
                                // console.log(item.questionType)
                                switch (item.questionType) {
                                    case 'SINGLE':
                                        return (
                                            <SingleChoiceQuestion
                                                mode="edit"
                                                question={item.question}
                                                options={item.options}
                                                questionNumber={index + 1}
                                                setAllQuestions={setAllQuestions}
                                                allQuestions={allQuestions}
                                            />
                                        );
                                    case "MCQ":
                                        return (
                                            <McqQuestion
                                                mode="edit"
                                                question={item.question}
                                                options={item.options}
                                                questionNumber={index + 1}
                                                setAllQuestions={setAllQuestions}
                                                allQuestions={allQuestions}
                                            />
                                        )
                                    case 'BOOLEAN': {
                                        return (
                                            <BooleanQuestion
                                                mode="edit"
                                                question={item.question}
                                                options={item.options}
                                                questionNumber={index + 1}
                                                setAllQuestions={setAllQuestions}
                                                allQuestions={allQuestions}
                                            />
                                        )
                                    }
                                    case "FILL_BLANK": {
                                        return (
                                            <FillInBlankQuestion
                                                mode="edit"
                                                question={item.question}
                                                options={item.options}
                                                questionNumber={index + 1}
                                                setAllQuestions={setAllQuestions}
                                                allQuestions={allQuestions}
                                            />
                                        )
                                    }
                                    case "MATCHING": {
                                        return (
                                            <MatchingQuestion
                                                mode="edit"
                                                question={item.question}
                                                options={item.options}
                                                questionNumber={index + 1}
                                                setAllQuestions={setAllQuestions}
                                                allQuestions={allQuestions}
                                            />
                                        )
                                    }
                                    default:
                                        return null;
                                }
                            }}
                            showsVerticalScrollIndicator={false}
                        />
                    )
                }
                <Pressable
                    style={[styles.addNew, hovered && styles.hovered]}
                    onPress={openAddQuesModal}
                    onHoverIn={() => setHovered(true)}
                    onHoverOut={() => setHovered(false)}
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
        backgroundColor: Colors.bgColor,
    },
    questionPaper: {
        backgroundColor: Colors.bgColor,
        flex: 1,
        // width: "100%",
        paddingTop: 10,
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
    hovered: {
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
    },
})

async function getAllTestQuestion(classroomId, testId) {
    try {
        const result = await api.get('/api/tests/getTestQuestions', {
            headers: {
                "X-ClassroomId": classroomId,
                "X-TestId": testId
            }
        });

        if (result?.status == 200 && result.data) {
            console.log(result.data);
            console.log("questions fetched successfully");
            return result.data;
        } else {
            console.log("can't fetch questions");
            return [];
        }
    } catch (err) {
        console.log(err);
        return [];
    }
}
function makeResultToQuestion(result) {
    return {
        question: {
            questionId: result.id,
            questionText: result.questionText,
            marks: String(result.marks)
        },
        questionType: result.type,
        options: result.options.map(opt => {
            const option = {
                optionId: opt.optionId,
                optionText: opt.optionText,
                isCorrect: !!opt.correct,
                mark: opt.optionMark ? String(opt.optionMark) : ""
            };
            if (result.type === "FILL_BLANK" && opt.blankOptionProperties) {
                option.blankOptionProperties = opt.blankOptionProperties;
                // console.log("setting option properties ",option)
            }

            if (result.type === "MATCHING" && opt.matchingOptionProperties) {
                option.matchingOptionProperties = opt.matchingOptionProperties;
                // console.log("setting option properties ",option)
            }

            return option;
        })
    };
}

async function createNewQuestion(question, classroomId, testId) {
    try {
        const result = await api.post('/api/tests/createQuestion', { ...question }, {
            headers: {
                "X-ClassroomId": classroomId,
                "X-TestId": testId
            }
        })
        if (result?.status == 200) {
            console.log("question created successfully");
            console.log(result.data);
            return result.data;
        } else {
            console.log("can't create question");
        }
    }
    catch (err) {
        console.log(err);
    }
}


function makeQuestionPayload(input) {

    console.log('payload inp : ', input)

    const payload = {
        marks: Number(input.question.marks),
        questionText: input.question.questionText,
        type: input.questionType,
        options: input.options.map((opt) => ({
            optionText: opt.optionText,
            optionMark: opt.optionMark ? Number(opt.optionMark) : 0,
            ...(input.questionType === 'MATCHING'
                ? {
                    matchingOptionProperties: {
                        ...opt.matchingOptionProperties
                    }
                }
                : {
                    correct: !!opt.correct
                })
        }))
    };



    return payload
}
