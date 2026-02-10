import { View, Text, TextInput, StyleSheet, useWindowDimensions, Pressable } from 'react-native'
import React, { use, useState } from 'react'
import { Checkbox } from 'react-native-paper';
import { router, location, useGlobalSearchParams } from 'expo-router';
import api from '../../../../../../util/api';

export default function Publish() {

    const [correctionOptions, setCorrectionOptions] = React.useState({
        auto: true,
        manual: false,
    });

    const { classroomId } = useGlobalSearchParams();

    const { test, testId } = useGlobalSearchParams();
    const [isTimed, setIsTimed] = React.useState(false);
    const [correctionType, setCorrectionType] = React.useState('AUTO');
    const [testMinutes, setTestMinutes] = useState(0);
    const [maximumAttempts, setMaximumAttempts] = useState(0);

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
            const success = await publishTest(testId , classroomId ,Boolean(isTimed),correctionType,Number(testMinutes),Number(maximumAttempts),);
            if (success) {
                handleCancel();
            } else {
                console.log('test not published');
            }
        }
    }

    function handleCancel() {
        router.replace({
            pathname: '/[classroomId]/test/createTest',
            params: {
                classroomId,
            },
        });

    }

    return (
        <View style={styles.container} >
            <View style={[width > 861 ? styles.pageHeader : null, { marginVertical: 50 }]} >
                <Text style={styles.header}>Publish Test</Text>
            </View>
            <View style={styles.pageContent}>
                <View style={styles.contentWrapper}>
                    <Text style={styles.label} >Title : </Text>
                    <TextInput
                        style={styles.inputBox}
                        value={test}
                    />
                </View>
                <View style={styles.contentWrapper}>
                    <Text style={styles.label} >Correction Type : </Text>
                    <Checkbox
                        status={correctionOptions.auto ? 'checked' : 'unchecked'}
                        onPress={() => { setCorrectionOptions({ auto: true, manual: false }); setCorrectionType('AUTO') }}
                    />
                    <Text style={styles.value} >Auto</Text>
                    <Checkbox
                        status={correctionOptions.manual ? 'checked' : 'unchecked'}
                        onPress={() => { setCorrectionOptions({ auto: false, manual: true }); setCorrectionType('MANUAL') }}
                    />
                    <Text style={styles.value} >Manual</Text>
                </View>
                <View style={styles.contentWrapper}>
                    <Text style={styles.label} >Is Timed : </Text>
                    <Checkbox
                        status={isTimed ? 'checked' : 'unchecked'}
                        onPress={() => setIsTimed(!isTimed)}
                    />
                    {
                        isTimed && (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TextInput
                                    placeholder='30'
                                    style={{ borderWidth: 1, borderColor: '#ccc', padding: 5, borderRadius: 5, width: 50, marginRight: 5 }}
                                    keyboardType='numeric'
                                    onChangeText={(text) => setTestMinutes(parseInt(text) || 0)}
                                />
                                <Text style={styles.value} >{' minutes'}</Text>
                            </View>
                        )
                    }
                </View>
                <View style={styles.contentWrapper}>
                    <Text style={styles.label} >Maximum Attempts : </Text>
                    <TextInput
                        defaultValue='0'
                        style={{ borderWidth: 1, borderColor: '#ccc', padding: 5, borderRadius: 5, width: 50 }}
                        keyboardType='numeric'
                        onChangeText={(text) => setMaximumAttempts(parseInt(text) || 0)}
                    />
                    <Text style={styles.value} >{' (0 for unlimited)'}</Text>
                </View>

            </View>
            <View style={{ flexDirection: 'row', gap: 50 }} >
                <Pressable style={styles.cancelBtn} onPress={handleCancel} >
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 600 }}>Cancel</Text>
                </Pressable>
                <Pressable style={styles.publishBtn} onPress={handlePublish} >
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 600 }}>Publish Test</Text>
                </Pressable>
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
    pageHeader: {
        paddingVertical: 20,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
        marginBottom: 20,
    },
    header: {
        fontSize: 16,
        marginTop: 10,
        fontWeight: 600,
        textAlign: 'center',
    },
    pageContent: {
        paddingHorizontal: 20,
        gap: 20
    },
    label: {
        fontSize: 16,
        fontWeight: 600,
    },
    value: {
        fontSize: 16,
        fontWeight: 400,
    },
    contentWrapper: {
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flexWrap: 'wrap',
    },
    cancelBtn: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        width: 100,
        alignItems: 'center',
        marginRight: 10,
    },
    publishBtn: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        width: 120,
        alignItems: 'center',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputBox: {
        // borderWidth: 1,
        borderColor: '#ccc',
        padding: 5,
        borderRadius: 5,
        width: 200,
        fontSize: 16,
        outlineWidth: 0,
    },
})