import { Redirect, Tabs } from 'expo-router'
import { useContext } from 'react'
import { ActivityIndicator, Platform, StatusBar, View, useWindowDimensions } from 'react-native'
import { AuthContext } from '../../../util/AuthContext'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import Colors from '../../../styles/Colors'
import Header from '../../../src/components/Header'
import { fonts } from '../../../styles/fonts'
import { ClassroomTabBar } from '../../../src/components/ClassroomTobBar'

export default function ProtectedLayout() {

    const { width } = useWindowDimensions();
    const isLargeScreen = width > 821;
    const authContext = useContext(AuthContext);

    if (authContext.isLoading) {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <ActivityIndicator size={24} />
            </View>
        )
    }

    {/** For authentication check we don't need separate api. 
    Bcz we handle it on server (if any unauthorized request happens server respond with 401)
 check api.interceptors.response  */}

    // if (!authContext.isLoggedIn) {
    //     return <Redirect href='/signin' />
    // }


    // if (!authContext.isLoggedIn) {
    //     return <Redirect href='/signin' />
    // }

    return (

        // <SafeAreaView style={{ flex: 1 }}>
            <Tabs 
            tabBar={isLargeScreen ? (props) => <ClassroomTabBar {...props} /> : undefined}
            screenOptions={{
                tabBarPosition: isLargeScreen ? "left" : 'bottom',
                headerShown: false,
                tabBarStyle: Platform.select({
                    web: {
                        paddingTop : isLargeScreen ? 30 : 0,
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
                tabBarShowLabel: true,
                tabBarLabelStyle : {
                    fontSize: isLargeScreen ?  16 : 12,
                    fontFamily: fonts.semibold
                },
                tabBarActiveTintColor: Colors.white,
                tabBarInactiveTintColor: Colors.lightFont,
                tabBarItemStyle: {
                    paddingTop: isLargeScreen ? 5 : 0,
                },
                tabBarActiveBackgroundColor: isLargeScreen ? '#ffffff20' : 'transparent',
            }}>
                <Tabs.Screen name='index' options={{
                    title: isLargeScreen ? 'Created Classrooms' : 'Created',
                    tabBarIcon: ({ color }) => (
                        // <MaterialCommunityIcons
                        //     name="account-school"
                        //     size={30}
                        //     color={color}
                        // />
                        <MaterialIcons name="cast-for-education" size={24} color={color} />
                    ),
                }} />

                <Tabs.Screen name='enrolled' options={{
                    title: isLargeScreen ? 'Enrolled Classrooms' : 'Enrolled',
                    tabBarIcon: ({ color }) => (
                        // <MaterialIcons name="school" size={30} color={color} />
                        // <MaterialCommunityIcons name="bookshelf" size={24} color={color} />
                        <MaterialIcons name="menu-book" size={24} color={color} />
                    ),
                }} />

                <Tabs.Screen
                    name='profile' options={{
                        title: 'Profile',
                        tabBarIcon: ({ color }) => (
                            <MaterialIcons name='account-circle' size={30} color={color} />
                        ),
                        ...(isLargeScreen ? {href : null} : {})
                    }}
                />

            </Tabs>
        // </SafeAreaView>

    )
}





