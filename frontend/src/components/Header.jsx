import { View, Text, StyleSheet} from 'react-native'
import Colors from '../../styles/Colors'
import {FontAwesome6} from '@expo/vector-icons';
import React from 'react';

export default function Header() {
    return (
        <React.Fragment>
            <View style={styles.container}>
                <FontAwesome6 name='school' size={20} color={Colors.white} style={styles.appLogo} />
                <Text style={styles.appName}>Test Creator</Text>
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
        borderBottomColor: Colors.charcoal
    },
    appLogo: {
        marginRight: 10
    },
    appName: {
        fontSize: 22,
        color: Colors.white,
    }
});