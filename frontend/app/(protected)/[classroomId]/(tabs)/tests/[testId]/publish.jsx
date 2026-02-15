import { View, Text, TextInput, StyleSheet, useWindowDimensions, Pressable } from 'react-native'
import React, { use, useState } from 'react'
import { Checkbox, Icon, IconButton, Menu, Portal, Tooltip } from 'react-native-paper';
import { router, location, useGlobalSearchParams } from 'expo-router';
import api from '../../../../../../util/api';
import { AntDesign } from '@expo/vector-icons';
import Colors from '../../../../../../styles/Colors';
import { AppBoldText, AppMediumText, AppRegularText } from '../../../../../../styles/fonts';

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

    return (
        <View style={styles.container} >
            <View style={styles.form} >
                <View style={[width > 861 ? styles.pageHeader : null]} >
                    <AppBoldText style={styles.header}>Publish Test</AppBoldText>
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
                        <AppMediumText style={styles.label} >Correction Type : </AppMediumText>
                        <Checkbox
                            status={correctionOptions.auto ? 'checked' : 'unchecked'}
                            onPress={() => { setCorrectionOptions({ auto: true, manual: false }); setCorrectionType('AUTO') }}
                        />
                        <AppRegularText style={styles.value} >Auto</AppRegularText>
                        <Checkbox
                            status={correctionOptions.manual ? 'checked' : 'unchecked'}
                            onPress={() => { setCorrectionOptions({ auto: false, manual: true }); setCorrectionType('MANUAL') }}
                        />
                        <AppRegularText style={styles.value} >Manual</AppRegularText>
                    </View>
                    <View style={styles.contentWrapper}>
                        <AppMediumText style={styles.label} >Is Timed : </AppMediumText>
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
                                    <AppRegularText style={styles.value} >{' minutes'}</AppRegularText>
                                </View>
                            )
                        }
                    </View>
                    <View style={styles.contentWrapper}>
                        <AppMediumText style={styles.label} >Maximum Attempts : </AppMediumText>
                        <TextInput
                            defaultValue='0'
                            style={{ borderWidth: 1, borderColor: '#ccc', padding: 5, borderRadius: 5, width: 50 }}
                            keyboardType='numeric'
                            onChangeText={(text) => setMaximumAttempts(parseInt(text) || 0)}
                        />
                        <Menu
                            visible={showInfo}
                            onDismiss={() => setShowInfo(false)}
                            anchor={
                                <IconButton
                                    icon="information"
                                    size={18}
                                    onPress={() => setShowInfo(true)}
                                    onHoverIn={() => !showInfo && setShowInfo(true)}
                                    onHoverOut={() => showInfo && setShowInfo(false)}
                                />
                            }
                            anchorPosition='bottom'
                        >
                            <Menu.Item title="0 for unlimited" />
                        </Menu>
                    </View>

                </View>
                <View style={{ flexDirection: 'row', gap: 50 }} >
                    <Pressable style={styles.cancelBtn} onPress={handleCancel} >
                        <AppMediumText style={{ color: 'white', fontSize: 16, fontWeight: 600 }}>Cancel</AppMediumText>
                    </Pressable>
                    <Pressable style={styles.publishBtn} onPress={handlePublish} >
                        <AppMediumText style={{ color: 'white', fontSize: 16, fontWeight: 600 }}>Publish</AppMediumText>
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
    pageHeader: {
        // paddingVertical: 20,
        // borderBottomColor: '#ddd',
        // borderBottomWidth: 1,
        // marginBottom: 20,
    },
    header: {
        fontSize: 16,
        // marginTop: 10,
        fontWeight: 600,
        textAlign: 'center',
    },
    pageContent: {
        // paddingHorizontal: 20,
        gap: 20,
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
        backgroundColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        width: 100,
        alignItems: 'center',
        marginRight: 10,
    },
    publishBtn: {
        backgroundColor: Colors.primaryColor,
        padding: 10,
        borderRadius: 5,
        width: 120,
        alignItems: 'center',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.bgColor,
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
    form : {
        backgroundColor:'white',
        padding : 20,
        alignItems : 'center',
        borderRadius : 8,
        shadowColor : Colors.thirdColor,
        shadowOffset : {width:0,height:5},
        // shadowOpacity : 0.4,
        shadowRadius : 4,
        elevation : 6
    },
})