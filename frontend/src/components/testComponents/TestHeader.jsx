import { View, Text, StyleSheet, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import Colors from '../../../styles/Colors'
import { fonts } from '../../../styles/fonts'
import ConfirmModal from '../modals/ConfirmModal'
import { router, useGlobalSearchParams } from 'expo-router'

export default function TestHeader({ data , onExit , onSubmit,onTimeEnd}) {

    const [timeLeft, setTimeLeft] = useState(data.duration * 60);
    const [confirmModalVisible,setConfirmModalVisible] = useState(false);
    const { classroomId } = useGlobalSearchParams();

    // useEffect(() => {

    //     setTimeLeft(data.duration * 60);

    //     const timer = setInterval(() => {
    //         setTimeLeft(prev => {
    //             if (prev <= 1) {
    //                 clearInterval(timer);
    //                 return 0;
    //             }
    //             return prev - 1;
    //         });
    //     }, 1000);

    //     return () => clearInterval(timer);
    // }, [data]);

    function handleCloseTest(){
        setConfirmModalVisible(true);
    }

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
                onPress={handleCloseTest}
            >
                <AntDesign name="close" size={24} color="black" />
            </Pressable>

            {/* Test Title */}
            <View style={{ position: 'absolute', left: 0, right: 0, alignItems: 'center' }}>
                <Text style={styles.testTitle}>{data.title}</Text>
            </View>

            {/* Timer  */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15, width: '30%', justifyContent: 'space-around' }}>
                {
                    data.duration ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                            <Ionicons name='timer-outline' size={30} />
                            <Text style={[
                                styles.timer,
                                timeLeft <= 60 && { color: 'red' }
                            ]}>
                                {formatTime(timeLeft)}
                            </Text>
                        </View>
                    ) : null
                }
                <Pressable style={styles.primaryButton} onPress={onSubmit}>
                    <Text style={styles.primaryButtonText}>Submit</Text>
                </Pressable>
            </View>
            <ConfirmModal onConfirm={onExit} onCancel={() => setConfirmModalVisible(false)} visible={confirmModalVisible} message={"Exit test?\nIf you leave now, your current progress will not be saved."} />
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
