import { Pressable, StyleSheet, View, Text, Modal, Button } from 'react-native'
import React, { useState } from 'react'
import api from '../../util/api'
import Colors from '../../styles/Colors';
import { Menu, IconButton } from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons';




export default function Classroom({ id, name, createdAt, createdBy, setClassroomID, setCreatedClassrooms, createdClassrooms }) {


    const dropDownOptions = {
       rename : {
            name: "Rename",
            action: async (newName) => {
                const res = await renameClass(id, newName);
                if (res) {
                    setCreatedClassrooms(createdClassrooms.map(classroom => {
                        if (classroom.classroomId == id){
                            classroom.classroomName = newName
                        } 
                        return classroom;
                    }));
                } else {
                    console.log("can't rename");
                }
            }
        },
        delete : {
            name: "Delete",
            action: async () => {
                const res = await deleteClassRoom(id);
                if (res) {
                    setCreatedClassrooms(createdClassrooms.filter(classroom => classroom.classroomId != id));
                } else {
                    console.log("can't delete classroom")
                }
            }
        }
    }


    const [visible, setVisible] = useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    // const [isInfoVisible, setInfoVisible] = useState(false);

    return (
        <View style={styles.container}>
            <View style={{ alignSelf: 'flex-end' }}>
                <Menu
                    key={visible ? 'open' : 'closed'}
                    visible={visible}
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

                    <Menu.Item title={dropDownOptions.rename.name} onPress={() => { closeMenu(); dropDownOptions.rename.action("renamed") }} titleStyle={styles.menuTitleStyle} />
                    <Menu.Item title={dropDownOptions.delete.name} onPress={() => { closeMenu(); dropDownOptions.delete.action() }} titleStyle={styles.menuTitleStyle} />

                </Menu>
            </View>
            <Pressable onPress={() => setClassroomID(id)}>
                <View style={styles.classContainer}>
                    <MaterialCommunityIcons name="google-classroom" size={30} />
                    <Text>{name}</Text>
                </View>
            </Pressable>
            {/* {isInfoVisible ? <Modal

                visible={isInfoVisible}
                transparent
                animationType='fade'
            >
                <View style={styles.infoContainer}>
                    <View style={styles.info}>
                        <IconButton
                            icon='close'
                            onPress={() => setInfoVisible(false)}
                            style={styles.closeIcon}
                        />
                        <Text>Name :  {name}</Text>
                        <Text>Created at : {new Date(createdAt).toLocaleDateString()}</Text>
                    </View>
                </View>
            </Modal> : null} */}
        </View>
    );
}





async function deleteClassRoom(classroomId) {
    try {
        const result = await api.delete("/api/delete-classroom", {
            headers: {
                "X-ClassroomId": classroomId
            }
        });

        return result.data.success;

    } catch (err) {
        console.log(err);
    }
    return false;
}


async function renameClass(id, newName) {

    try {
        const result = await api.post('/api/rename-classroom', { classroomName: newName }, {
            headers: {
                'Content-type': 'application/json',
                'X-ClassroomId': id
            }
        });

        return result.data.success;

    } catch (err) {
        console.log(err);
    }

    return false;
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.25)',
        width: 300,
        alignSelf: 'center',
        padding: 10,
        borderRadius: 8,
        margin: 5,
    },
    className: {
        fontSize: 14,
        alignSelf: 'center',
        margin: 10
    },
    classContainer: {
        alignItems: 'center',
        padding: 50,
        rowGap: 25,
        borderRadius: 8,
    },
    verticalDots: {
        alignSelf: 'flex-end',
    },
    dropDownMenuContainer: {
        position: 'relative',
        alignSelf: 'flex-end',
    },

    menuTitleStyle: {
        color: 'black'
    },
    menuContentStyle: {
        backgroundColor: Colors.bgColor
    },
    closeIcon: {
        color: 'black',
        alignSelf: 'flex-end'
    },
    infoContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    info: {
        width: 300,
        backgroundColor: Colors.bgColor
    }
})


