import { View, Text, StyleSheet, Pressable } from 'react-native'
import { IconButton } from 'react-native-paper'
import api from '../../util/api';
import { use, useState } from 'react';
import { useGlobalSearchParams } from 'expo-router';
import ConfirmModal from './modals/ConfirmModal';

export default function QuestionRow({ question, onDelete, onEdit, questionNumber  , setAllTestQuestions , allQuestions }) {

    const { classroomId } =  useGlobalSearchParams();

    const [ deleteLoading , setDeleteLoading] = useState(false);


    return (
        <View style={styles.questionRow}>
            <Text style={styles.questionText}>
                <Text style={styles.questionNumber}>
                    {`${questionNumber}. `}
                </Text>
                {question.questionText}
            </Text>

            <View style={styles.toolsRow}>
                <IconButton icon="pencil" size={18} onPress={onEdit} />
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
                    onConfirm={() => deleteQuestion(classroomId,question.questionId, allQuestions ,setAllTestQuestions)} onCancel={() => setDeleteLoading(false)} />
                ) : null
            }

        </View>
    )
}


async  function deleteQuestion(classroomId ,questionId, allQuestions ,setAllTestQuestions) {

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