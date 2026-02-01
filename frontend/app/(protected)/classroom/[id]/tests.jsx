import { StyleSheet, Text, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

export default function tests() {
 
 const { id } = useLocalSearchParams();    
     
 return (
    <View>
      <Text>{ id }</Text>
    </View>
  )
}

const styles = StyleSheet.create({


})

