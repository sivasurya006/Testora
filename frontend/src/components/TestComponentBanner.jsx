import { View, Text, Pressable, StyleSheet, useWindowDimensions, Platform } from 'react-native'
import React, { useState } from 'react'
import { Ionicons, MaterialCommunityIcons, Feather, Entypo } from '@expo/vector-icons';
import Colors from '../../styles/Colors';
import { IconButton, Menu } from 'react-native-paper';
import { router, useGlobalSearchParams } from 'expo-router';
import ConfirmModal from './modals/ConfirmModal';
import api from '../../util/api';
import InputModal from './modals/InputModal';
import { AppMediumText, AppRegularText } from '../../styles/fonts';

export default function TestBanner({ data, allTests, setAllTests, isDashboard = true }) {

    const [isMenuVisible, setMenuVisible] = useState(false);
    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);
    const { width } = useWindowDimensions();
    const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
    const [isInputModalVisible, setInputModalVisible] = useState(false);
    const [newTestName, setNewTestName] = useState("");
    const [confirmUnpublish, setConfirmUnpublish] = useState(false)

    const isPublished = data.status === 'PUBLISHED';

    const { classroomId } = useGlobalSearchParams();


    function handleEdit() {
        console.log('edit')
        router.push({
            pathname: '/[classroomId]/(tabs)/tests/[testId]/edit',
            params: {
                classroomId: data.classroomId,
                testId: data.testId,
                title: data.testTitle,
            },
        })
    }

    function handlePublish() {
        console.log('publish')
        router.push({
            pathname: '/[classroomId]/(tabs)/tests/[testId]/publish',
            params: {
                classroomId: data.classroomId,
                testId: data.testId,
                test: data.testTitle
            },
        })
    }

    async function handleRename() {
        if (newTestName.trim().length == 0) return;
        const success = await renameTest(classroomId, data.testId, newTestName);
        if (success) {
            setAllTests(allTests.map(test => {
                if (test.testId == data.testId) {
                    test.testTitle = newTestName;
                }
                return test;
            }));
        }
        setInputModalVisible(false);
    }

    async function handleUnPublish() {
        setConfirmUnpublish(true)
    }

    async function unpuplishCreatedTest() {
        const success = await unPublishTest(classroomId, data.testId);
        if (success) {
            setAllTests(allTests.map(test => {
                if (test.testId == data.testId) {
                    test.status = 'DRAFT';
                }
                return test;
            }));
        }
    }

    async function handleDelete() {
        const success = await deleteTest(classroomId, data.testId);
        if (success) {
            setAllTests(allTests.filter(test => test.testId !== data.testId));
        }
        setConfirmModalVisible(false)
    }



    return (
        <View style={styles.card}>

            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Ionicons name='clipboard-outline' size={22} color={Colors.primaryColor} />
                    <Text onPress={handleEdit} style={styles.title}>
                        {data.testTitle}
                    </Text>
                    <View style={[
                        styles.statusBadge,
                        data.status === "DRAFT" && styles.draftBadge
                    ]}>
                        <AppRegularText style={styles.statusText}>
                            {data.status === "DRAFT" ? 'Draft' : 'Published'}
                        </AppRegularText>
                    </View>
                </View>

                <Menu
                    key={isMenuVisible ? 'visible' : 'invisible'}
                    visible={isMenuVisible}
                    onDismiss={closeMenu}
                    anchor={
                        <IconButton
                            icon="dots-vertical"
                            onPress={openMenu}
                            iconColor='black'
                        />
                    }
                    anchorPosition='bottom'
                    contentStyle={styles.menuContentStyle}
                >
                    <Menu.Item title="Preview" onPress={() => { closeMenu(); }} />
                    {
                        data.status === 'DRAFT' ? (
                            <Menu.Item title="Edit" onPress={() => { closeMenu(); handleEdit() }} />
                        ) : <Menu.Item title="Unpublish" onPress={() => { closeMenu(); handleUnPublish(); }} />
                    }
                    <Menu.Item title="Rename" onPress={() => { closeMenu(); setInputModalVisible(true) }} />
                    <Menu.Item title="Delete" onPress={() => { closeMenu(); setConfirmModalVisible(true) }} />
                </Menu>
            </View>

            <View style={styles.infoSection}>

                <View style={styles.infoItem}>
                    <MaterialCommunityIcons name="timer-outline" size={16} />
                    <Text style={styles.infoText}>
                        {data.timedTest ? `${data.durationMinutes} min` : 'Untimed'}
                    </Text>
                </View>

                <View style={styles.infoItem}>
                    <Feather name="repeat" size={16} />
                    <Text style={styles.infoText}>
                        {data.maximumAttempts == 0 ? 'Unlimited' : data.maximumAttempts}
                    </Text>
                </View>

                <View style={styles.infoItem}>
                    <MaterialCommunityIcons name="check-decagram-outline" size={16} />
                    <Text style={styles.infoText}>
                        {data.correctionMethod}
                    </Text>
                </View>
            </View>

            {isDashboard ? (
                <View style={styles.actions}>
                    <View style={styles.dateContainer}>
                        <AppRegularText style={styles.date}>
                            {new Date(data.createdAt * 1000).toLocaleDateString()}
                        </AppRegularText>
                    </View>
                    <Pressable
                        style={[
                            styles.primaryBtn,
                        ]}
                        onPress={isPublished ? () => {
                            router.push({
                                pathname: '/[classroomId]/(tabs)/tests/[testId]/submission',
                                params: {
                                    classroomId: data.classroomId,
                                    testId: data.testId,
                                    title: data.testTitle,
                                    preview: 0,
                                },
                            })
                        } : handlePublish}
                    >
                        <Ionicons
                            name={data.status === 'DRAFT' ? 'cloud-upload-outline' : 'eye-outline'}
                            size={16}
                            color="white"
                            style={{ marginRight: 8 }}
                        />
                        <AppMediumText style={[styles.primaryBtnText]}>
                            {data.status === 'DRAFT' ? 'Publish' : 'View'}
                        </AppMediumText>
                    </Pressable>

                </View>
            ) : null}

            {isConfirmModalVisible ? (
                <ConfirmModal
                    message={'Are you sure, Delete the Test?'}
                    onConfirm={handleDelete}
                    onCancel={() => setConfirmModalVisible(false)}
                    visible={isConfirmModalVisible}
                />
            ) : null}

            {isInputModalVisible ? (
                <InputModal
                    defaultValue={data.testTitle}
                    placeholder={'New test name'}
                    onValueChange={setNewTestName}
                    onConfirm={handleRename}
                    visible={isInputModalVisible}
                    onCancel={() => setInputModalVisible(false)}
                />
            ) : null}
            <ConfirmModal visible={confirmUnpublish} message={'Do you want un publish the test?'} onConfirm={() => { unpuplishCreatedTest(); setConfirmUnpublish(false) }} onCancel={() => setConfirmUnpublish(false)} />
        </View>
    );

}

async function deleteTest(classroomId, testId) {
    try {
        const result = await api.delete(`/api/tests/deleteTest`, {
            headers: {
                'X-ClassroomId': classroomId,
                'X-TestId': testId
            }
        });
        if (result.status == 200 && result.data.success) {
            console.log('test deleted successfully');
            return result.data.success;
        } else {
            console.log('test not deleted');
        }
    } catch (err) {
        console.log(err);
    }
    return false;
}

async function unPublishTest(classroomId, testId) {
    try {
        const result = await api.patch(`/api/tests/unPublishTest`, {
        }, {
            headers: {
                'X-ClassroomId': classroomId,
                'X-TestId': testId,
            },
        });
        if (result.status === 200) {
            console.log('Test unpublished successfully');
            return true;
        } else {
            console.log('Failed to unpublish test');
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function renameTest(classroomId, testId, newTitle) {

    try {
        const result = await api.patch(`/api/tests/renameTest`, {
            testTitle: newTitle
        }, {
            headers: {
                'X-ClassroomId': classroomId,
                'X-TestId': testId,
            }
        })


        if (result.status == 200 && result.data.success) {
            console.log('test renamed successfully');
            return result.data.success;
        } else {
            console.log('test not renamed');
        }
    } catch (err) {
        console.log(err);
    }
    return false;
}

const styles = StyleSheet.create({

    card: {
        backgroundColor: Colors.white,
        padding: 22,
        borderRadius: 16,
        // marginVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 20,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F1F1F1',
        maxWidth: 340,
        width: '100%',
        marginBottom: 15,
        ...(Platform.OS == 'web' ? {
            margin: 16,
        } : {})
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 10,
        flex: 1
    },

    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1A1A1A'
    },

    statusBadge: {
        backgroundColor: '#E6F4EA',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },

    draftBadge: {
        backgroundColor: '#FFF4E5',
    },

    statusText: {
        fontSize: 12,
        color: Colors.primaryColor
    },

    infoSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        gap: 25,
        marginTop: 18,
        flexWrap: 'wrap'
    },

    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },

    infoText: {
        fontSize: 13,
        color: Colors.gray,
    },

    dateContainer: {
        // marginLeft: 'auto'
    },

    date: {
        fontSize: 12,
        color: Colors.lightFont
    },

    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 22
    },

    primaryBtn: {
        backgroundColor: Colors.primaryColor,
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        // gap : 10
    },

    secondaryBtn: {
        backgroundColor: '#ddd',
    },

    secondaryBtnText: {
        color: Colors.secondaryColor,
        fontWeight: '500'
    },
    primaryBtnText: {
        color: 'white',
        fontWeight: '500'
    },

    editBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },

    menuContentStyle: {
        borderRadius: 12,
    }

});
