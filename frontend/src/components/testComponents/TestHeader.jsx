import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import Colors from '../../../styles/Colors'
import { fonts } from '../../../styles/fonts'
import ConfirmModal from '../modals/ConfirmModal'

export default function TestHeader({
  data,
  onExit,
  onSubmit,
  onTimeEnd,
  forceSubmit,
  questionAreaLeftInset = 0,
  questionAreaRightInset = 0
}) {
  const [timeLeft, setTimeLeft] = useState(data.duration * 60);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

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

  const { width } = useWindowDimensions();
  const isWide = width >= 760;

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, isWide ? styles.row : styles.column]}>
        <View style={styles.leftSection}>
          <Pressable onPress={handleCloseTest} style={styles.closeBtn}>
            <AntDesign name="close" size={20} color={Colors.secondaryColor} />
          </Pressable>
          <Text numberOfLines={1} style={[styles.testTitle, !isWide && { fontSize: 18 }]}>
            {data.title}
          </Text>
        </View>

        {isWide ? (
          <View style={styles.submitSection}>
            <Pressable style={styles.primaryButton} onPress={() => {
              setConfirmModalVisible(false);
              onSubmit()
            }}>
              <Text style={styles.primaryButtonText}>Submit</Text>
            </Pressable>
          </View>
        ) : (
          <View style={[styles.rightSection, styles.narrowRight]}>
            {data.duration && (
              <View style={styles.timerContainer}>
                <Ionicons name='timer-outline' size={24} color={Colors.secondaryColor} />
                <Text style={[styles.timer, timeLeft <= 60 && { color: '#DC2626' }]}>{formatTime(timeLeft)}</Text>
              </View>
            )}
            <Pressable style={styles.primaryButton} onPress={() => {
              setConfirmModalVisible(false);
              onSubmit()
            }}>
              <Text style={styles.primaryButtonText}>Submit</Text>
            </Pressable>
          </View>
        )}

        {isWide && data.duration && (
          <View
            pointerEvents="none"
            style={[
              styles.timerOverlay,
              {
                left: questionAreaLeftInset,
                right: questionAreaRightInset,
              }
            ]}
          >
            <View style={styles.timerContainer}>
              <Ionicons name='timer-outline' size={24} color={Colors.secondaryColor} />
              <Text style={[styles.timer, timeLeft <= 60 && { color: '#DC2626' }]}>{formatTime(timeLeft)}</Text>
            </View>
          </View>
        )}
      </View>

      <ConfirmModal
        onConfirm={ async () => {
           setConfirmModalVisible(false);
          await forceSubmit();
          onExit();
        }}
        onCancel={() => setConfirmModalVisible(false)}
        visible={confirmModalVisible}
        message={"Exit test?\nIf you leave now, your current progress will not be saved."}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  column: {
    gap: 12,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minWidth: 0,
    flex: 1,
  },
  submitSection: {
    marginLeft: 'auto',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  timerOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bgColor,
  },
  testTitle: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: Colors.secondaryColor,
    flexShrink: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  narrowRight: {
    justifyContent: 'space-between',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: Colors.bgColor,
  },
  timer: {
    fontSize: 19,
    fontFamily: fonts.bold,
    color: Colors.secondaryColor,
  },
  primaryButton: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 28,
  },
  primaryButtonText: {
    color: Colors.white,
    fontFamily: fonts.medium,
    fontSize: 18,
  },
});
