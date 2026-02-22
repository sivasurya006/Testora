import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Colors from '../../../../../../styles/Colors'
import SubmissionsHeader from '../../../../../../src/components/submissions/SubmissionsHeader'

export default function StudentSubmissions() {
  return (
    <View style={styles.container}>
      <SubmissionsHeader />
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgColor
  }
})