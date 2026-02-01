import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

export default function _layout() {
  return (
    <Tabs >
        <Tabs.Screen name='dashboard' options={{
            title : 'Dashboard'
        }}/>
    </Tabs>
  )
}