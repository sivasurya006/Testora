import { StyleSheet, Text, TextInput, Pressable, View, FlatList, Modal, Button, Platform, useWindowDimensions } from 'react-native'
import React, { useEffect, useReducer, useState } from 'react'
import api from '../../../util/api'
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import Colors from '../../../styles/Colors';
import EmptyClassroom from '../../../src/components/EmptyClassroom';
import Classroom from '../../../src/components/Classroom';
import InputModal from '../../../src/components/modals/InputModal';
import { useRouter } from 'expo-router';
import { fonts } from '../../../styles/fonts';

const classroom_width = 320;

export default function Index() {

    const { width } = useWindowDimensions();

    const numColumns = Math.floor((width - 230) / classroom_width);

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
        if (!selectedClassroomId) return;
        console.log(selectedClassroomId);
        router.push(`/${selectedClassroomId}/`)
    }, [selectedClassroomId])

    const onCancelCreateClassModal = () => setCreateModalVisible(false);

    useEffect(() => {
        getAllCreatedClassrooms(setCreatedClassrooms);
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
        <View style={{flex:1,marginHorizontal:10}}>
            <TopBar setCreateModalVisible={setCreateModalVisible} />
            {createdClassrooms.length == 0 ? (
                <EmptyClassroom message="No classroom created" />
            ) : <FlatList
                numColumns={numColumns}
                data={createdClassrooms}
                key={numColumns}
                keyExtractor={item => item.classroomId}
                renderItem={({ item }) => (
                    <Classroom id={item.classroomId} name={item.classroomName}
                        createdAt={item.createdAt} createdBy={item.createdBy}
                        setClassroomID={setSelectedClassroomId}
                        setCreatedClassrooms={setCreatedClassrooms}
                        createdClassrooms={createdClassrooms}
                        isMenuNeed={true} />
                )}
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

function TopBar({ setCreateModalVisible }) {
    return (
        <View style={styles.topBar}>
            <Text style={styles.topBarHeader}>My Classrooms</Text>

            <Pressable
                style={styles.addButton}
                onPress={() => setCreateModalVisible(true)}
            >
                <View style={styles.addButtonContent}>
                    <Text style={styles.addButtonText}>Create</Text>
                    <AntDesign name="plus" size={16} color={Colors.white} />
                </View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    topBar: {
        flexDirection: 'row',
        margin: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    topBarHeader: {
        fontSize: 18,
        fontFamily : fonts.bold
    },

    addButton: {
        backgroundColor: Colors.primaryColor,
        width: 90,
        padding: 10,
        borderRadius: 8,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    addButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    addButtonText: {
        color: Colors.white,
        fontSize: 15,
        marginRight: 6,
    },
});


{/* <View style={styles.searchBar}>
<FontAwesome name='search' size={16}/>
<TextInput style={{outline : 0,flex:1,marginLeft : 10}} placeholder='search' />
</View> */}