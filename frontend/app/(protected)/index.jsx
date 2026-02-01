import { StyleSheet, Text, TextInput, Pressable, View, FlatList, Modal, Button, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import api from '../../util/api'
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../../styles/Colors';
import EmptyClassroom from '../../src/components/EmptyClassroom';
import Classroom from '../../src/components/Classroom';


export default function Index() {

    const [createdClassrooms, setCreatedClassrooms] = useState([]);
    const [selectedClassroomId, setSelectedClassroomId] = useState(null);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [classroomName, setClassroomName] = useState("");
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        getAllCreatedClassrooms(setCreatedClassrooms);
    }, [])

    async function handleCreateClassroom() {

        if (classroomName.trim().length == 0) return;

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
            setCreateModalVisible(false);
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
                     createdClassrooms={createdClassrooms}/>
                )}
            /> : null}
            {createModalVisible ?

                <Modal
                    visible={createModalVisible}
                    // onRequestClose={() => setCreateModalVisible(!createModalVisible)}
                    transparent
                    animationType='fade'
                >

                    <View style={styles.createModal}>
                        <View style={{ backgroundColor: Colors.shadeGray, padding: 30 }}>
                            <TextInput placeholder='Class name' onChangeText={(text) => setClassroomName(text)} />
                            <View style={{ flexDirection: 'row' }}>
                                <Button title='close' onPress={() => setCreateModalVisible(false)}></Button>
                                <Button title='create' onPress={() => handleCreateClassroom()}></Button>
                            </View>
                        </View>
                    </View>

                </Modal>

                : null}

            {/* <Button title='open' onPress={() => setCreateModalVisible(true)}/> */}
        </React.Fragment >
    )
}


const styles = StyleSheet.create({

    addButton: {
        backgroundColor: Colors.primaryColor,
        width: 80,
        padding: 7,
        borderRadius: 8,
        marginRight: 20,
    },
    // searchBar: {
    //     padding: 8,
    //     borderWidth: 2,
    //     width : '40%',
    //     flexDirection : 'row',
    //     alignItems : 'center',
    // },
    topBar: {
        flexDirection: 'row',
        margin: 20,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    topBarHeader: {
        fontSize: 18
    },
    createModal:{
        flex: 1,
        alignItems: 'center', 
        justifyContent: 'center' 
    }
})

async function getAllCreatedClassrooms(setCreatedClassrooms) {
    try {
        const result = await api.get('/api/created-classrooms');
       
        if (result?.status == 200) {
            setCreatedClassrooms(result.data);
        }else{
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
                <Text style={{ color: Colors.white }}>Create <FontAwesome name='plus' size={16} color={Colors.white} /> </Text>
            </Pressable>
        </View>
    );
}


{/* <View style={styles.searchBar}>
<FontAwesome name='search' size={16}/>
<TextInput style={{outline : 0,flex:1,marginLeft : 10}} placeholder='search' />
</View> */}