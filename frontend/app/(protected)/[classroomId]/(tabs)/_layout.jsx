import { View, Text, useWindowDimensions, Platform } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"
import Colors from '../../../../styles/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ClassroomLayout() {
    
    const {width} = useWindowDimensions();
    const isLargeScreen =  width > 821;

    return (
        <SafeAreaView style={{flex:1}}>
        <Tabs
            screenOptions={{
                tabBarPosition: isLargeScreen ? 'left' : 'bottom',
                tabBarStyle: Platform.select({
                    web: {
                        minWidth: 230,
                        backgroundColor: Colors.secondaryColor,
                    },
                    android: {
                        height: 60,
                        backgroundColor: Colors.secondaryColor
                    },
                    ios: {
                        height: 60,
                        backgroundColor: Colors.secondaryColor
                    }
                }),
                headerShown: false,
                tabBarShowLabel : isLargeScreen,
                tabBarActiveTintColor: Colors.primaryColor,
                tabBarInactiveTintColor: Colors.white,
                tabBarItemStyle: {
                    paddingTop: 7
                },
                tabBarActiveBackgroundColor: isLargeScreen ? '#ffffff20' : 'transparent'
            }}
        >
            <Tabs.Screen name='dashboard' options={{
                title: 'Dashboard' ,
                tabBarIcon : ({color}) => (
                    <MaterialCommunityIcons name="view-dashboard" size={24} color= {color} />
                )
            }} />
            <Tabs.Screen name='test' options={{
                title: 'Tests' ,
                tabBarIcon : ({color}) => (
                    <FontAwesome name="book" size={24} color={color}/>
                )
            }} />
            <Tabs.Screen name='students' options={{
                title: 'Students',
                tabBarIcon : ({color}) => (
                    <MaterialIcons name="groups" size={24} color={color} />
                )
            }} />
            <Tabs.Screen name='settings' options={{
                title: 'Settings' ,
                tabBarIcon : ({color}) => (
                    <Ionicons name="settings-sharp" size={24} color={color} />
                )
            }} />
        </Tabs>
        </SafeAreaView>
    )
}