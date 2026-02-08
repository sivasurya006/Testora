import { View, Text, Pressable } from 'react-native'
import { BottomTabBar } from '@react-navigation/bottom-tabs'
import Colors from '../../styles/Colors'
import { router } from 'expo-router'
import { FontAwesome6 } from '@expo/vector-icons'

export function ClassroomTabBar(props) {
    return (
        <Pressable style={{ backgroundColor: Colors.secondaryColor }} onPress={() => router.push('/')}>
            <View
                style={{
                    height: 64,
                    justifyContent: 'center',
                    paddingHorizontal: 20,
                    width: 200,
                    alignItems: 'center',
                    flexDirection: 'row',
                    gap: 12
                }}
            >
                {/* <FontAwesome6 name='school' size={22} color={Colors.white} style={{}} /> */}
                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
                    Test Creator
                </Text>
            </View>
            <BottomTabBar {...props} />
        </Pressable>
    )
}
