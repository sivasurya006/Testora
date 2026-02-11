import { View, Text, StyleSheet, Pressable, Image } from 'react-native'
import Colors from '../../styles/Colors'
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { fonts } from '../../styles/fonts';

export default function Header() {
    return (
        <React.Fragment>
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} >
                    <Image source={require('../../assets/logo/logo.png')} style={styles.appLogo} />
                    <Text style={styles.appName}>Test Creator</Text>
                </View>
                <View style={{ marginRight: 10 }}>
                    <Pressable>
                        <MaterialIcons name='account-circle' size={30} color={Colors.white} />
                    </Pressable>
                </View>
            </View>
        </React.Fragment>
    )
}


const styles = StyleSheet.create({
    container: {
        height: 60,
        flexDirection: 'row',
        backgroundColor: Colors.secondaryColor,
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.charcoal,
        justifyContent: 'space-between'
    },
    appLogo: {
        marginTop: 20,
        width: 50,
        height: 110,
        marginRight: 10
    },
    appName: {
        fontSize: 20,
        color: Colors.white,
        fontFamily : fonts.medium
    }
});