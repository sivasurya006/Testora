import { View, Text, StyleSheet, Pressable, Platform, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Colors from '../../../styles/Colors';
import { AppMediumText } from '../../../styles/fonts';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Profile from '../Profile';

export default function SubmissionsHeader() {

    const [selected, setSelected] = useState('yetToGrade');

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>

            <View style={styles.menu}>
                <View style={{ justifyContent: 'center', marginRight: 10 }} >
                    <TouchableOpacity onPress={() => {
                        if (router.canGoBack()) {
                            router.back();
                        } else {
                            router.replace('/');
                        }
                    }}>
                        <Feather name='arrow-left' size={24} />
                    </TouchableOpacity>
                </View>
                <Pressable
                    style={[styles.menuItem, selected == 'yetToGrade' && styles.selectedItem]}
                    onPress={() => {
                        setSelected("yetToGrade");
                    }}
                >
                    <AppMediumText style={{ fontSize: 16 }}>To be grade</AppMediumText>
                </Pressable>
                <Pressable
                    style={[styles.menuItem, selected == 'completed' && styles.selectedItem]}
                    onPress={() => {
                        setSelected("completed");
                    }}
                >
                    <AppMediumText style={{ fontSize: 16 }}>Completed</AppMediumText>
                </Pressable>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                <Profile name={'Sivasurya'} />
                <TouchableOpacity style={styles.button}>
                    <MaterialIcons name='query-stats' size={16} color={'white'} />
                    <AppMediumText style={{ color: Colors.white }} >Performance</AppMediumText>
                </TouchableOpacity>
            </View>

        </View>
    )
}


const styles = StyleSheet.create({
    menu: {
        paddingTop: 20,
        flexDirection: "row",
        backgroundColor: Colors.bgColor,
        paddingBottom: 20,
        flexWrap: 'wrap',
        ...(Platform.OS == 'web' ? {
            paddingLeft: 10
        } : {})
    },
    active: {
        backgroundColor: Colors.primaryColor
    },
    menuItem: {
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    selectedItem: {
        borderBottomWidth: 2,
        borderBottomColor: Colors.primaryColor
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: Colors.primaryColor,
        marginHorizontal: 4,
        gap: 10
    }

})