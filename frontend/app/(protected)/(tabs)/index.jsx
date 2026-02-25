import { StyleSheet, Text, TextInput, Pressable, View, FlatList, Modal, Button, Platform, useWindowDimensions, Dimensions } from 'react-native'
import React, { useContext, useEffect, useReducer, useState } from 'react'
import api from '../../../util/api'
import { AntDesign, FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import Colors from '../../../styles/Colors';
import EmptyClassroom from '../../../src/components/EmptyClassroom';
import Classroom from '../../../src/components/Classroom';
import InputModal from '../../../src/components/modals/InputModal';
import { useRouter } from 'expo-router';
import { AppSemiBoldText, fonts } from '../../../styles/fonts';
import LoadingScreen from '../../../src/components/LoadingScreen';
import { ActivityIndicator } from 'react-native-paper';
import Header from '../../../src/components/Header';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../../util/AuthContext';


const { width } = Dimensions.get('window')
const classroom_width = width > 400 ? 380 : 340;

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
    const [search, setSearch] = useState('');

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

    const filteredClassrooms = createdClassrooms.filter(item =>
        item.classroomName.toLowerCase().includes(search.toLowerCase())
    );

    async function handleCreateClassroom() {
        try {
            setLoading(true);
            const result = await api.post('/api/create-classroom', { classroomName }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (result.status == 200) {
                setCreatedClassrooms([result.data, ...createdClassrooms]);
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
                    <TopBar
                        setCreateModalVisible={setCreateModalVisible}
                        isLargeScreen={isLargeScreen}
                        search={search}
                        setSearch={setSearch}
                    />
                    {createdClassrooms.length == 0 ? (
                        <EmptyClassroom message="No classroom created" />
                    ) : <FlatList
                        numColumns={numColumns}
                        data={filteredClassrooms}
                        key={numColumns}
                        keyExtractor={item => item.classroomId.toString()}
                        renderItem={({ item }) => (
                            <Classroom id={item.classroomId} name={item.classroomName}
                                createdAt={item.createdAt} createdBy={item.createdBy}
                                setClassroomID={setSelectedClassroomId}
                                setCreatedClassrooms={setCreatedClassrooms}
                                createdClassrooms={createdClassrooms}
                                isMenuNeed={true}
                                totalStudents={item.totalStudents}
                                totalTests={item.totalTests}
                            />
                        )}
                    // columnWrapperStyle={
                    //     numColumns > 1 ? { justifyContent: 'center' , gap : 25 } : null
                    // }
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
            setCreatedClassrooms(result.data.reverse());
        } else {
            console.log(`can't fetch created classrooms`);
        }
    } catch (err) {
        console.log(err)
    }
}

function TopBar({ setCreateModalVisible, isLargeScreen, search, setSearch }) {

    const [isHovered, setIsHovered] = useState(false);
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const { signOut } = useContext(AuthContext);


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
                        <Pressable
                            onPress={() => {
                                setTooltipVisible(true);
                            }}
                        >
                            <MaterialIcons name='account-circle' size={34} color={Colors.secondaryColor} />
                        </Pressable>
                    )
                }
                <Modal transparent visible={tooltipVisible} animationType="fade">
                    <Pressable
                        style={{ flex: 1 }}
                        onPress={() => setTooltipVisible(false)}
                    >
                        <View
                            style={{
                                position: 'absolute',
                                top: 65,
                                right: 50,
                                backgroundColor: 'white',
                                borderRadius: 8,
                                padding: 4,
                                elevation: 10,
                                shadowColor: Colors.shadowColor,
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.25,
                                shadowRadius: 6,
                                minWidth: 140,
                            }}
                        >
                            <Pressable
                                style={({ pressed }) => [
                                    {
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 10,
                                        paddingVertical: 10,
                                        paddingHorizontal: 12,
                                        borderRadius: 6,
                                        backgroundColor: pressed ? '#ffe6e6' : 'white',
                                    },
                                ]}
                                onPress={() => {

                                    console.log('Logging out...');
                                    setTooltipVisible(false);
                                    signOut();
                                }}
                            >
                                <MaterialIcons name="logout" size={20} color="#d32f2f" />
                                <AppSemiBoldText style={{ color: '#d32f2f', fontSize: 16 }}>
                                    Log out
                                </AppSemiBoldText>
                            </Pressable>
                        </View>
                    </Pressable>
                </Modal>

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
        marginRight: 30
    },
    tooltip: {
        position: 'absolute',
        top: 30,
        backgroundColor: 'white',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,

        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,

        zIndex: 2000,

        width: 100,
        height: 100,

        elevation: 5,
        // minWidth: 80,
        // maxWidth: 230,

    }
});


