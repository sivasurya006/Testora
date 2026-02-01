import { Pressable, StyleSheet, View, Text, Button, Alert } from 'react-native'
import React, { useState } from 'react'
import api from '../../util/api'
import Colors from '../../styles/Colors';
import { Menu, IconButton } from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ConfirmModal from './modals/ConfirmModal';
import InputModal from './modals/InputModal';




export default function Classroom({ id, name, createdAt, createdBy, setClassroomID, setCreatedClassrooms, createdClassrooms , isMenuNeed}) {


    const [isDeleteConfirmModalVisible, setDeleteModalVisible] = useState(false);
    const [isRenameModalVisible, setReNameModalVisible] = useState(false);
    const [newClassName, setNewClassName] = useState(false);

    const onDeleteConfirm = async () => {
        await handleDelete();
        onDeleteCancel(); // set the confirm back to false
    };
    const onDeleteCancel = () => {
        setDeleteModalVisible(false);
    }

    const onConfirmRenameClassroom = async () => {
        if (newClassName.trim().length == 0) return;
        await handleRenameClassroom();
        onCancelRenameClassroom();
    }
    const onCancelRenameClassroom = () => setReNameModalVisible(false);

    const handleRenameClassroom = async () => {
        const res = await renameClass(id, newClassName);
        if (res) {
            setCreatedClassrooms(createdClassrooms.map(classroom => {
                if (classroom.classroomId == id) {
                    classroom.classroomName = newClassName
                }
                return classroom;
            }));
        } else {
            console.log("can't rename");
        }
    }

    const handleDelete = async () => {
        const res = await deleteClassRoom(id);
        if (res) {
            setCreatedClassrooms(createdClassrooms.filter(classroom => classroom.classroomId != id));
        } else {
            console.log("can't delete classroom")
        }
    }



    const [isMenuVisible, setMenuVisible] = useState(false);
    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    return (
        <View style={styles.container}>
            {
                isMenuNeed ? (
                    <View style={{ alignSelf: 'flex-end' }}>
                    <Menu
                        key={isMenuVisible ? 'open' : 'closed'}
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
    
                        <Menu.Item title="Rename" onPress={() => { closeMenu(); setReNameModalVisible(true) }} titleStyle={styles.menuTitleStyle} />
                        <Menu.Item title="Delete" onPress={() => { closeMenu(); setDeleteModalVisible(true) }} titleStyle={styles.menuTitleStyle} />
    
                    </Menu>
                </View>
                ) : null
            }
            <Pressable onPress={() => setClassroomID(id)}>
                <View style={styles.classContainer}>
                    <MaterialCommunityIcons name="google-classroom" size={30} />
                    <Text>{name}</Text>
                </View>
            </Pressable>

            {
                isDeleteConfirmModalVisible ?
                    <ConfirmModal message={"Do you really want delete classroom?"}
                        visible={isDeleteConfirmModalVisible} onCancel={onDeleteCancel} onConfirm={onDeleteConfirm} />
                    : null
            }

            {
                isRenameModalVisible ?
                    <InputModal placeholder={"New class name"} visible={isRenameModalVisible}
                        onConfirm={onConfirmRenameClassroom} onCancel={onCancelRenameClassroom}
                        onValueChange={setNewClassName} />
                    : null
            }

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


