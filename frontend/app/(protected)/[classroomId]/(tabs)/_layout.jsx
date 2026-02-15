import { View, Text, useWindowDimensions, Platform } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"
import Colors from '../../../../styles/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ClassroomTabBar } from '../../../../src/components/ClassroomTobBar';
import { fonts } from '../../../../styles/fonts';
export default function ClassroomLayout() {

    const { width } = useWindowDimensions();
    const isLargeScreen = width > 821;

    return (
        // <SafeAreaView style={{ flex: 1 }}>
            <Tabs
                tabBar={isLargeScreen ? (props) => <ClassroomTabBar {...props} /> : undefined}
                screenOptions={{
                    tabBarPosition: isLargeScreen ? 'left' : 'bottom',
                    tabBarStyle: Platform.select({
                        web: {
                            minWidth: 300,
                            backgroundColor: Colors.secondaryColor,
                        },
                        android: {
                            // height: 60,
                            backgroundColor: Colors.secondaryColor
                        },
                        ios: {
                            // height: 60,
                            backgroundColor: Colors.secondaryColor
                        }
                    }),
                    headerShown: false,
                    tabBarShowLabel: true,
                    tabBarLabelStyle: {
                        fontSize: isLargeScreen ?  16 : 12,
                        fontFamily: fonts.semibold
                    },
                    tabBarActiveTintColor: Colors.white,
                    tabBarInactiveTintColor: Colors.lightFont,
                    tabBarItemStyle: {
                        paddingTop: 7
                    },
                    tabBarActiveBackgroundColor: isLargeScreen ? '#ffffff20' : 'transparent',
                }}
            >
                <Tabs.Screen name='dashboard' options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="view-dashboard" size={22} color={color} />
                    )
                }} />
                <Tabs.Screen name='test' options={{
                    title: 'Tests',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome name="book" size={22} color={color} />
                    )
                }} />
                <Tabs.Screen name='students' options={{
                    title: 'Students',
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons name="groups" size={22} color={color} />
                    )
                }} />
                <Tabs.Screen name='settings' options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="settings-sharp" size={24} color={color} />
                    )
                }} />
                 <Tabs.Screen name='tests' options={{
                    title: 'Settings',
                    href : null,
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="settings-sharp" size={24} color={color} />
                    )
                }} />
            </Tabs>
        // </SafeAreaView>
    )
}
