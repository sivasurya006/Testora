import { View, Text } from 'react-native'
import React from 'react'
import { Slot, Stack } from 'expo-router'
import TestHeader from '../../../../../../src/components/testComponents/TestHeader'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function TestLayout() {
  return (
    <SafeAreaView style={{flex:1}}>
      <Slot />
    </SafeAreaView>
  )
}