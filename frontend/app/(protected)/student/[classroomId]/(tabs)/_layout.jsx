import { Tabs } from 'expo-router'
import { useContext } from 'react'
import { ActivityIndicator, Platform, View, useWindowDimensions } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import Colors from '../../../../../styles/Colors'
import Header from '../../../../../src/components/Header'
import { AuthContext } from '../../../../../util/AuthContext'

export default function StudentLayout() {
    const { width } = useWindowDimensions()
    const isLargeScreen = width > 812


   

    return (
        <SafeAreaView style={{ flex: 1 }}>
          
            <Tabs
                screenOptions={{
                    tabBarPosition: isLargeScreen ? 'left' : 'bottom',
                    headerShown: false,
                    tabBarStyle: Platform.select({
                        web: {
                            minWidth: 70,
                            backgroundColor: Colors.secondaryColor,
                        },
                        android: {
                            height: 60,
                            backgroundColor: Colors.secondaryColor,
                        },
                        ios: {
                            height: 60,
                            backgroundColor: Colors.secondaryColor,
                        },
                    }),
                    tabBarShowLabel: false,
                    tabBarActiveTintColor: Colors.primaryColor,
                    tabBarInactiveTintColor: Colors.white,
                    tabBarItemStyle: { paddingTop: 5 },
                    tabBarActiveBackgroundColor: isLargeScreen ? '#ffffff20' : 'transparent',
                }}
            >

                <Tabs.Screen
                    name="dashboard"
                    options={{
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons name="view-dashboard" size={28} color={color} />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="tests"
                    options={{
                        tabBarIcon: ({ color }) => (
                            <MaterialIcons name="assignment" size={28} color={color} />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="settings"
                    options={{
                        tabBarIcon: ({ color }) => (
                            <MaterialIcons name="settings" size={28} color={color} />
                        ),
                    }}
                />

            </Tabs>

        </SafeAreaView>
    )
}