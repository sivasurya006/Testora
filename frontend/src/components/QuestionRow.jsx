import { View, Text, StyleSheet } from 'react-native'
import { IconButton } from 'react-native-paper'

export default function QuestionRow({ question, onDelete, onEdit, questionNumber }) {
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
                <IconButton icon="delete" size={18} iconColor="red" onPress={onDelete} />
            </View>

            <Text style={styles.questionMark}>
                Marks {question.marks}
            </Text>
        </View>
    )
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