import { View, Text } from 'react-native'
import React from 'react'
import StudentSubmissionScreen from '../../../../../../src/screens/Submissions'
import { useGlobalSearchParams } from 'expo-router'

export default function submission() {
  return (
    <StudentSubmissionScreen mode='testSubmissions' />
  )
}