import { View, Text, StyleSheet, Pressable } from 'react-native'
import { IconButton, Modal, Portal } from 'react-native-paper'
import api from '../../util/api';
import { use, useState } from 'react';
import { useGlobalSearchParams } from 'expo-router';
import ConfirmModal from './modals/ConfirmModal';
import QuestionEditor from './QuestionEditor';

export default function QuestionRow({ question, questionNumber, setAllTestQuestions, allQuestions }) {

    const { classroomId } = useGlobalSearchParams();

    const [deleteLoading, setDeleteLoading] = useState(false);
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [ defaultQuestionDetails, setDefaultQuestionDetails] = useState(null);

    const closeEditModal = () => setEditModalVisible(false);

    async function handleEdit() {
        const details = await getQuestionDetails(classroomId, question.questionId);
        if (details) {
            setDefaultQuestionDetails(details);
            setEditModalVisible(true);
        }
    }



    async function editQuestionHandler(question) {
        const success = await editQuestion(makeQuestionPayload(question), classroomId, question.question.questionId);
        if (success) {
            setAllTestQuestions(allQuestions.map(q => {
                if (q.question.questionId == question.question.questionId) {
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
            <Text style={styles.questionText}>
                <Text style={styles.questionNumber}>
                    {`${questionNumber}. `}
                </Text>
                {question.questionText}
            </Text>

            <View style={styles.toolsRow}>
                <IconButton icon="pencil" size={18} onPress={handleEdit} />
                <Pressable onPress={() => setDeleteLoading(true)}>
                    <IconButton icon="delete" size={18} iconColor="red" />
                </Pressable>
            </View>

            <Text style={styles.questionMark}>
                Marks {question.marks}
            </Text>

            {
                deleteLoading ? (
                    <ConfirmModal
                        message={"Are you sure you want to delete this question?"}
                        visible={deleteLoading}
                        onConfirm={() => deleteQuestion(classroomId, question.questionId, allQuestions, setAllTestQuestions)} onCancel={() => setDeleteLoading(false)} />
                ) : null
            }
            {
                isEditModalVisible ? (
                    <Portal>
                        <Modal
                            visible={isEditModalVisible}
                            transparent
                            animationType='fade'
                            onRequestClose={closeEditModal}
                            onDismiss={closeEditModal}
                        >
                            <QuestionEditor mode={'editQuestion'} defaultQuestion={defaultQuestionDetails}  onCancel={closeEditModal} onConfirm={editQuestionHandler} />
                        </Modal>
                    </Portal>
                ) : null
            }

        </View>
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

async  function  editQuestion(question,classroomId, questionId) {
    try{
        const response = await api.patch(`/api/tests/editQuestion`, {
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
        console.error('Error fetching question details:', error);
    }
    return null;
}


function makeQuestionPayload(input) {
    return {
        id : input.question.questionId,
        marks: Number(input.question.marks),
        questionText: input.question.questionText,
        type: input.questionType,
        options: input.options.map((opt, index) => ({
            optionId: opt.optionId,
            optionText: opt.optionText,
            correct: opt.correct ? true : false,
            optionMark: opt.optionMark ? Number(opt.mark) : 0
        }))
    };
}


const styles = StyleSheet.create({
    questionRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    questionNumber: {
        fontWeight: '700',
    },
    questionText: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
        marginRight: 8,
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