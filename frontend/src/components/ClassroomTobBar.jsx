import { View, Text, Pressable, Image } from 'react-native'
import { BottomTabBar } from '@react-navigation/bottom-tabs'
import Colors from '../../styles/Colors'
import { router } from 'expo-router'
import { FontAwesome6 } from '@expo/vector-icons'
import { fonts } from '../../styles/fonts'

export function ClassroomTabBar(props) {
    return (
        <View style={{ backgroundColor: Colors.secondaryColor }}>
            <View
                style={{
                    height: 64,
                    justifyContent: 'center',
                    paddingHorizontal: 20,
                    paddingTop: 20,
                    width: 250,
                    alignItems: 'center',
                    // flexDirection: 'row',
                    // gap: 12
                }}
            >
                {/* <FontAwesome6 name='school' size={22} color={Colors.white} style={{}} /> */}
                <Pressable style={{alignItems:'center' , justifyContent :'center' , flexDirection:'row'}} onPress={() => router.push('/')}>
                    <Image
                        source={require('../../assets/logo/logo.png')}
                        style={{
                            width: 40,
                            height: 40,
                            marginRight: 10
                        }}
                        resizeMode="contain"
                    />
                    <Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold', textAlign: 'center', fontStyle: fonts.bold }}>Testora</Text>
                </Pressable>
            </View>
            <BottomTabBar {...props} />
        </View>
    )
}
