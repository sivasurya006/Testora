import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function Classroom({ id, name, createdAt, createdBy, onPress }) {
    return (
        <Pressable onPress={() => onPress(id)} style={{borderWidth : 2}}>
            <Text>{id}</Text>
            <Text>{name}</Text>
            <Text>{createdAt}</Text>
            <Text>{createdBy}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {

    }
})