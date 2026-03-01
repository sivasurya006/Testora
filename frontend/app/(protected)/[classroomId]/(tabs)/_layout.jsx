import { View, Text, useWindowDimensions, Platform, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Tabs } from 'expo-router'
import { Feather, FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons, SimpleLineIcons } from "@expo/vector-icons"
import Colors from '../../../../styles/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ClassroomTabBar } from '../../../../src/components/ClassroomTobBar';
import { fonts } from '../../../../styles/fonts';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
export default function ClassroomLayout() {

    const { width } = useWindowDimensions();
    const isLargeScreen = width > 821;
    const isSmallScreen = !isLargeScreen;
    const [isTabBarVisible, setIsTabBarVisible] = useState(true);

    return (
        // <SafeAreaView style={{ flex: 1 }}>
            <Tabs
                tabBar={isLargeScreen ? (props) => isTabBarVisible ? <ClassroomTabBar {...props} /> : null : undefined}
                screenOptions={{
                    tabBarPosition: isLargeScreen ? 'left' : 'bottom',
                    tabBarStyle: Platform.select({
                        web: {
                            minWidth: 300,
                            backgroundColor: Colors.secondaryColor
                        },
                        android: {
                            height: 95,
                            backgroundColor: Colors.secondaryColor
                        },
                        ios: {
                            height: 85,
                            backgroundColor: Colors.secondaryColor
                        }
                    }),
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: Colors.secondaryColor,
                    },
                    headerTintColor: Colors.white,
                    // headerLeft: isLargeScreen ? () => (
                    //     <TouchableOpacity onPress={() => setIsTabBarVisible(!isTabBarVisible)} style={{ marginHorizontal: 15 }}>
                    //         {
                    //             isTabBarVisible ? (
                    //                  <SimpleLineIcons name="arrow-left" size={20} color="white"/> 
                    //             ) : (
                    //                  <Feather name="menu" size={24} color="white" /> 
                    //             )
                    //         }
                    //     </TouchableOpacity>
                    // ) : undefined,
                    // tabBarShowLabel: true,
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
                <Tabs.Screen
                    name='test'
                    options={({ route }) => {
                        const focusedRouteName = getFocusedRouteNameFromRoute(route) ?? '';
                        const isInsideTestDetails = focusedRouteName.includes('[testId]');

                        return {
                            title: 'Tests',
                            headerShown: !(isSmallScreen && isInsideTestDetails),
                            tabBarIcon: ({ color }) => (
                                <FontAwesome name="book" size={22} color={color} />
                            )
                        };
                    }}
                />
                <Tabs.Screen name='students' options={{
                    title: 'Trainees',
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons name="groups" size={22} color={color} />
                    )
                }} />
                <Tabs.Screen name='settings' options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="settings-sharp" size={24} color={color} />
                    ),
                    href : null
                }} />
                 <Tabs.Screen name='tests/[testId]' options={{
                    title: 'Tests',
                    href : null,
                    // tabBarIcon: ({ color }) => (
                    //     <Ionicons name="settings-sharp" size={24} color={color} />
                    // )
                }} />
            </Tabs>
        // </SafeAreaView>
    )
}
