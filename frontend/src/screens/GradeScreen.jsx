import { View, Text, StyleSheet, TouchableOpacity , ScrollView } from 'react-native'
import { useEffect, useState } from 'react'
import FillInBlankQuestion from '../components/FillIntheBlankQuestion'
import MatchingQuestion from '../components/MatchingQuestion'
import McqQuestion from '../components/McqQuestion'
import SingleChoiceQuestion from '../components/SingleChoiceQuestion'
import BooleanQuestion from '../components/BooleanQuestion'
import Colors from '../../styles/Colors'
import { AppBoldText, AppMediumText } from '../../styles/fonts'
import { AntDesign } from '@expo/vector-icons'
import ConfirmModal from '../components/modals/ConfirmModal'
import { useGlobalSearchParams } from 'expo-router'
import api from '../../util/api'

export default function GradeScreen({ attemptId, questions, isGradeScreenOpen, onExit, setAttempts, attempts }) {

    if (!isGradeScreenOpen) return
    const [questionState, setQuestionState] = useState(questions || []);
    const [gradeData, setGradeData] = useState({})
    const [confirmGradeVisible, setConfirmGradeVisible] = useState(false);

    const { classroomId } = useGlobalSearchParams();

    const totalMarks = questionState?.reduce((acc, q) => {
        const optionMarks = q.options?.reduce((sum, opt) => sum + (opt.optionMark || 0), 0);
        return acc + (q.marks || 0) + (optionMarks || 0);
    }, 0);

    const obtainedMarks = questionState?.reduce((acc, q) => {
        const answers = gradeData[q.id] || [];
        const selectedOptionMarks = answers.reduce((sum, ans) => sum + (ans.isCorrect ? ans.givenMarks : 0), 0);
        const questionMarks = q.isCorrect ? (q.marks || 0) : 0;
        return acc + questionMarks + selectedOptionMarks;
    }, 0);

    const correctCount = questionState?.filter(q => q.isCorrect)?.length || 0;
    const wrongCount = questionState?.length - correctCount;

    const handleGradeAnswers = () => setConfirmGradeVisible(true)

    useEffect(() => {
        if (!questions) return;
        setQuestionState(questions);
    }, [questions]);

    console.log("grade data ", gradeData)

    useEffect(() => {
        if (!questions) return;

        const gradeData = {};

        for (let i = 0; i < questions.length; i++) {
            const ques = questions[i];
            const answers = [];
            if (ques.selectedOptions && ques.selectedOptions.length > 0) {
                for (let j = 0; j < ques.selectedOptions.length; j++) {
                    const selected = ques.selectedOptions[j];
                    const option = ques.options.find(opt => opt.optionId === selected.optionId);
                    answers.push({
                        answerId: selected.answerId,
                        givenMarks: option ? option.optionMark : 0,
                        isCorrect: false
                    });
                }
            }

            gradeData[ques.id] = answers; // assign array to questionId
        }

        setGradeData(gradeData);
    }, [questions]);

    const handleMarkQuestion = (questionId, isCorrect) => {
        // Update gradeData
        setGradeData(prev => {
            const updated = { ...prev };

            if (updated[questionId]) {
                updated[questionId] = updated[questionId].map(ans => ({
                    ...ans,
                    isCorrect: isCorrect
                }));
            }

            return updated;
        });


        setQuestionState(prev =>
            prev.map(q =>
                q.id === questionId ? { ...q, isCorrect } : q
            )
        );
    };

    return (
        // <Modal
        //     visible={isGradeScreenOpen}
        //     animationType="fade"
        //     onRequestClose={onExit}
        //     onDismiss={onExit}
        // >
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={onExit} style={styles.closeButton}>
                    <AntDesign name="close" size={24} color="black" />
                </TouchableOpacity>
                <AppBoldText style={styles.topHeaderText}>
                    Answer Sheet
                </AppBoldText>
                <View style={styles.bottomActions}>

                    <TouchableOpacity

                        onPress={handleGradeAnswers}

                        style={styles.validButton}>
                        <Text style={styles.validText}>Grade Result</Text>
                    </TouchableOpacity>
                </View>

            </View>
            <View style={styles.summaryContainer}>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryNumber}>{obtainedMarks}/{totalMarks}</Text>
                    <Text style={styles.summaryLabel}>Total Score</Text>
                </View>

                <View style={styles.summaryDivider} />

                <View style={styles.summaryCard}>
                    <Text style={[styles.summaryNumber, { color: '#16A34A' }]}>
                        {correctCount}
                    </Text>
                    <Text style={styles.summaryLabel}>Correct</Text>
                </View>

                <View style={styles.summaryDivider} />

                <View style={styles.summaryCard}>
                    <Text style={[styles.summaryNumber, { color: '#DC2626' }]}>
                        {wrongCount}
                    </Text>
                    <Text style={styles.summaryLabel}>Wrong</Text>
                </View>
            </View>
            <ScrollView style={{
                flex: 1,
                maxWidth: 1200,
                width: '100%',
                boxShadow: Colors.blackBoxShadow,
                marginHorizontal: 10,
                elevation: 6,
                borderRadius: 8,
                paddingVertical: 10,
                paddingHorizontal: 20,
                backgroundColor: Colors.white,
            }}>
                {


                    questionState?.map((ques, index) => (
                        <View key={ques.id} style={{ margin: 20 }}>
                            {
                                <>
                                    <View style={{ position: 'relative' }}>
                                        {getQuestion(ques, index + 1)}

                                        {ques.isCorrect === true && (
                                            <View style={[styles.resultIcon, styles.correctIcon]}>
                                                <AntDesign name="check-circle" size={22} color={Colors.primaryColor} />
                                            </View>
                                        )}

                                        {ques.isCorrect === false && (
                                            <View style={[styles.resultIcon, styles.wrongIcon]}>
                                                <AntDesign name="close-circle" size={22} color="#DC2626" />
                                            </View>
                                        )}
                                    </View>
                                    <View style={styles.actionRow}>
                                        <TouchableOpacity
                                            style={[styles.actionBtn, styles.invalidOutline]}
                                            onPress={() => handleMarkQuestion(ques.id, false)}
                                        >
                                            <AppMediumText style={styles.invalidTextOutline}>Invalid</AppMediumText>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[styles.actionBtn, styles.validOutline]}
                                            onPress={() => handleMarkQuestion(ques.id, true)}
                                        >
                                            <AppMediumText style={styles.validTextOutline}>Valid</AppMediumText>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            }
                        </View>
                    ))
                }
            </ScrollView >
            <ConfirmModal normal={true}
                onCancel={() => setConfirmGradeVisible(false)}
                onConfirm={() => {
                    if (gradeAnswerSheet(classroomId, attemptId, obtainedMarks, gradeData)) {
                        setAttempts({
                            attempts: attempts.map(a => {
                                if (a.attemptId == attemptId) {
                                    a.marks = obtainedMarks
                                    a.status = 'EVALUATED'
                                }

                                return a;
                            })
                        })
                    }
                    onExit();
                }
                }
                message={'Grade the Answer sheet?'}
                visible={confirmGradeVisible} />
        </View >
        // </Modal >
    )
}


async function gradeAnswerSheet(classroomId, attemptId, totalMarks, gradedAnswers) {


    try {
        const result = await api.post(`api/tests/gradeTest?attempt=${attemptId}&totalMarks=${totalMarks}`,
            transformAnswers(gradedAnswers), {
            headers: {
                'X-ClassroomId': classroomId,
            }
        });
        if (result.status == 200 && result.data) {
            return result.data.success
        }
    } catch (err) {
        console.log(err.response?.data);
    }
    return false;
}



function transformAnswers(input) {
    const gradedAnswers = Object.keys(input).map(id => ({
        id: parseInt(id),
        selectedOptions: input[id].map(option => ({
            answerId: option.answerId,
            givenMarks: option.givenMarks,
            correct: option.isCorrect
        }))
    }));

    return { gradedAnswers };
}


function getQuestion(item, index) {
    switch (item.type) {
        case 'SINGLE':
            return (
                <SingleChoiceQuestion
                    mode="grade"
                    question={item}
                    options={item.options}
                    questionNumber={index}
                    selectedOptions={item.selectedOptions}
                />
            );
        case "MCQ":
            return (
                <McqQuestion
                    mode="grade"
                    question={item}
                    options={item.options}
                    questionNumber={index}
                    selectedOptions={item.selectedOptions}
                />
            )
        case 'BOOLEAN': {
            return (
                <BooleanQuestion
                    mode="grade"
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
                    mode="grade"
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
                    mode="grade"
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
        backgroundColor: Colors.bgColor,
        padding: 20,
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
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        marginBottom: 20,
        flexDirection: 'row',
    },

    // closeButton: {
    //     position: 'absolute',
    //     right: 0,
    // },
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
        flexDirection: 'row',
        backgroundColor: '#F1F3F6',
        borderRadius: 16,
        paddingVertical: 25,
        marginVertical: 20,
        borderWidth: 1,
        borderColor: '#E0E6ED',
        alignItems: 'center',
        width: '100%',
        maxWidth: 1200,
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
    summaryContainer: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        paddingVertical: 20,
        marginBottom: 20,
        width: '100%',
        maxWidth: 1200,
        alignItems: 'center',
    },

    summaryCard: {
        flex: 1,
        alignItems: 'center',
    },

    summaryNumber: {
        fontSize: 26,
        fontWeight: 'bold',
    },

    summaryLabel: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 5,
    },

    summaryDivider: {
        width: 1,
        height: '60%',
        backgroundColor: '#E5E7EB',
    },

    questionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginVertical: 15,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },

    questionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    resultBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },

    marksText: {
        marginTop: 10,
        fontWeight: 'bold',
        color: '#374151',
    },

    bottomActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },

    validButton: {
        flex: 1,
        backgroundColor: Colors.primaryColor,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginLeft: 10,
    },

    invalidButton: {
        flex: 1,
        backgroundColor: '#DC2626',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginRight: 10,
    },

    validText: {
        color: 'white',
        fontWeight: 'bold',
    },

    invalidText: {
        color: 'white',
        fontWeight: 'bold',
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 15,
        marginLeft: 'auto',
    },

    actionBtn: {
        paddingVertical: 8,
        paddingHorizontal: 18,
        borderRadius: 20,
        borderWidth: 1.5,
    },

    validOutline: {
        borderColor: '#16A34A',
        backgroundColor: '#ECFDF5',
    },

    invalidOutline: {
        borderColor: '#DC2626',
        backgroundColor: '#FEF2F2',
    },

    validTextOutline: {
        color: '#16A34A',
        fontSize: 14,
    },

    invalidTextOutline: {
        color: '#DC2626',
        fontSize: 14,
    },
    resultIcon: {
        position: 'absolute',
        bottom: -50,
        right: 200,
    },

    correctIcon: {
        backgroundColor: '#ECFDF5',
        borderRadius: 20,
        padding: 4,
    },

    wrongIcon: {
        backgroundColor: '#FEF2F2',
        borderRadius: 20,
        padding: 4,
    },
})



