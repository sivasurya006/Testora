import { View, Text, StyleSheet, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import Colors from '../../../styles/Colors'
import { fonts } from '../../../styles/fonts'

export default function TestHeader({ data }) {

    console.log(data)

    const [timeLeft, setTimeLeft] = useState(data.duration * 60)

    useEffect(() => {
        if (timeLeft <= 0) return
        const timer = setInterval(() => {
            setTimeLeft(timeLeft - 1)
        }, 1000)
        return () => clearInterval(timer)
    }, [timeLeft])

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`
    }

    return (
        <View style={styles.container} >

            {/* exit test */}
            <Pressable
                style={{ zIndex: 10 }}
                onPress={() => console.log("clicked")}
            >
                <AntDesign name="close" size={24} color="black" />
            </Pressable>

            {/* Test Title */}
            <View style={{ position: 'absolute', left: 0, right: 0, alignItems: 'center' }}>
                <Text style={styles.testTitle}>{data.title}</Text>
            </View>

            {/* Timer  */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15, width: '30%', justifyContent: 'space-around' }}>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 15}}>
                    <Ionicons name='timer-outline' size={30} />
                    <Text style={[
                        styles.timer,
                        timeLeft <= 60 && { color: 'red' }
                    ]}>
                        {formatTime(timeLeft)}
                    </Text>
                </View>
                <Pressable style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>Submit</Text>
                </Pressable>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 35,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        position: 'relative'
    },
    primaryButton: {
        backgroundColor: Colors.primaryColor,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 30
    },
    primaryButtonText: {
        color: Colors.white,
        fontFamily: fonts.regular
    },
    testTitle: {
        fontFamily: fonts.bold,
        fontSize: 26,
        fontWeight: 600,
    },
    timer: {
        fontSize: 20,
        fontFamily: fonts.bold,
        color: Colors.black,
    }
})
