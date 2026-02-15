import { View, Text, StyleSheet, Pressable, Image } from 'react-native'
import Colors from '../../styles/Colors'
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { fonts } from '../../styles/fonts';

export default function Header() {
    return (
        <View style={styles.container}>

            {/* Left Side (Logo + Name) */}
            <View style={styles.leftSection}>
                <Image
                    source={require('../../assets/logo/logo.png')}
                    style={styles.appLogo}
                    resizeMode="contain"
                />
                <Text style={styles.appName}>Testora</Text>
            </View>

            {/* Right Side (Profile Icon) */}
            <Pressable>
                <MaterialIcons
                    name='account-circle'
                    size={30}
                    color={Colors.white}
                />
            </Pressable>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 60,
        flexDirection: 'row',
        backgroundColor: Colors.secondaryColor,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.charcoal,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    appLogo: {
        width: 40,
        height: 40,
        marginRight: 10
    },
    appName: {
        fontSize: 20,
        color: Colors.white,
        fontFamily: fonts.medium
    }
});
