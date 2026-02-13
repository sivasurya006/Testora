import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons'
import Colors from '../../../styles/Colors'
import { fonts } from '../../../styles/fonts'

export default function TestFooter({ havePrevious, haveNext, onNext, onPrevious }) {
    return (
        <View style={styles.container} >
            {/* Previous Question Button */}
            <Pressable
                disabled={!havePrevious}
                onPress={onPrevious}
                style={[styles.btn, styles.previousBtn]}
            >
                <Text style={[styles.buttonText, styles.previousBtnText]}>Previous</Text>
            </Pressable>

            {/* Next Question Button */}
            <Pressable
                disabled={!haveNext}
                onPress={onNext}
                style={[styles.btn, styles.nextBtn]}
            >
                <Text style={[styles.buttonText, styles.nextBtnText]}>Next</Text>
            </Pressable>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 150,
        width: '100%',
        justifyContent: 'center',
        gap: 100,
        paddingHorizontal: 20
    },
    btn: {
        color: 'black',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 40,
        maxWidth: 200,
        flex: 1
    },
    previousBtn: {
        backgroundColor: '#ddd',
    },
    nextBtn: {
        backgroundColor: Colors.primaryColor
    },
    previousBtnText: {

    },
    nextBtnText: {
        color: Colors.white
    },
    buttonText: {
        textAlign: 'center',
        fontFamily: fonts.regular,
        fontSize: 18
    },

})