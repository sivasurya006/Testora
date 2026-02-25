import { View, Text, TextInput, StyleSheet, useWindowDimensions, Pressable } from 'react-native'
import React, { use, useEffect, useState } from 'react'
import React, { use, useEffect, useState } from 'react'
import { Checkbox, Icon, IconButton, Menu, Modal, Portal, Tooltip } from 'react-native-paper';
import { router, location, useGlobalSearchParams } from 'expo-router';
import api from '../../../../../../util/api';
import { AntDesign } from '@expo/vector-icons';
import Colors from '../../../../../../styles/Colors';
import { AppBoldText, AppMediumText, AppRegularText } from '../../../../../../styles/fonts';
import { FA5Style } from '@expo/vector-icons/build/FontAwesome5';
import { FA5Style } from '@expo/vector-icons/build/FontAwesome5';

export default function Publish() {

    const [correctionOptions, setCorrectionOptions] = React.useState({
        auto: true,
        manual: false,
    });

    const { classroomId } = useGlobalSearchParams();

    const { title, testId } = useGlobalSearchParams();
    const [isTimed, setIsTimed] = React.useState(false);
    const [correctionType, setCorrectionType] = React.useState('AUTO');
    const [testMinutes, setTestMinutes] = useState(0);
    const [maximumAttempts, setMaximumAttempts] = useState(0);
    const [showAttemptInput, setShowAttemptInput] = useState(false);
    const [showAttemptInput, setShowAttemptInput] = useState(false);
    const [showInfo, setShowInfo] = useState(false);

    const { width } = useWindowDimensions();

    function validateInput() {
        if (isTimed && testMinutes <= 0) {
            return false;
        }
        if (maximumAttempts < 0) {
            return false;
        }
        return true;
    }

    async function handlePublish() {
        if (validateInput()) {
            const success = await publishTest(testId, classroomId, Boolean(isTimed), correctionType, Number(testMinutes), Number(maximumAttempts),);
            if (success) {
                handleCancel();
            } else {
                console.log('test not published');
            }
        }
    }

    function handleCancel() {
        router.replace({
            pathname: '/[classroomId]/test',
            params: {
                classroomId,
            },
        });

    }

    function setTimedTest(value) {
        setIsTimed(value);
    }
    function MaximumAttempts(value) {
        setMaximumAttempts(value);
    }

    useEffect(() => {   
        if (!showAttemptInput) {
            setMaximumAttempts(0);
        }
    },[showAttemptInput])

    function setTimedTest(value) {
        setIsTimed(value);
    }
    function MaximumAttempts(value) {
        setMaximumAttempts(value);
    }

    useEffect(() => {   
        if (!showAttemptInput) {
            setMaximumAttempts(0);
        }
    },[showAttemptInput])

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <View style={[width > 861 ? styles.pageHeader : null]}>
                    <AppBoldText style={styles.header}>Publish Test</AppBoldText>
                    <AppRegularText style={{ color: '#6B7280', marginTop: 5 }}>
                        Configure the final settings before making the test available to students.
                    </AppRegularText>
                </View>

                <View style={styles.pageContent}>

                    <View style={{ width: '100%' }}>
                        <AppMediumText style={styles.label}>Test Title</AppMediumText>
                        <TextInput
                            style={[styles.inputBox, {
                                backgroundColor: '#F3F4F6',
                                padding: 12,
                                borderRadius: 10,
                                width: '100%',
                                marginTop: 6
                            }]}
                            value={title}
                            editable={false}
                        />
                    </View>

                    <View style={{ width: '100%' }}>
                        <AppMediumText style={styles.label}>Correction Type</AppMediumText>

                        <View style={{ flexDirection: 'row', gap: 15, marginTop: 10 }}>
                            <Pressable
                                onPress={() => {
                                    setCorrectionOptions({ auto: true, manual: false });
                                    setCorrectionType('AUTO');
                                }}
                                style={{
                                    flex: 1,
                                    borderWidth: 1,
                                    borderColor: correctionOptions.auto ? Colors.primaryColor : '#E5E7EB',
                                    backgroundColor: correctionOptions.auto ? '#EEF2FF' : 'white',
                                    padding: 15,
                                    borderRadius: 12,
                                }}
                            >
                                <AppMediumText>Automatic</AppMediumText>
                                <AppRegularText style={{ color: '#6B7280', marginTop: 5 }}>
                                    Graded instantly by system
                                </AppRegularText>
                            </Pressable>

                            <Pressable
                                onPress={() => {
                                    setCorrectionOptions({ auto: false, manual: true });
                                    setCorrectionType('MANUAL');
                                }}
                                style={{
                                    flex: 1,
                                    borderWidth: 1,
                                    borderColor: correctionOptions.manual ? Colors.primaryColor : '#E5E7EB',
                                    backgroundColor: correctionOptions.manual ? '#EEF2FF' : 'white',
                                    padding: 15,
                                    borderRadius: 12,
                                }}
                            >
                                <AppMediumText>Manual</AppMediumText>
                                <AppRegularText style={{ color: '#6B7280', marginTop: 5 }}>
                                    Graded by instructors
                                </AppRegularText>
                            </Pressable>
                        </View>
                    </View>

                    <View style={{
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 20
                    }}>
                        <View>
                            <AppMediumText style={styles.label}>Timed Examination</AppMediumText>
                            <AppRegularText style={{ color: '#6B7280', marginTop: 4 }}>
                                Set a strict time limit for trainees
                            </AppRegularText>
                        </View>

                        <Checkbox
                            status={isTimed ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setIsTimed(!isTimed);
                                if (!isTimed) {
                                    setTestMinutes(30);
                                }
                            }}
                            onPress={() => {
                                setIsTimed(!isTimed);
                                if (!isTimed) {
                                    setTestMinutes(30);
                                }
                            }}
                        />
                    </View>

                    {isTimed && (
                        <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                        <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                            <TextInput
                                defaultValue='30'
                                style={{
                                    borderWidth: 1,
                                    borderColor: '#E5E7EB',
                                    padding: 10,
                                    borderRadius: 10,
                                    width: 100,
                                }}
                                keyboardType='numeric'
                                onChangeText={(text) => setTestMinutes(parseInt(text) || 0)}
                            />
                            <AppRegularText>Minutes</AppRegularText>
                            <AppRegularText>Minutes</AppRegularText>
                        </View>
                    )}

                    <View style={{ width: '100%', marginTop: 20 }}>
                        <View style={{
                            width: '100%',
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: 20
                        }}>
                            <View>
                                <AppMediumText style={styles.label}>Restrict multiple attempts</AppMediumText>
                                <AppRegularText style={{ color: '#6B7280', marginTop: 4 }}>
                                    Set maximum attempts
                                </AppRegularText>
                            </View>

                            <Checkbox
                                status={showAttemptInput ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    setShowAttemptInput(!showAttemptInput)
                                    setMaximumAttempts(3);
                                
                                }}
                            />
                        </View>


                        {showAttemptInput && (
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 35
                            }}>
                                <TextInput
                                    defaultValue='3'
                                    style={{
                                        backgroundColor: '#F3F4F6',
                                        padding: 10,
                                        borderRadius: 10,
                                        width: 100,
                                    }}
                                    keyboardType='numeric'
                                    onChangeText={(text) => setMaximumAttempts(parseInt(text) || 0)}
                                />
                                <AppRegularText style={{ marginHorizontal: 20 }}>Attempts</AppRegularText>


                            </View>
                        )}

                    </View>
                </View>

                <View style={{ width: '100%', marginTop: 30 }}>
                    <Pressable
                        style={[styles.publishBtn, {
                            width: '100%',
                            paddingVertical: 14,
                            borderRadius: 12
                        }]}
                        onPress={handlePublish}
                    >
                        <AppRegularText style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                            Publish
                            Publish
                        </AppRegularText>
                    </Pressable>
                </View>

            </View>
        </View>
    )

}

async function publishTest(testId, classroomId, timedTest, correctionMethod, durationMinutes, maximumAttempts) {
    try {
        const response = await api.patch(`/api/tests/publishTest`, {
            test: {
                timedTest, correctionMethod, durationMinutes, maximumAttempts
            }
        }, {
            headers: {
                'X-ClassroomId': classroomId,
                'X-TestId': testId,
            },
        });

        if (response.status === 200) {
            console.log('Test published successfully');
            return true;
        } else {
            console.log('Failed to publish test');
            return false;
        }
    } catch (error) {
        console.error('Error publishing test:', error);
        return false;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6', // soft gray background
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    form: {
        width: '100%',
        maxWidth: 650,
        backgroundColor: '#FFFFFF',
        padding: 30,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 10,
    },

    pageHeader: {
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 15,
        marginBottom: 25,
    },

    header: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111827',
    },

    pageContent: {
        gap: 25,
    },

    label: {
        fontSize: 15,
        fontWeight: '600',
        color: '#374151',
    },

    value: {
        fontSize: 14,
        fontWeight: '400',
        color: '#6B7280',
    },

    contentWrapper: {
        width: '100%',
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flexWrap: 'wrap',
    },

    inputBox: {
        width: '100%',
        backgroundColor: '#F9FAFB',
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 12,
        fontSize: 15,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },

    cancelBtn: {
        backgroundColor: '#E5E7EB',
        paddingVertical: 12,
        borderRadius: 12,
        width: 120,
        alignItems: 'center',
    },

    publishBtn: {
        backgroundColor: Colors.primaryColor,
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primaryColor,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
});
