import { View, Text, StyleSheet, Pressable } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { AppBoldText, AppSemiBoldText } from '../../../styles/fonts'
import Colors from '../../../styles/Colors'
import { AuthContext } from '../../../util/AuthContext'
import { ActivityIndicator } from 'react-native-paper'
import api from '../../../util/api'

export default function profile() {
  const { signOut, user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const result = await api.get('/api/profile');
        if (result?.status === 200 && result?.data) {
          setProfile(result.data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const email = profile?.email || user?.email || '';
  const name = profile?.name || user?.name || '';
  const registeredAt = profile?.registeredAt
    ? new Date(profile.registeredAt * 1000).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
    : '-';

  return (
    <View style={styles.container}>
      <View style={styles.profileBox}>
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.primaryColor} />
        ) : (
          <>
            <AppBoldText style={styles.nameText}>{name || '-'}</AppBoldText>
            <Text style={styles.emailText}>{email || '-'}</Text>
            <View style={styles.metaBlock}>
              <View style={styles.metaRow}>
                <AppSemiBoldText style={styles.metaKey}>Registered</AppSemiBoldText>
                <Text style={styles.metaValue}>{registeredAt}</Text>
              </View>
            </View>
          </>
        )}
      </View>

      <Pressable
        style={styles.logoutButton}
        onPress={signOut}
      >
        <AppBoldText style={styles.logoutText}>Sign out</AppBoldText>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  profileBox: {
    alignItems: 'stretch',
    marginBottom: 40,
    width: '100%',
    maxWidth: 360,
    paddingHorizontal: 16,
  },
  nameText: {
    marginTop: 2,
    fontSize: 20,
    color: Colors.secondaryColor,
    textAlign: 'left',
  },
  emailText: {
    marginTop: 8,
    fontSize: 16,
    color: Colors.darkFont,
    textAlign: 'left',
  },
  metaBlock: {
    width: '100%',
    marginTop: 18,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: Colors.white,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  metaKey: {
    color: Colors.lightFont,
    fontSize: 14,
  },
  metaValue: {
    color: Colors.secondaryColor,
    fontSize: 14,
  },
  logoutButton: {
    backgroundColor: Colors.dimBg,
    padding: 12,
    borderRadius: 8,
  },
  logoutText: {
    color: Colors.white,
  }
})
