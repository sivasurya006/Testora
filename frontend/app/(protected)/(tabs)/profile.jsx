import { View, Text, StyleSheet, Pressable, Platform, Image } from 'react-native'
import React, { useContext } from 'react'
import { AppBoldText } from '../../../styles/fonts'
import Colors from '../../../styles/Colors'
import { AuthContext } from '../../../util/AuthContext'
import { Avatar } from 'react-native-paper'

export default function profile() {

  const { signOut, user } = useContext(AuthContext);
  const email = user?.email || '';
  const photoUri = user?.photoUrl;

  // fall back to initials if no photo
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('') : email.charAt(0).toUpperCase();

  return (
    <View style={styles.container}>
      <View style={styles.profileBox}>
        {photoUri ? (
          <Avatar.Image size={100} source={{ uri: photoUri }} />
        ) : (
          <Avatar.Text size={100} label={initials} />
        )}
        <Text style={styles.emailText}>{email}</Text>
        <Text style={styles.roleText}>Learner</Text>
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
    alignItems: 'center',
    marginBottom: 40,
  },
  emailText: {
    marginTop: 10,
    fontSize: 18,
    color: Colors.darkFont,
  },
  roleText: {
    fontSize: 14,
    color: Colors.lightFont,
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