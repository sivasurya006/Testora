import { View, Text, StyleSheet, Pressable, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import Colors from '../../../styles/Colors'
import { fonts } from '../../../styles/fonts'
import ConfirmModal from '../modals/ConfirmModal'
import { useGlobalSearchParams } from 'expo-router'

export default function TestHeader({ data, onExit, onSubmit, onTimeEnd }) {
  const [timeLeft, setTimeLeft] = useState(data.duration * 60);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const { classroomId } = useGlobalSearchParams();

  useEffect(() => {
    if (!data.duration) return;
    setTimeLeft(data.duration * 60);
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [data.duration]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  function handleCloseTest() {
    setConfirmModalVisible(true);
  }

  const isWeb = Platform.OS === 'web';

  return (
    <View style={[styles.container, isWeb ? styles.webContainer : styles.mobileContainer]}>
      {isWeb ? (
        <>
          <Pressable style={{zIndex:10}} onPress={handleCloseTest}>
            <AntDesign name="close" size={24} color="black" />
          </Pressable>
          <View style={styles.webTitleContainer}>
            <Text style={styles.testTitle}>{data.title}</Text>
          </View>
          <View style={styles.rightSection}>
            {data.duration && (
              <View style={styles.timerContainer}>
                <Ionicons name='timer-outline' size={30} />
                <Text style={[styles.timer, timeLeft <= 60 && { color: 'red' }]}>{formatTime(timeLeft)}</Text>
              </View>
            )}
            <Pressable style={styles.primaryButton} onPress={onSubmit}>
              <Text style={styles.primaryButtonText}>Submit</Text>
            </Pressable>
          </View>
        </>
      ) : (
        <>
          <View style={styles.mobileTitleContainer}>
            <Text style={styles.testTitle}>{data.title}</Text>
          </View>
          <View style={styles.mobileRow}>
            <Pressable onPress={handleCloseTest}>
              <AntDesign name="close" size={24} color="black" />
            </Pressable>
            {data.duration && (
              <View style={styles.timerContainer}>
                <Ionicons name='timer-outline' size={30} />
                <Text style={[styles.timer, timeLeft <= 60 && { color: 'red' }]}>{formatTime(timeLeft)}</Text>
              </View>
            )}
            <Pressable style={styles.primaryButton} onPress={onSubmit}>
              <Text style={styles.primaryButtonText}>Submit</Text>
            </Pressable>
          </View>
        </>
      )}

      <ConfirmModal
        onConfirm={onExit}
        onCancel={() => setConfirmModalVisible(false)}
        visible={confirmModalVisible}
        message={"Exit test?\nIf you leave now, your current progress will not be saved."}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomColor: '#ccc',
  },
  webContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    justifyContent: 'space-between',
  },
  mobileContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    borderBottomWidth: 0,
  },
  webTitleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  mobileTitleContainer: {
    marginBottom: 12,
  },
  mobileRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 10,
  },
  testTitle: {
    fontFamily: fonts.bold,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginLeft: 'auto',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timer: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: Colors.black,
  },
  primaryButton: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: 18,
    paddingHorizontal: 35,
    borderRadius: 25,
    marginLeft: 10, 
  },
  primaryButtonText: {
    color: Colors.white,
    fontFamily: fonts.regular,
  },
});
