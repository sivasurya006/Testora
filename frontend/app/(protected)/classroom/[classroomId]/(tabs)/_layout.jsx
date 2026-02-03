import { View, Text, useWindowDimensions } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"

export default function _layout() {


    const {width} = useWindowDimensions();
    const isLargeScreen =  width > 821;

    return (
        <Tabs
            screenOptions={{
                tabBarPosition: isLargeScreen ? 'left' : 'bottom',
                tabBarStyle: {
                    minWidth: 60
                },
                // tabBarShowLabel: false,
                headerShown: false
            }}
        >
            <Tabs.Screen name='dashboard' options={{
                title: 'Dashboard' ,
                tabBarIcon : () => (
                    <MaterialCommunityIcons name="view-dashboard" size={24} color="black" />
                )
            }} />
            <Tabs.Screen name='test' options={{
                title: 'Tests' ,
                tabBarIcon : () => (
                    <FontAwesome name="book" size={24} color="black" />
                )
            }} />
            <Tabs.Screen name='students' options={{
                title: 'Students',
                tabBarIcon : () => (
                    <MaterialIcons name="groups" size={24} color="black" />
                )
            }} />
            <Tabs.Screen name='settings' options={{
                title: 'Settings' ,
                tabBarIcon : () => (
                    <Ionicons name="settings-sharp" size={24} color="black" />
                )
            }} />
        </Tabs>
    )
}