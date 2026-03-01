import { Tabs } from 'expo-router'
import { useContext } from 'react'
import { ActivityIndicator, Platform, View, useWindowDimensions } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import Colors from '../../../../../styles/Colors'
import Header from '../../../../../src/components/Header'
import { AuthContext } from '../../../../../util/AuthContext'
import { fonts } from '../../../../../styles/fonts'
import { ClassroomTabBar } from '../../../../../src/components/ClassroomTobBar'

export default function StudentLayout() {
    const { width } = useWindowDimensions()
    const isLargeScreen = width > 812




    return (
        // <SafeAreaView style={{ flex: 1 }}>

        <Tabs
            initialRouteName='tests'
            tabBar={isLargeScreen ? (props) => <ClassroomTabBar {...props} /> : undefined}
            screenOptions={{

                tabBarPosition: isLargeScreen ? 'left' : 'bottom',
                headerShown: false,
                tabBarStyle: Platform.select({
                    web: {
                        minWidth: 300,
                        backgroundColor: Colors.secondaryColor,
                    },
                    android: {
                        // height: 60,
                        backgroundColor: Colors.secondaryColor,
                    },
                    ios: {
                        // height: 60,
                        backgroundColor: Colors.secondaryColor,
                    },
                }),
                tabBarShowLabel: true
                , tabBarLabelStyle: {
                    fontSize: isLargeScreen ? 16 : 12,
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

            {/* <Tabs.Screen
                    name="dashboard"
                    
                    options={{
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons name="view-dashboard" size={28} color={color} />
                        ),
                        title : 'Dashboard'
                    }}
                /> */}

            <Tabs.Screen
                name="tests"
                options={{
                    title: 'Tests',
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons name="assignment" size={24} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="studentTestSubmissions"
                options={{
                    title: 'Submissions',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name="file-document-check-outline"
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />

      

        </Tabs>



        // </SafeAreaView>
    )
}