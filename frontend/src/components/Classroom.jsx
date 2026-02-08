import { Pressable, StyleSheet, View, Text, Button, Alert } from 'react-native'
import React, { useState } from 'react'
import api from '../../util/api'
import Colors from '../../styles/Colors';
import { Menu, IconButton } from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ConfirmModal from './modals/ConfirmModal';
import InputModal from './modals/InputModal';




export default function Classroom({ id, name, createdAt, createdBy, setClassroomID, setCreatedClassrooms, createdClassrooms, isMenuNeed }) {


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
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                    <Text style={styles.className}>{name}</Text>
                    <Text style={styles.createdAt}>
                        Created on {new Date(createdAt*1000).toLocaleDateString()}
                    </Text>
                </View>
                {
                    isMenuNeed ? (
                        <View>
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
            </View>
            <Pressable onPress={() => setClassroomID(id)}>
                <View style={styles.classContainer}>
                    <MaterialCommunityIcons
                        name="google-classroom"
                        size={34}
                        color={Colors.secondaryColor}
                    />

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
        const result = await api.patch('/api/rename-classroom', { classroomName: newName }, {
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
        alignSelf: 'center',
        padding: 18,
        borderRadius: 12,
        margin: 8,
        minWidth: 280,
        maxWidth: 280,
        flex: 1,
        boxShadow: Colors.blackBoxShadow,
        marginHorizontal: 10
    },

    classContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 30,
        paddingHorizontal: 20,
        borderRadius: 10,
        rowGap: 12,
        marginTop : 10,
        backgroundColor: Colors.bgColor,
        borderWidth: 1,
        borderColor: Colors.tagBg,
    },

    className: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.secondaryColor,
        marginTop: 6,
    },

    menuTitleStyle: {
        color: Colors.secondaryColor,
        fontWeight: '500',
    },

    menuContentStyle: {
        backgroundColor: Colors.white,
        borderRadius: 8,
    },
    createdAt: {
        fontSize: 12,
        color: Colors.shadeGray,
        marginTop: 2,
    },
    
});



