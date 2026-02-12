import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import api from '../../../util/api';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import Colors from '../../../styles/Colors';
import { fonts } from '../../../styles/fonts';

export default function JoinClassroom() {
  const { code } = useGlobalSearchParams();
  const [classroomData, setClassroomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    joinRequestClassroom(code);
  }, [code]);

  async function joinRequestClassroom(code) {
    try {
      const result = await api.get('/join/classroom?code='+code);
      if (result?.status === 200 && result.data) {
        setClassroomData(result.data);
      } else {
        setError("Failed to join classroom");
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Classroom not found");
      }
      else if (err.response?.status === 400) {
        setError("Invalid classroom invite link");
      }
      else {
        setError("An error occurred while joining the classroom");
      }
      console.log("join classroom err", err);
    } finally {
      setLoading(false);
    }
  }

  async function joinClassroom() {
    try {
      const result = await api.post('/join/classroomConfirm', { code });
      if (result?.status === 200) {
        console.log('Classroom joined successfully');
        router.replace(`student/${result.data.classroomId}/test`);
      } else {
        setError("Failed to join classroom");
      }
    } catch (err) {
        setError("An error occurred while joining the classroom");
        console.log("join classroom err", err);
    }
  }

  function handleCancel() {
    router.replace('/');
  }

  function handleConfirm() {
    joinClassroom();
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primaryColor} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <View style={styles.classroomDetails}>
          <Text style={styles.classroomName}>{classroomData?.classroomName}</Text>
          <Text style={styles.creatorName}>Created by: {classroomData?.creatorName}</Text>

          <View style={{ flexDirection: 'row' }}>
            <Pressable style={[styles.btn, styles.cancelBtn]} onPress={handleCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable style={[styles.btn, styles.confirmBtn]} onPress={handleConfirm}>
              <Text style={styles.confirmText}>Join</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  classroomDetails: {
    backgroundColor: Colors.formBg,
    padding: 20,
    borderRadius: 10,
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
    boxShadow: Colors.blackBoxShadow,
    elevation: 5,
  },
  classroomName: {
    fontSize: 24,
    fontFamily: fonts.semibold,
    color: Colors.primaryColor,
    marginBottom: 10,
  },
  creatorName: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: Colors.charcoal,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: Colors.btnColor,
    marginBottom: 20,
  },

  btn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 10,
  },

  confirmBtn: {
    backgroundColor: Colors.primaryColor,
  },

  cancelBtn: {
    backgroundColor: '#ddd',
  },

  confirmText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '600',
  },

  cancelText: {
    color: Colors.charcoal,
    fontSize: 15,
    fontWeight: '500',
  },
});
