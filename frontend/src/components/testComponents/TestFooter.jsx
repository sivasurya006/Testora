import { View, Text, StyleSheet, Pressable, Platform } from 'react-native'
import React from 'react'
import Colors from '../../../styles/Colors'
import { fonts } from '../../../styles/fonts'

export default function TestFooter({ havePrevious, haveNext, onNext, onPrevious }) {
  const isWeb = Platform.OS === 'web';

  return (
    <View style={[
      styles.container,
      isWeb ? styles.webContainer : styles.mobileContainer
    ]}>
      <Pressable
        disabled={!havePrevious}
        onPress={onPrevious}
        style={[
          styles.btn,
          styles.previousBtn,
          !havePrevious && styles.disabledBtn,
          isWeb && styles.webBtn
        ]}
      >
        <Text style={[styles.buttonText, styles.previousBtnText]}>
          Previous
        </Text>
      </Pressable>

      <Pressable
        disabled={!haveNext}
        onPress={onNext}
        style={[
          styles.btn,
          styles.nextBtn,
          !haveNext && styles.disabledBtn,
          isWeb && styles.webBtn
        ]}
      >
        <Text style={[styles.buttonText, styles.nextBtnText]}>
          Next
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },

  mobileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    width: '100%',
  },

  webContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },

  btn: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  webBtn: {
    minWidth: 240,
    marginBottom : 150,
  },

  previousBtn: {
    backgroundColor: '#ddd',
    ...(Platform.OS !== 'web' && { flex: 1, marginHorizontal: 5 }),
  },

  nextBtn: {
    backgroundColor: Colors.primaryColor,
    ...(Platform.OS !== 'web' && { flex: 1, marginHorizontal: 5 }),
  },

  disabledBtn: {
    opacity: 0.5,
  },

  buttonText: {
    textAlign: 'center',
    fontFamily: fonts.regular,
    fontSize: 16,
  },

  previousBtnText: {
    color: '#000',
  },

  nextBtnText: {
    color: Colors.white,
  },
})
