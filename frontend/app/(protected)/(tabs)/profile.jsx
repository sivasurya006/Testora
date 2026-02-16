import { View, Text, StyleSheet, Pressable, Platform } from 'react-native'
import React, { use, useContext } from 'react'
import { AppBoldText } from '../../../styles/fonts'
import Colors from '../../../styles/Colors'
import { AuthContext } from '../../../util/AuthContext'

export default function profile() {

  const { signOut } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      {
        Platform.OS != 'web' ? (
          <Pressable
            style={{ backgroundColor: Colors.dimBg , padding : 10 , borderRadius : 8}}
            onPress={signOut}
          >
            <AppBoldText style={{color : Colors.white}}>Logout</AppBoldText>
          </Pressable>
        ) : (
          <View style={styles.container}>
            <AppBoldText>Profile</AppBoldText>
          </View>
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})