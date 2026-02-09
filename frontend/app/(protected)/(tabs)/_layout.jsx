import { Redirect, Tabs } from 'expo-router'
import { useContext } from 'react'
import { ActivityIndicator, Platform, StatusBar, View, useWindowDimensions } from 'react-native'
import { AuthContext } from '../../../util/AuthContext'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import Colors from '../../../styles/Colors'
import Header from '../../../src/components/Header'

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

        <SafeAreaView style={{ flex: 1 }}>
            {isLargeScreen ? <Header /> : null}

            <Tabs screenOptions={{
                tabBarPosition: isLargeScreen ? "left" : 'bottom',
                headerShown: false,
                tabBarStyle: Platform.select({
                    web: {
                        minWidth: 60,
                        backgroundColor: Colors.secondaryColor
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
                tabBarShowLabel: false,
                tabBarActiveTintColor: Colors.primaryColor,
                tabBarInactiveTintColor: Colors.white,
                tabBarItemStyle: {
                    paddingTop: 5
                },
                tabBarActiveBackgroundColor: isLargeScreen ? '#ffffff20' : 'transparent'
            }}>
                <Tabs.Screen name='index' options={{
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name="account-school"
                            size={30}
                            color={color}
                        />
                    )
                }} />

                <Tabs.Screen name='joinedClassrooms' options={{
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons name="school" size={30} color={color} />
                    ),
                }} />

                <Tabs.Screen
                    name='profile' options={{
                        tabBarIcon: ({ color }) => (
                            <MaterialIcons name='account-circle' size={30} color={color} />
                        )
                    }}
                />

            </Tabs>
        </SafeAreaView>

    )
}





