import React, { useEffect, useMemo, useState } from 'react';
import { View, FlatList, StyleSheet, SectionList, Pressable, TouchableOpacity } from 'react-native';
import { AppRegularText, AppMediumText, AppSemiBoldText, AppBoldText } from '../../styles/fonts';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import api from '../../util/api';
import Colors from '../../styles/Colors';
import { FontAwesome6 } from '@expo/vector-icons';

export default function StudentSubmissionScreen({ mode = 'submissions' }) {

    const [data, setData] = useState([])
    const { classroomId, testId } = useGlobalSearchParams()

    useEffect(() => {
        if (mode == 'submissions') {
            getSubmissions();
        }
        if (mode == 'testSubmissions') {
            getTestSubmissions();
        }
    }, [classroomId, testId])

    const router = useRouter();

    function handleGrade(item) {

        // console.log('I am called', item)

        // console.log({
        //     classroomId,
        //     testId: item.testId || testId,
        //     userId: item.userId
        // });

        router.push({
            pathname: '/[classroomId]/test/[testId]/studentSubmissions',
            params: {
                classroomId,
                testId: item.testId || testId,
                // preview: -1,
                title: item.title,
                student: item.userId,
            }
        })
    }


    const getSubmissions = async () => {
        try {
            const result = await api.get('/api/tests/submissions', {
                headers: {
                    'X-ClassroomId': classroomId
                },
            });

            if (result?.status === 200 && result.data) {
                setData(result.data);
                return;
            } else {
                console.log("Can't fetch submissions");
            }

        } catch (err) {
            console.log("getTestSubmissions err ", err.response?.data);
        }
    };

    const getTestSubmissions = async () => {
        try {
            const result = await api.get('/api/tests/testSubmissions', {
                headers: {
                    'X-ClassroomId': classroomId,
                    'X-TestId': testId
                },
            });

            if (result?.status === 200 && result.data) {
                setData(result.data);
                return;
            } else {
                console.log("Can't fetch submissions");
            }

        } catch (err) {
            console.log("getTestSubmissions err ", err.response?.data);
        }
        setData([]);
    };

    const sections = useMemo(() => {
        const grouped = {};

        data.forEach(item => {
            if (!grouped[item.email]) {
                grouped[item.email] = {
                    title: item.name.trim(),
                    email: item.email,
                    data: [],
                };
            }

            grouped[item.email].data.push(item);
        });

        return Object.values(grouped);
    }, [data]);

    const renderItem = ({ item }) => {
        const attempted = item.attemptsCount > 0;

        return (
            <View
                style={[
                    styles.testCard,
                    attempted ? styles.attemptedCard : styles.notAttemptedCard,
                ]}
            >
                <View style={{ flex: 1 }}>
                    <AppMediumText style={styles.testTitle}>
                        {mode == 'submissions' ? item.title : item.name}
                    </AppMediumText>
                    {/* 
                    <AppRegularText style={styles.testId}>
                        Test ID: {item.testId}
                    </AppRegularText> */}
                </View>

                <View style={{ flexDirection: 'row' }}>

                    {
                        mode == 'submissions' ? (
                            <TouchableOpacity style={styles.button} onPress={() => handleGrade(item)}>
                                <FontAwesome6 name="pen-clip" size={13} color="white" />
                                <AppRegularText style={styles.buttonText}>Grade</AppRegularText>
                            </TouchableOpacity>
                        ) : (
                            (item.submittedCount > 0) ? (
                                <TouchableOpacity style={styles.button} onPress={() => handleGrade(item)}>
                                    <FontAwesome6 name="pen-clip" size={13} color="white" />
                                    <AppRegularText style={styles.buttonText}>Grade</AppRegularText>
                                </TouchableOpacity>
                            ) : (item.attemptsCount > 0) ? (
                                <TouchableOpacity style={styles.button} onPress={() => handleGrade(item)}>
                                    <FontAwesome6 name="eye" size={13} color="white" />
                                    <AppRegularText style={styles.buttonText} >View</AppRegularText>
                                </TouchableOpacity>
                            ) : null
                        )
                    }

                    <View style={styles.attemptContainer}>
                        <AppBoldText
                            style={[
                                styles.attemptCount,
                                attempted ? styles.greenText : styles.grayText,
                            ]}
                        >
                            {item.attemptsCount}
                        </AppBoldText>

                        <AppRegularText style={styles.attemptLabel}>
                            Attempts
                        </AppRegularText>
                    </View>
                    {
                        mode == 'testSubmissions' ? (
                            <>
                                <View style={styles.attemptContainer}>
                                    <AppBoldText
                                        style={[
                                            styles.attemptCount,
                                            attempted ? styles.greenText : styles.grayText,
                                        ]}
                                    >
                                        {item.submittedCount}
                                    </AppBoldText>

                                    <AppRegularText style={styles.attemptLabel}>
                                        To be graded
                                    </AppRegularText>
                                </View>
                                <View style={styles.attemptContainer}>
                                    <AppBoldText
                                        style={[
                                            styles.attemptCount,
                                            attempted ? styles.greenText : styles.grayText,
                                        ]}
                                    >
                                        {item.evaluatedCount}
                                    </AppBoldText>

                                    <AppRegularText style={styles.attemptLabel}>
                                        Graded
                                    </AppRegularText>
                                </View>

                            </>
                        ) : null
                    }
                </View>
            </View>
        );
    };

    const renderSectionHeader = ({ section }) => (
        <View style={styles.studentHeader}>
            <View>
                <AppSemiBoldText style={styles.studentName}>
                    {section.title}
                </AppSemiBoldText>
                <AppRegularText style={styles.studentEmail}>
                    {section.email}
                </AppRegularText>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {
                mode == 'submissions' ? (
                    <SectionList
                        // style={{ marginTop: 0, paddingTop: 0 }}
                        sections={sections}
                        keyExtractor={(item, index) =>
                            item.email + item.title + index
                        }
                        renderItem={renderItem}
                        renderSectionHeader={renderSectionHeader}
                        stickySectionHeadersEnabled
                        showsVerticalScrollIndicator={false}

                    />
                ) : (
                    <FlatList
                        data={data}
                        keyExtractor={(item, index) =>
                            item.email + item.title + index
                        }
                        renderItem={renderItem}
                    />
                )
            }
        </View>
    );
};




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
        paddingHorizontal: 16,
    },

    studentHeader: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginTop: 16,
        marginBottom: 8,
        elevation: 2,
    },

    studentName: {
        fontSize: 16,
        color: '#1E293B',
    },

    studentEmail: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 2,
    },

    testCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 12,
        marginBottom: 8,
    },

    attemptedCard: {
        backgroundColor: '#E6F9F0',
    },

    notAttemptedCard: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },

    testTitle: {
        fontSize: 14,
        color: '#0F172A',
    },

    testId: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 4,
    },

    attemptContainer: {
        alignItems: 'center',
        minWidth: 60,
    },

    attemptCount: {
        fontSize: 18,
    },

    attemptLabel: {
        fontSize: 11,
        color: '#64748B',
    },

    greenText: {
        color: '#16A34A',
    },

    grayText: {
        color: '#94A3B8',
    },
    button: {
        backgroundColor: Colors.primaryColor,
        paddingVertical: 2,
        paddingHorizontal: 10,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        flexDirection: 'row',
        gap: 10,
        width: 80
    },
    buttonText: {
        // fontSize: 16,
        color: Colors.white,
        // fontWeight: 'bold',
    },
});