import { Pressable, StyleSheet, View, Text, Button, Alert, Dimensions, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import api from '../../util/api'
import Colors from '../../styles/Colors';
import { Menu, IconButton } from 'react-native-paper'
import { FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import ConfirmModal from './modals/ConfirmModal';
import InputModal from './modals/InputModal';
import { AppMediumText, AppRegularText, AppSemiBoldText, fonts } from '../../styles/fonts';
import LoadingScreen from './LoadingScreen';


const { width } = Dimensions.get('window')

export default function Classroom({ id, name, createdAt, createdBy, setClassroomID, setCreatedClassrooms, createdClassrooms, isMenuNeed , totalStudents , totalTests , totalAttempted}) {


    const newTests = totalTests - totalAttempted;
    const progress = totalTests > 0 ? (totalAttempted / totalTests) * 100 : 0;
    const [isDeleteConfirmModalVisible, setDeleteModalVisible] = useState(false);
    const [isRenameModalVisible, setReNameModalVisible] = useState(false);
    const [newClassName, setNewClassName] = useState(false);
    const [enterHovered, setEnterHovered] = useState(false);
    const [isLoading, setLoading] = useState(false);

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
        setLoading(true)
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
        setLoading(false);
    }

    const handleDelete = async () => {
        setLoading(true)
        const res = await deleteClassRoom(id);
        if (res) {
            setCreatedClassrooms(createdClassrooms.filter(classroom => classroom.classroomId != id));
        } else {
            console.log("can't delete classroom")
        }
        setLoading(false)
    }


    const [isHovered, setHovered] = useState(false)
    const [isMenuVisible, setMenuVisible] = useState(false);
    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    return (
        <>
            <LoadingScreen visible={isLoading} />
            <TouchableOpacity
                onPress={() => setClassroomID(id)}
                style={[
                    styles.container,
                    isHovered && styles.hoveredClass
                ]}
                onHoverIn={() => setHovered(true)}
                onHoverOut={() => setHovered(false)}
            >

                <View style={styles.classHeader} >
                    {isMenuNeed ? <MaterialIcons name='groups' size={40} color={Colors.lightFont} /> : <Ionicons name='school' size={40} color={Colors.lightFont} />}
                </View>
                <View style={styles.classContainer}>
                    <View>
                        <Text style={styles.className}>{name}</Text>
                        <Text style={styles.createdAt}>
                            Created on {new Date(createdAt * 1000).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                // weekday: 'short',    
                            })}
                        </Text>
                    </View>
                    {
                        isMenuNeed ? (
                            <View>
                                <Menu
                                    key={isMenuVisible ? 'open' : 'closed'}
                                    visible={isMenuVisible}
                                    onDismiss={closeMenu}
                                    onRequestClose={closeMenu}
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
                <View>
                    {
                        !isMenuNeed ? (
                            <>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 22 }}>
                                    <AppMediumText>Progress</AppMediumText>
                                    <AppMediumText>{Math.floor(progress)}%</AppMediumText>
                                </View>
                                <View style={styles.progressBarBackground}>
                                    <View style={[styles.progressBarFill, { width: Math.floor(progress)+"%" }]} />
                                </View>
                            </>
                        ) : null
                    }
                    <View style={styles.infoBar} >
                        {
                            isMenuNeed ? (
                                <>
                                    <View style={{ backgroundColor: Colors.lightBadge, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 16 }}>
                                        <AppMediumText style={{ color: Colors.primaryColor }} >Trainees : {totalStudents}</AppMediumText>
                                    </View>
                                    <View style={{ backgroundColor: Colors.lightBadge, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 16 }}>
                                        <AppMediumText style={{ color: '#009B4D' }} >Active Tests : {totalTests}</AppMediumText>
                                    </View>
                                </>
                            ) : (
                                <>
                                    <View style={{ backgroundColor: Colors.lightBadge, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 16 }}>
                                        <AppMediumText style={{ color: Colors.primaryColor }} >New Tests : {newTests}</AppMediumText>
                                    </View>
                                </>
                            )
                        }
                        <Pressable
                            onPress={() => setClassroomID(id)}
                            onHoverIn={() => setEnterHovered(true)}
                            onHoverOut={() => setEnterHovered(false)}
                            style={[styles.enter, enterHovered && styles.enterHovered]}
                        >
                            <FontAwesome5 name="arrow-right" color={'white'} size={16} />
                        </Pressable>
                    </View>

                </View>
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

            </TouchableOpacity>
        </>
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
        // alignSelf: 'center',
        // padding: 18,
        paddingBottom: 18,
        borderRadius: 12,
        // marginHorizontal:,
        marginVertical : 8,
        maxWidth: width > 400 ? 380 : 340,
        width: '100%',
        // boxShadow: Colors.blackBoxShadow,
        // flex: 1,
        boxShadow: Colors.blackBoxShadow,
        marginHorizontal: 10,
        elevation: 6,


    },
    classHeader: {
        height: 100,
        borderTopRightRadius: 12,
        borderTopLeftRadius: 12,
        backgroundColor: Colors.thirdColor,
        alignItems: 'center',
        justifyContent: 'center'
    },
    classContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 20,
        paddingVertical: 15,
    },

    className: {
        fontSize: 16,
        fontWeight: 300,
        marginTop: 6,
        fontFamily: fonts.semibold
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
        color: Colors.dimBg,
        marginTop: 5,
    },
    enterHovered: {
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    hoveredClass: {
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    infoBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    enter: {
        backgroundColor: Colors.primaryColor,
        height: 30,
        width: 30,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    progressBarBackground: {
        height: 8,
        backgroundColor: Colors.primaryColor + '20', 
        borderRadius: 10,
        overflow: 'hidden',
        marginHorizontal: 22,
        marginVertical : 10 
    },

    progressBarFill: {
        height: '100%',
        backgroundColor: Colors.primaryColor,
        borderRadius: 10,
    },
});



