import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native'
import { IconButton, Modal, Portal } from 'react-native-paper'
import api from '../../util/api';
import { use, useState } from 'react';
import { useGlobalSearchParams } from 'expo-router';
import ConfirmModal from './modals/ConfirmModal';
import QuestionEditor from './QuestionEditor';
import { AppBoldText, AppMediumText, fonts } from '../../styles/fonts';
import RenderHTML from 'react-native-render-html';
import Colors from '../../styles/Colors';

export default function QuestionRow({ question, questionNumber, setAllTestQuestions, allQuestions, mode }) {

    const { classroomId } = useGlobalSearchParams();
    const { width } = useWindowDimensions();

    const [deleteLoading, setDeleteLoading] = useState(false);
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [defaultQuestionDetails, setDefaultQuestionDetails] = useState(null);

    const closeEditModal = () => setEditModalVisible(false);

    async function handleEdit() {
        console.log(classroomId, question.questionId)
        const details = await getQuestionDetails(classroomId, question.questionId);
        console.log("details ", details)
        if (details) {
            setDefaultQuestionDetails(details);
            setEditModalVisible(true);
        }
    }



    async function editQuestionHandler(question) {

        console.log("Handler ==================================================== : ", question)

        const success = await editQuestion(makeQuestionPayload(question), classroomId, question.question.questionId);
        if (success) {
            setAllTestQuestions(allQuestions.map(q => {
                if (q.question.questionId == question.question.questionId) {

                    console.log("Question for update ", q.question.marks)

                    q.question = {
                        ...q.question,
                        questionText: question.question.questionText,
                        marks: Number(question.question.marks)
                    }
                    q.questionType = question.questionType;
                    q.options = question.options.map(opt => ({
                        ...opt,
                        optionId: opt.optionId,
                        optionText: opt.optionText,
                        isCorrect: opt.correct ? true : false,
                        mark: opt.mark ? String(opt.mark) : ""
                    }))
                }
                return q;
            }))
        }
    }


    return (
        <View style={styles.questionRow}>
            <View style={styles.questionContent}>
                <Text style={styles.questionNumber}>
                    {`Q${questionNumber  || ''}.  `}
                </Text>
                <View style={{ flex: 1 }}>
                    <RenderHTML
                        // contentWidth={width - 100}
                        source={{ html: question.questionText }}
                        baseStyle={styles.htmlText}
                    />
                </View>
            </View>

            {
                mode !== 'report' ? (
                    <View style={styles.toolsRow}>
                        <IconButton icon="pencil" size={18} onPress={handleEdit} />
                        <Pressable onPress={() => setDeleteLoading(true)}>
                            <IconButton icon="delete" size={18} iconColor="red" />
                        </Pressable>
                    </View>
                ) : null
            }



            {
                mode != 'report' &&
                //  (
                    // <View style={{ flexDirection: 'row', marginHorizontal : 10 , gap: 10, alignItems: 'center' }} >
                    //     <View style={{ backgroundColor: Colors.lightBadge, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 16 }}>
                    //         <AppMediumText style={{ color: Colors.primaryColor }} >Marks : {question.marks}</AppMediumText>
                    //     </View>
                    //     <View style={{ backgroundColor: Colors.lightBadge, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 16 }}>
                    //         <AppMediumText style={{ color: '#009B4D' }} >Scored : {question.givenMarks}</AppMediumText>
                    //     </View>
                    // </View>
                // ) :
                 (
                    <AppMediumText style={styles.questionMark}>
                        Marks {question.marks}
                    </AppMediumText>
                )
            }


            {
                deleteLoading ? (
                    <ConfirmModal
                        message={"Are you sure you want to delete this question?"}
                        visible={deleteLoading}
                        onConfirm={() => deleteQuestion(classroomId, question.questionId, allQuestions, setAllTestQuestions)} onCancel={() => setDeleteLoading(false)} />
                ) : null
            }
            {
                <Portal>
                    <Modal
                        visible={isEditModalVisible}
                        transparent
                        animationType='fade'
                        onRequestClose={closeEditModal}
                        onDismiss={closeEditModal}
                    >
                        <QuestionEditor mode={'editQuestion'} defaultQuestion={defaultQuestionDetails} onCancel={closeEditModal} onConfirm={editQuestionHandler} />
                    </Modal>
                </Portal>

            }

        </View >
    )
}


async function deleteQuestion(classroomId, questionId, allQuestions, setAllTestQuestions) {

    try {
        const response = await api.delete(`/api/tests/deleteQuestion`, {
            headers: {
                'X-ClassroomId': classroomId,
                'X-QuestionId': questionId,
            },
        });

        if (response.status === 200 && response.data.success) {
            console.log('Question deleted successfully');
            setAllTestQuestions(allQuestions.filter(q => q.question.questionId !== questionId));
        } else {
            console.error('Failed to delete question');
        }
    } catch (error) {
        console.error('Error deleting question:', error);
    }
}

async function editQuestion(question, classroomId, questionId) {
    try {
        const response = await api.patch(`/api/tests/updateQuestion`, {
            ...question
        }, {
            headers: {
                'X-ClassroomId': classroomId,
                'X-QuestionId': questionId,
            },
        });

        if (response.status === 200 && response.data.success) {
            console.log('Question edited successfully');
            return true;
        } else {
            console.error('Failed to edit question');
        }
    } catch (error) {
        console.error(error);
    }
    return false;
}


async function getQuestionDetails(classroomId, questionId) {
    try {
        const response = await api.get(`/api/tests/getQuestion`, {
            headers: {
                'X-ClassroomId': classroomId,
                'X-QuestionId': questionId,
            },
        });
        if (response.status === 200) {
            console.log('Question details fetched successfully');
            return response.data;
        } else {
            console.error('Failed to fetch question details');
        }
    } catch (error) {
        console.error(error);
    }
    return null;
}


function makeQuestionPayload(input) {
    console.log('Input ', input)
    return {
        id: input.question.questionId,
        marks: Number(input.question.marks),
        questionText: input.question.questionText,
        type: input.questionType,
        options: input.options.map((opt, index) => ({
            optionId: opt.optionId,
            optionText: opt.optionText,
            correct: opt.correct ? true : false,
            optionMark: opt.optionMark ? Number(opt.optionMark) : 0,
            ...(opt.blankOptionProperties ? {
                blankOptionProperties: { ...opt.blankOptionProperties }
            } : {}),
            ...(opt.matchingOptionProperties ? {
                matchingOptionProperties: { ...opt.matchingOptionProperties }
            } : {})
        }))
    };
}


const styles = StyleSheet.create({
    questionRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    questionContent: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'flex-start',
    },
    questionNumber: {
        fontWeight: '700',
        fontSize: 18,
        marginRight: 8,
        minWidth: 40,
    },
    questionText: {
        fontSize: 18,
        fontWeight: '600',
        flex: 1,
        marginRight: 8,
    },
    htmlText: {
        fontSize: 18,
        // fontWeight: '600',
        fontFamily: fonts.regular,
        flexWrap : 'wrap',
        maxWidth : 900,
        width : '100%'
    },
    toolsRow: {
        flexDirection: 'row',
        marginRight: 6,
    },
    questionMark: {
        fontSize: 14,
        fontWeight: '500',
        alignSelf: 'center',
    },
})