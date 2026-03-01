import { View, Text, Pressable, StyleSheet, useWindowDimensions, TouchableOpacity, Platform } from 'react-native'
import React, { useState } from 'react'
import { Ionicons, MaterialCommunityIcons, Feather, Entypo, FontAwesome5 } from '@expo/vector-icons';
import Colors from '../../styles/Colors';
import { router, useGlobalSearchParams } from 'expo-router';
import { AppMediumText, AppSemiBoldText } from '../../styles/fonts';

export default function StudentTest({ data, isStudentTest = true }) {

    const { classroomId } = useGlobalSearchParams();
    const { width } = useWindowDimensions();
    const isweb = width >= 768;

    console.log(isweb);

    const remaining = data.remainingAttempts;


        async function requestFullscreenOnStart() {
        if (Platform.OS !== 'web' || typeof document === 'undefined') return;
        if (!document.documentElement?.requestFullscreen) return;
        if (document.fullscreenElement) return;

        try {
            await document.documentElement.requestFullscreen();
        } catch (err) {
            console.log('Fullscreen request failed:', err);
        }
    }

     async function handleStart() {
        await requestFullscreenOnStart();
        router.replace({
            pathname: 'student/[classroomId]/test/[testId]/start',
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
            pathname: '/student/[classroomId]/studentSubmission',
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
            <View
                style={[
                    styles.card,
                    {
                        gap: isStudentTest ? 20 : 4,

                    }
                ]}
            >
                <View style={styles.row}>

                    <View style={[styles.leftGroup, {
                        gap: isweb ? 50 : 15,
                        flexWrap: isweb ? "nowrap" : "wrap",
                        flexDirection: isweb ? "row" : "column"

                    }]}>
                        <View style={styles.leftSection}>
                            <Ionicons name='clipboard-outline' size={20} color={Colors.primaryColor} />

                            <Text style={[styles.title, {
                                marginRight: 40

                            }]}>{data.testTitle}</Text>
                        </View>


                        {(remaining > 0 || data.maximumAttempts === 0) && isStudentTest && (
                            <View style={[styles.btnContainer, {
                                marginLeft: 25
                            }]}>
                                <Pressable style={[styles.btnInsideContainer,

                                ]} onPress={handleStart}>
                                    <Entypo name="controller-play" size={18} color="white" />
                                    <AppMediumText style={[{ color: 'white', fontSize: 14, alignSelf: "center" },
                                    {
                                    }
                                    ]}>
                                        {data.attemptCount !== 0 ? "Reattempt" : "Start"}
                                    </AppMediumText>
                                </Pressable>
                            </View>
                        )}

                    </View>

                    <View style={[styles.rightSection]

                    } >


                        {isStudentTest &&
                            <>
                                <View style={[{
                                    flexDirection: isweb ? "row" : "",
                                    gap: isweb ? 20 : 12,
                                    flexWrap: isweb ? "nowrap" : "wrap"

                                }]}>
                                    <View>
                                        {
                                            data.maximumAttempts === data.attemptCount && data.maximumAttempts !== 0 && (
                                                <View style={[styles.finishedBadge, {
                                                    paddingHorizontal: isweb ? 12 : 8,
                                                    paddingVertical: isweb ? 8 : 5,
                                                }]}>
                                                    <Text style={styles.finishedText}>Finished</Text>
                                                </View>
                                            )
                                        }

                                        {remaining > 0 && data.maximumAttempts !== data.remainingAttempts && (
                                            <View style={[styles.attemptBadge, {
                                                paddingHorizontal: isweb ? 16 : 8,
                                                paddingVertical: isweb ? 10 : 5,
                                            }]}>
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
                                    </View>
                                    <View>
                                        <TouchableOpacity
                                            style={[
                                                styles.button,
                                                !isEvaluated && { opacity: 0.5 }
                                            ]}
                                            disabled={!isEvaluated}
                                            onPress={handleGrade}
                                        >
                                            <AppSemiBoldText style={styles.buttonText}>
                                                View
                                            </AppSemiBoldText>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </>
                        }
                        {!isStudentTest &&
                            <>
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
                            </>
                        }
                    </View>

                </View>

                {/* <View style={styles.row}>
                    <Ionicons name='clipboard-outline' size={20} color={Colors.primaryColor} />
                    <Text style={styles.title}>{data.testTitle}</Text>


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
                </View> */}

                <View
                    style={[
                        styles.infoRow,
                        {
                            justifyContent: !isStudentTest
                                ? 'space-between'
                                : 'flex-start'
                        }
                    ]}
                >
                    {isStudentTest && (
                        <>
                            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>                                <View style={styles.infoItem}>
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


                        </>
                    )}

                    <View

                        style={[
                            styles.dateContainer,
                            isStudentTest
                                ? styles.dateLeft
                                : styles.dateRight
                        ]}
                    >
                        <Text style={styles.dateText}>
                            {console.log("data.createdAt", data.createdAt)}
                            {new Date(data.createdAt * 1000).toLocaleDateString()}
                        </Text>
                    </View>
                </View>


            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginVertical: 8,
        marginHorizontal: 16,
        // flexWrap
    },
    disabledButton: {
        backgroundColor: '#D1D5DB', // light gray
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },
    // rightInside:{
    //       flexDirection:"row",
    //       gap:20
    // },
    card: {
        backgroundColor: Colors.white,
        padding: 20,
        borderRadius: 8,
        boxShadow: Colors.blackBoxShadow,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: "wrap"
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },

    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
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

    leftGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    btnContainer: {
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 10,
        // minWidth: 140,          
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryColor
    },

    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },

    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flexWrap: "wrap"
    },

    attemptBadge: {
        backgroundColor: "#FEF3C7",

        borderRadius: 8,        // was 6
    },
    attemptText: {
        fontSize: 14,   // was 12
        color: "#B45309",
        fontWeight: "600",
    },
    finishedBadge: {
        backgroundColor: "#DCFCE7",

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
        fontSize: 18,
        fontWeight: '700',
        color: '#16A34A',

    },
    attemptLabel: {
        fontSize: 11,
        color: '#64748B',
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
        paddingHorizontal: 16,  // was 12
        paddingVertical: 8,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 14,   // was 12
    },
    topRight: {
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 25,
        marginTop: 5
    },
    dateContainer: {
        alignSelf: 'flex-end',

    },

    dateText: {
        fontSize: 12,
        color: Colors.gray,
    },

    btnInsideContainer: {
        flex: 1,
        flexDirection: "row"
    }
    ,
    dateLeft: {
        alignSelf: 'flex-start',
    },

    dateRight: {
        alignSelf: 'flex-end',
    },



});