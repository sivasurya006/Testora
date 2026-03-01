import { View, Text, Pressable, StyleSheet, useWindowDimensions, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Ionicons, MaterialCommunityIcons, Feather, Entypo, FontAwesome5 } from '@expo/vector-icons';
import Colors from '../../styles/Colors';
import { router, useGlobalSearchParams } from 'expo-router';
import { AppMediumText, AppSemiBoldText } from '../../styles/fonts';

export default function StudentTest({ data, isStudentTest = true }) {

    const { classroomId } = useGlobalSearchParams();
    const { width } = useWindowDimensions();

    const remaining = data.remainingAttempts;

    function handleStart() {
        router.replace({
            pathname: '/student/[classroomId]/test/[testId]/start',
            params: {
                classroomId: classroomId,
                testId: data.testId,
            },
        });
    }

    //     function handleGrade() {
    //     console.log("in handle grade", data.classroomId, data.testId, data.userId)
    //     router.push({
    //         pathname: '/student/[classroomId]/studentSubmission',
    //         params: {
    //             classroomId: data.classroomId,
    //             testId: data.testId,
    //             student: data.userId
    //         }
    //     });
    // }

    function handleGrade() {
        console.log("in handle grade", classroomId, data.testId, data.userId)
        router.push({
            pathname: '/student/[classroomId]/studentTestSubmissions/studentSubmission',
            params: {
                classroomId: classroomId,
                testId: data.testId,
                student: data.userId
            }
        });
    }

    function handleShowReport(attemptId) {
        router.push({
            pathname: "/student/[classroomId]/test/[testId]/report",
            params: {
                classroomId: classroomId,
                testId: data.testId,
                attemptId
            }
        });
    }

    const isEvaluated = data.attemptedTestStatus === 'evaluated';

    return (
        <View style={styles.wrapper}>
            <View style={styles.card}>

                <View style={styles.row}>
                    <Ionicons name='clipboard-outline' size={20} color={Colors.primaryColor} />
                    <Text style={styles.title}>{data.testTitle}</Text>

                    {isStudentTest && (
                        <>
                            {data.maximumAttempts === data.attemptCount && data.maximumAttempts !== 0 && (
                                <View style={styles.finishedBadge}>
                                    <Text style={styles.finishedText}>Finished</Text>
                                </View>
                            )}

                            {remaining > 0 && data.maximumAttempts !== data.remainingAttempts && (
                                <View style={styles.attemptBadge}>
                                    <Text style={styles.attemptText}>
                                        {remaining} Attempts Left
                                    </Text>
                                </View>
                            )}

                            {data.maximumAttempts === data.remainingAttempts && (
                                <View style={styles.newBadge}>
                                    <Text style={styles.newText}>New</Text>
                                </View>
                            )}

                            {data.attemptCount > 0 && data.maximumAttempts === 0 && (
                                <View style={styles.newBadge}>
                                    <Text style={styles.newText}>Attempted</Text>
                                </View>
                            )}


                        </>
                    )}

                    {isStudentTest &&

                        <>
                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    !isEvaluated && { opacity: 0.5 }
                                ]}
                                disabled={!isEvaluated}
                                onPress={() => handleGrade()}
                            >
                                <AppSemiBoldText
                                    style={[
                                        styles.buttonText,
                                        !isEvaluated && { color: 'white' }
                                    ]}
                                >
                                    {isEvaluated ? "View" : "View"}
                                </AppSemiBoldText>
                            </TouchableOpacity>
                        </>
                    }

                    {!isStudentTest && (
                        <View style={styles.topRight}>
                            <View style={styles.attemptsContainer}>
                                <Text style={styles.attemptNumber}>
                                    {data.attemptCount}
                                </Text>
                                <Text style={styles.attemptLabel}>
                                    Attempts
                                </Text>
                            </View>

                            <Pressable style={styles.enter} onPress={handleGrade}>
                                <FontAwesome5 name="arrow-right" color="white" size={16} />
                            </Pressable>
                        </View>
                    )}
                </View>

                <View style={[
                    styles.infoRow,
                    { marginTop: isStudentTest ? 8 : 0 }
                ]}>                    {isStudentTest && (
                    <>
                        <View style={{ width: 280, flexDirection: 'row' }}>
                            <View style={styles.infoItem}>
                                <MaterialCommunityIcons name="timer-outline" size={16} />
                                <Text style={styles.infoText}>
                                    {data.durationMinutes ? `${data.durationMinutes} min` : 'Untimed'}
                                </Text>
                            </View>

                            <View style={styles.infoItem}>
                                <Feather name="repeat" size={16} />
                                <Text style={styles.infoText}>
                                    {data.maximumAttempts === 0 ? 'Unlimited' : data.maximumAttempts}
                                </Text>
                            </View>

                            <View style={styles.infoItem}>
                                <MaterialCommunityIcons name="check-decagram-outline" size={16} />
                                <Text style={styles.infoText}>{data.correctionMethod}</Text>
                            </View>
                        </View>

                        {(remaining > 0 || data.maximumAttempts === 0) && (
                            <View style={styles.btnContainer}>
                                <Pressable style={styles.btnInsideContainer} onPress={handleStart}>
                                    <Entypo name="controller-play" size={20} color="white" />
                                    <AppMediumText style={{ color: 'white' }}>
                                        {data.attemptCount !== 0 ? "Reattempt" : "Start"}
                                    </AppMediumText>
                                </Pressable>
                            </View>
                        )}
                    </>
                )}

                </View>
                <View
                    style={[
                        styles.dateContainer,
                        isStudentTest
                            ? styles.dateRight
                            : styles.dateLeft
                    ]}
                >
                    <Text style={styles.dateText}>
                        {new Date(data.createdAt * 1000).toLocaleDateString()}
                    </Text>
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginVertical: 8,
        marginHorizontal: 16,
    },
    disabledButton: {
        backgroundColor: '#D1D5DB', // light gray
    },
    card: {
        backgroundColor: Colors.white,
        padding: 20,
        borderRadius: 8,
        boxShadow: Colors.blackBoxShadow,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
    infoRow: {
        flexDirection: 'row',
        marginTop: 8,
        flexWrap: 'wrap',
        gap: 10,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginRight: 10
    },
    infoText: {
        fontSize: 13,
        color: Colors.gray,
    },
    btnContainer: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 8,
        width: 130,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryColor
    },
    btnInsideContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 10,
        width: '100%',
    },
    dateContainer: {
        marginTop: 12,
        alignItems: 'flex-end',
    },

    dateText: {
        fontSize: 12,
        color: Colors.gray,
    },
    attemptBadge: {
        backgroundColor: "#FEF3C7",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
    },
    attemptText: {
        fontSize: 12,
        color: "#B45309",
        fontWeight: "600",
    },
    finishedBadge: {
        backgroundColor: "#DCFCE7",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
    },
    finishedText: {
        color: "#15803D",
        fontSize: 12,
        fontWeight: "600",
    },
    newBadge: {
        backgroundColor: "#DBEAFE",
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 6,
    },
    newText: {
        color: "#1D4ED8",
        fontSize: 12,
        fontWeight: "600",
    },
    rightSide: {
        marginTop: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%"
    },
    attemptsContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    attemptNumber: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.primaryColor,

    },
    attemptLabel: {
        fontSize: 13,
        color: Colors.gray,
    },
    enter: {
        backgroundColor: Colors.primaryColor,
        height: 30,
        width: 30,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: Colors.primaryColor,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    buttonText: {
        color: 'white',
        fontSize: 12,
    },
    topRight: {
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 25,
    },
    dateContainer: {
        marginTop: 12,
    },

    dateRight: {
        alignItems: 'flex-end',
    },

    dateLeft: {
        alignItems: 'flex-start',
    },

    dateText: {
        fontSize: 12,
        color: Colors.gray,
    },
});