import { View, Text, useWindowDimensions } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

export default function _layout() {


    const {width} = useWindowDimensions();
    const isLargeScreen =  width > 768;

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
                title: 'Dashboard'
            }} />
            <Tabs.Screen name='test' options={{
                title: 'Tests'
            }} />
            <Tabs.Screen name='students' options={{
                title: 'Students'
            }} />
            <Tabs.Screen name='settings' options={{
                title: 'Settings'
            }} />
        </Tabs>
    )
}