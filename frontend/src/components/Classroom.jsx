import { Button, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import api from '../../util/api'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../../styles/Colors';

export default function Classroom({ id, name, createdAt, createdBy, setClassroomID, setCreatedClassrooms, createdClassrooms }) {
    return (
        <Pressable onPress={() =>{ console.log('clicked');return setClassroomID(id)}} style={styles.container}>
            <MaterialCommunityIcons name="dots-vertical" size={24} color="black" style={{alignSelf:'flex-end'}} />
            {/* <Text>{id}</Text> */}
            {/* <Text style={styles.className}>{name}</Text> */}
            {/* <Text>{createdAt}</Text>
            <Text>{createdBy}</Text> */}
            <View style={styles.classContainer}>
                <MaterialCommunityIcons name="google-classroom" size={30} color="black" />
                <Text>{name}</Text>
            </View>
            <Button title='delete' onPress={() => deleteClassRoom(id, setCreatedClassrooms, createdClassrooms)} />
        </Pressable>
    )
}

async function deleteClassRoom(classroomId, setCreatedClassrooms, createdClassrooms) {
    try {
        const result = await api.delete("/api/delete-classroom", {
            headers: {
                "X-ClassroomId": classroomId
            }
        });

        if (result.data.success) {
            console.log('classroom deleted successfully');
            setCreatedClassrooms(createdClassrooms.filter(classroom => classroom.classroomId != classroomId));
        } else {
            console.log('classroom not deleted');
        }

    } catch (err) {
        console.log(err);
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        boxShadow : '0px 4px 12px rgba(0, 0, 0, 0.25)',
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
    classContainer : {
        alignItems: 'center',
        padding: 50,
        rowGap: 25,
        borderRadius: 8,
    }
})