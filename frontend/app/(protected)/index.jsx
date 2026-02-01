import { StyleSheet, Text, TextInput, Pressable, View, FlatList, Modal, Button, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import api from '../../util/api'
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import Colors from '../../styles/Colors';
import EmptyClassroom from '../../src/components/EmptyClassroom';
import Classroom from '../../src/components/Classroom';
import InputModal from '../../src/components/modals/InputModal';


export default function Index() {

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
        <React.Fragment>
            <TopBar setCreateModalVisible={setCreateModalVisible} />
            {createdClassrooms.length == 0 ? <EmptyClassroom /> : null}
            {createdClassrooms.length != 0 ? <FlatList
                // numColumns={2}
                // horizontal={true}
                data={createdClassrooms}
                keyExtractor={item => item.classroomId}
                renderItem={({ item }) => (
                    <Classroom id={item.classroomId} name={item.classroomName}
                        createdAt={item.createdAt} createdBy={item.createdBy}
                        setClassroomID={setSelectedClassroomId}
                        setCreatedClassrooms={setCreatedClassrooms}
                        createdClassrooms={createdClassrooms} />
                )}
            /> : null}
            {createModalVisible ?


                <InputModal placeholder={"Class name"}
                    visible={createModalVisible}
                    onValueChange={setClassroomName}
                    onConfirm={onConfirmCreateClassModal}
                    onCancel={onCancelCreateClassModal} />

                // <Modal
                //     visible={createModalVisible}
                //     onRequestClose={() => setCreateModalVisible(!createModalVisible)}
                //     transparent
                //     animationType='fade'
                // >

                //     <View style={styles.createModal}>
                //         <View style={styles.createModalContent}>
                //             <TextInput style={styles.inputBox} placeholder='Class name' onChangeText={(text) => setClassroomName(text)} />
                //             <View style={{ flexDirection: 'row' }}>
                //                 <Pressable onPress={() => setCreateModalVisible(false)}>
                //                     <Text>Cancel</Text>
                //                 </Pressable>
                //                 <Pressable onPress={handleCreateClassroom}>
                //                     <Text>Create</Text>
                //                 </Pressable>
                //             </View>
                //         </View>
                //     </View>

                // </Modal>

                : null}
        </React.Fragment >
    )
}


const styles = StyleSheet.create({

    addButton: {
        backgroundColor: Colors.primaryColor,
        width: 90,
        padding: 10,
        borderRadius: 8,
        marginRight: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    topBar: {
        flexDirection: 'row',
        margin: 20,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    topBarHeader: {
        fontSize: 18
    },
    createModal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    createModalContent: {
        backgroundColor: Colors.white,
        boxShadow: Colors.blackBoxShadow,
        padding: 30,
        borderRadius: 8
    },
    inputBox: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 8,
    }
})

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
            <Pressable style={styles.addButton} onPress={() => setCreateModalVisible(true)}>
                <Text style={{ color: Colors.white, fontSize: 15 }}>Create <AntDesign name='plus' size={16} color={Colors.white} /> </Text>
            </Pressable>
        </View>
    );
}


{/* <View style={styles.searchBar}>
<FontAwesome name='search' size={16}/>
<TextInput style={{outline : 0,flex:1,marginLeft : 10}} placeholder='search' />
</View> */}