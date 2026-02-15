import { StyleSheet, Text, TextInput, Pressable, View, FlatList, Modal, Button, Platform, useWindowDimensions, Dimensions } from 'react-native'
import React, { useEffect, useReducer, useState } from 'react'
import api from '../../../util/api'
import { AntDesign, FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import Colors from '../../../styles/Colors';
import EmptyClassroom from '../../../src/components/EmptyClassroom';
import Classroom from '../../../src/components/Classroom';
import InputModal from '../../../src/components/modals/InputModal';
import { useRouter } from 'expo-router';
import { fonts } from '../../../styles/fonts';
import LoadingScreen from '../../../src/components/LoadingScreen';
import { ActivityIndicator } from 'react-native-paper';
import Header from '../../../src/components/Header';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

const classroom_width = 340;
const { width } = Dimensions.get('window')

export default function Index() {

    const { width } = useWindowDimensions();
    const isLargeScreen = width > 821;

    const numColumns = Math.floor((width - 300) / classroom_width);

    console.log(numColumns)

    const [createdClassrooms, setCreatedClassrooms] = useState([]);
    const [selectedClassroomId, setSelectedClassroomId] = useState(null);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [classroomName, setClassroomName] = useState("");
    const [isLoading, setLoading] = useState(false);

    const onConfirmCreateClassModal = async () => {
        if (classroomName.trim().length == 0) return;
        await handleCreateClassroom();
        setCreateModalVisible(false);
    }

    const router = useRouter();
    useEffect(() => {
        setSelectedClassroomId(null);  // reset
        setTimeout(() => setSelectedClassroomId(selectedClassroomId), 0);
        if (!selectedClassroomId) return;
        console.log(selectedClassroomId);
        router.push(`/${selectedClassroomId}/`)
    }, [selectedClassroomId])

    const onCancelCreateClassModal = () => setCreateModalVisible(false);

    useEffect(() => {
        const get = async () => {
            setLoading(true)
            await getAllCreatedClassrooms(setCreatedClassrooms);
            setLoading(false)
        }
        get()
    }, [])

    async function handleCreateClassroom() {
        try {
            setLoading(true);
            const result = await api.post('/api/create-classroom', { classroomName }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (result.status == 200) {
                setCreatedClassrooms([...createdClassrooms, result.data]);
            } else {
                throw new Error("request failed");
            }
            setClassroomName("");
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }

    }

    return (
        <>
            <StatusBar backgroundColor={Colors.bgColor} />
            <SafeAreaView style={{ flex: 1 }} edges={['top']} >

                {/* <Header /> */}
                <View style={{ flex: 1, backgroundColor: Colors.bgColor }}>

                    <LoadingScreen visible={isLoading} />
                    <TopBar setCreateModalVisible={setCreateModalVisible} isLargeScreen={isLargeScreen} />
                    {createdClassrooms.length == 0 ? (
                        <EmptyClassroom message="No classroom created" />
                    ) : <FlatList
                        numColumns={numColumns}
                        data={createdClassrooms}
                        key={numColumns}
                        keyExtractor={item => item.classroomId.toString()}
                        renderItem={({ item }) => (
                            <Classroom id={item.classroomId} name={item.classroomName}
                                createdAt={item.createdAt} createdBy={item.createdBy}
                                setClassroomID={setSelectedClassroomId}
                                setCreatedClassrooms={setCreatedClassrooms}
                                createdClassrooms={createdClassrooms}
                                isMenuNeed={true} />
                        )}
                        columnWrapperStyle={
                            numColumns > 1 ? { justifyContent: 'center' , gap : 25 } : null
                        }
                    />
                    }
                    {createModalVisible ?
                        <InputModal placeholder={"Class name"}
                            visible={createModalVisible}
                            onValueChange={setClassroomName}
                            onConfirm={onConfirmCreateClassModal}
                            onCancel={onCancelCreateClassModal} />
                        : null}

                </View >
            </SafeAreaView>
        </>
    )
}


async function getAllCreatedClassrooms(setCreatedClassrooms) {
    try {
        const result = await api.get('/api/created-classrooms');

        if (result?.status == 200) {
            setCreatedClassrooms(result.data);
        } else {
            console.log(`can't fetch created classrooms`);
        }
    } catch (err) {
        console.log(err)
    }
}

function TopBar({ setCreateModalVisible, isLargeScreen }) {

    const [isHovered, setIsHovered] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);

    return (
        <View style={styles.topBar}>
            <Text style={styles.topBarHeader}>My Classrooms</Text>

            <View style={styles.rightSection}>
                <View style={styles.searchContainer}>

                    <Ionicons name="search" size={18} color={Colors.dimBg} />

                    <TextInput
                        placeholder="Search classrooms..."
                        placeholderTextColor={Colors.dimBg}
                        value={search}
                        onChangeText={setSearch}
                        style={styles.searchInput}
                    />
                </View>
                <Pressable
                    style={[
                        styles.addButton,
                        isHovered && styles.hoveredButton
                    ]}
                    onHoverIn={() => setIsHovered(true)}
                    onHoverOut={() => setIsHovered(false)}
                    onPress={() => setCreateModalVisible(true)}
                >
                    <View style={styles.addButtonContent}>
                        <AntDesign name="plus" size={15} color="#fff" />
                        <Text style={styles.addButtonText}>Create</Text>
                    </View>
                </Pressable>
                {
                    isLargeScreen && (
                        <Pressable>
                            <MaterialIcons
                                name='account-circle'
                                size={34}
                                color={Colors.secondaryColor}
                            />
                        </Pressable>
                    )
                }

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    topBar: {
        flexDirection: 'row',
        margin: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        ...(width < 800 ? {
            flexDirection: 'column',
            gap: 20,
            alignItems: 'flex-start',
            marginHorizontal: 10
        } : {})
    },

    topBarHeader: {
        fontSize: 22,
        fontFamily: fonts.bold,
    },

    addButton: {
        backgroundColor: Colors.primaryColor,
        // width: 90,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    addButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10
    },

    addButtonText: {
        color: Colors.white,
        fontSize: 15,
        marginRight: 6,
        fontWeight: 500,
        fontFamily: fonts.regular
    },
    hoveredButton: {
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 38,
        width: '58%',
        borderWidth: 1,
        borderColor: Colors.primaryColor + '30',
    },

    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        color: Colors.secondaryColor,
        outlineWidth: 0
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
});


