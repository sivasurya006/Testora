import { View, ScrollView, StyleSheet, Modal, TouchableOpacity, useWindowDimensions, Platform } from 'react-native'
import Colors from '../../styles/Colors'
import { AppBoldText, AppSemiBoldText} from '../../styles/fonts'
import McqQuestion from './McqQuestion'
import SingleChoiceQuestion from './SingleChoiceQuestion'
import FillInBlankQuestion from './FillIntheBlankQuestion'
import MatchingQuestion from './MatchingQuestion'
import BooleanQuestion from './BooleanQuestion';
import { AntDesign } from '@expo/vector-icons'

export default function DetailedTestReport({ isGradeScreenOpen, onExit, totalMarks, questions, noModal = false, isResultPageOpen }) {

    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    const isLargeScreen = width >= 1280;
    const contentMaxWidth = isLargeScreen ? 1320 : 1100;
    const horizontalPadding = isMobile ? 10 : isLargeScreen ? 28 : 18;
    const questionGap = isMobile ? 10 : 16;

    const numberOfQuestion = questions?.length;
    const correctQuestions = questions?.reduce((sum, question) => {
        const selectedOptionIsCorrect = question.selectedOptions?.some(
            option => option.correct 
        );
        return (question.givenMarks > 0 || selectedOptionIsCorrect) ? sum + 1 : sum;
    }, 0) || 0;
    const scorePercentage = numberOfQuestion > 0
        ? Math.floor((correctQuestions / numberOfQuestion) * 100)
        : 0;

    function renderComponent() {
        return (
            <View style={[styles.container, { paddingHorizontal: horizontalPadding, paddingTop: isMobile ? 10 : 18 }]}>
                <View style={[styles.headerContainer, { maxWidth: contentMaxWidth }]}>
                    <AppBoldText style={styles.topHeaderText}>
                        Test Report
                    </AppBoldText>

                    <TouchableOpacity onPress={onExit} style={styles.closeButton}>
                        <AntDesign name="close" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <View
                    style={[
                        styles.reportContainer,
                        {
                            maxWidth: contentMaxWidth,
                            flexDirection: isMobile ? 'column' : 'row',
                            paddingVertical: isMobile ? 14 : 22,
                            paddingHorizontal: isMobile ? 10 : 16,
                            gap: isMobile ? 10 : 0,
                        }
                    ]}
                >
                    <View style={styles.reportItem}>
                        <AppSemiBoldText style={styles.reportTitle}>
                            TOTAL MARKS
                        </AppSemiBoldText>
                        <AppBoldText style={styles.reportNumber}>
                            {totalMarks}
                        </AppBoldText>
                    </View>
                    {!isMobile && <View style={styles.line} />}
                    <View style={styles.reportItem}>
                        <AppSemiBoldText style={styles.reportTitle}>
                            SCORE PERCENTAGE
                        </AppSemiBoldText>
                        <AppBoldText style={styles.reportNumber}>
                            {scorePercentage}%
                        </AppBoldText>
                    </View>
                    {!isMobile && <View style={styles.line} />}
                    <View style={styles.reportItem}>
                        <AppSemiBoldText style={styles.reportTitle}>
                            CORRECT QUESTIONS
                        </AppSemiBoldText>
                        <AppBoldText style={styles.reportNumber}>
                            {correctQuestions}
                            <AppSemiBoldText style={styles.lightText}>
                                {" / "}{numberOfQuestion}
                            </AppSemiBoldText>
                        </AppBoldText>
                    </View>
                </View>
                <ScrollView
                    style={[
                        styles.questionsCard,
                        {
                            maxWidth: contentMaxWidth,
                            borderRadius: isMobile ? 10 : 14,
                            paddingHorizontal: horizontalPadding,
                            paddingTop: isMobile ? 10 : 14,
                            ...(Platform.OS === 'web' ? { boxShadow: Colors.blackBoxShadow } : {}),
                        }
                    ]}
                    contentContainerStyle={{ paddingBottom: 16 }}
                    showsVerticalScrollIndicator={false}
                >
                    {
                        questions?.map((ques, index) => (
                            <View key={ques.id ?? index} style={{ marginBottom: questionGap }}>
                                {
                                    getQuestion(ques, index + 1)
                                }
                            </View>
                        ))
                    }
                </ScrollView>

            </View>
        )
    }

    return (
        noModal ? (
            renderComponent()
        ) : (
            <Modal
                visible={isGradeScreenOpen || isResultPageOpen}
                animationType="fade"
                onRequestClose={onExit}
                onDismiss={onExit}
            >
                {renderComponent()}
            </Modal >
        )
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
        alignSelf: 'center',
        justifyContent: 'flex-start',
        alignItems: 'center',
        position: 'relative',
        marginBottom: 10,
    },

    closeButton: {
        position: 'absolute',
        right: 0,
        padding: 6,
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
        backgroundColor: '#F1F3F6',
        borderRadius: 16,
        marginVertical: 14,
        borderWidth: 1,
        borderColor: '#E0E6ED',
        alignItems: 'center',
        width: '100%',
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
    questionsCard: {
        flex: 1,
        width: '100%',
        alignSelf: 'center',
        backgroundColor: Colors.white,
        elevation: 6,
    },
})
