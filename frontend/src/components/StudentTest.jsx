import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native'
import React, { useState } from 'react'
import { Ionicons, MaterialCommunityIcons, Feather, Entypo } from '@expo/vector-icons';
import Colors from '../../styles/Colors';
import { IconButton, Menu } from 'react-native-paper';
import { router } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

export default function StudentTest({ data }) {

    const [isMenuVisible, setMenuVisible] = useState(false);
    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);
    const { width } = useWindowDimensions();

    function handleStart() {
        router.push({
            pathname: '/[classroomId]/(tabs)/test/[testId]/start',
            params: {
                classroomId: data.classroomId,
                testId: data.testId,
            },
        });
    }

    function handleStrategy() {
        router.push({
            pathname: '/[classroomId]/(tabs)/test/[testId]/strategy',
            params: {
                classroomId: data.classroomId,
                testId: data.testId,
            },
        });
    }

    const remaining = data.remainingAttempts;

    return (
        <View style={styles.wrapper}>
            <View style={styles.card}>

                <View style={styles.row}>
                    <Ionicons name='clipboard-outline' size={20} color={Colors.primaryColor} />
                    <Text style={styles.title}>{data.testTitle}</Text>

                    {data.maximumAttempts === data.attemptCount && data.maximumAttempts != 0 && (
                        <View style={styles.finishedBadge}>
                            <Text style={styles.finishedText}>Finished</Text>
                        </View>
                    )}
                    {remaining > 0 && data.maximumAttempts != data.remainingAttempts && (
                        <View style={styles.attemptBadge}>
                            <Text style={styles.attemptText}>
                                {remaining} Attempts Left
                            </Text>
                        </View>

                    )}
                    {data.maximumAttempts === data.remainingAttempts && (<View style={styles.newBadge}>
                        <Text style={styles.newText}>New</Text>
                    </View>)}

                    {data.attemptCount > 0 && data.maximumAttempts === 0 && (<View style={styles.newBadge}>
                        <Text style={styles.newText}>Attempted</Text>
                    </View>)}

                    <Menu
                        key={isMenuVisible ? 'visible' : 'invisible'}
                        visible={isMenuVisible}
                        onDismiss={closeMenu}
                        anchorPosition='bottom'
                        anchor={
                            <IconButton
                                icon="dots-vertical"
                                onPress={openMenu}
                                iconColor='black'
                            />
                        }
                        contentStyle={styles.menuContentStyle}
                    >
                        <Menu.Item title="Preview" onPress={() => { closeMenu(); }} titleStyle={styles.menuTitleStyle} />
                    </Menu>
                </View>

                <View style={styles.infoRow}>
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
                        <Text style={styles.infoText}>{data.correctionMethod}</Text>
                    </View>

                    {data.attemptCount!=0? (
                        <View style={styles.btnContainer}>
                            <Pressable style={styles.btnInsideContainer} onPress={handleStart}>
                                <Entypo name="controller-play" size={20} color="black" />
                                <Text>ReAttempt</Text>
                            </Pressable>
                        </View>
                    ) : (
                        <View style={styles.btnContainer}>
                            <Pressable style={styles.btnInsideContainer} onPress={handleStrategy}>
                                <Entypo name="controller-play" size={20} color="black" />
                                <Text>Start</Text>
                            </Pressable>
                        </View>
                    )}

                    {width >= 890 ? (
                        <View style={styles.createdAt}>
                            <Text style={styles.date}>
                                {new Date(data.createdAt * 1000).toLocaleDateString()}
                            </Text>
                        </View>
                    ) : null}
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

    draftBadge: {
        backgroundColor: '#FFF3CD',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },

    draftText: {
        fontSize: 12,
        color: '#856404',
    },

    infoRow: {
        flexDirection: 'row',
        marginTop: 14,
        flexWrap: 'wrap',
        gap: 14,
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
    menuTitleStyle: {
        color: 'black'
    },
    menuContentStyle: {
        backgroundColor: Colors.bgColor
    },
    btnContainer: {
        // marginLeft: 'auto',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderWidth: 0.5,
        width: 120,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnInsideContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 10,
        width: '100%',
    },
    createdAt: {
        alignSelf: 'flex-end',
        marginLeft: 'auto',
        marginRight: 15
    },
    date: {
        // color : Colors.black
    },
    attemptBadge: {
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    attemptText: {
        fontSize: 12,
        color: '#0D47A1',
    },
    finishedBadge: {
        backgroundColor: '#E0E0E0',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    finishedText: {
        fontSize: 12,
        color: '#424242',
    },
    newBadge: {
        backgroundColor: '#E0E0E0',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    newText: {
        fontSize: 12,
        color: '#424242',
    },
});



