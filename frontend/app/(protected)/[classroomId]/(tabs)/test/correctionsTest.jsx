import { View, Text } from 'react-native'
import React from 'react'
import { fonts } from '../../../../../styles/fonts'

export default function CorrectionsTest() {
  return (
    <View style={{flex:1,alignItems:'center',justifyContent:'center'}} >
      <Text style={{fontSize:16,fontFamily:fonts.semibold}}>No Tests submitted yet</Text>
    </View>
  )
}