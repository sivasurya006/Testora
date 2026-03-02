import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import { Stack } from 'expo-router'
import AuthContextProvider, { AuthContext } from '../../util/AuthContext'
import { ActivityIndicator } from 'react-native-paper';

export default function Protected() {
    const authContext = useContext(AuthContext);

    if (authContext.isLoading) {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <ActivityIndicator size={'large'} />
            </View>
        )
    }
    return (
        <Stack screenOptions={{ headerShown: false }} />
    )
}