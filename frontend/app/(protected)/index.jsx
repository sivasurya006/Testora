import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function Index() {
  return (
    <View style={styles.container}>
      <Text>No classrooms available</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        alignItems : 'center',
        justifyContent : 'center'
    }
})



