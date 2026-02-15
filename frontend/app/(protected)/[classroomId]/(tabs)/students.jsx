import { View, Text, StyleSheet, TextInput, Platform, Pressable } from 'react-native'
import { useEffect, useState } from 'react'
import Colors from '../../../../styles/Colors';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { fonts } from '../../../../styles/fonts';
import { Modal, Portal } from 'react-native-paper';
import api from '../../../../util/api';
import { useGlobalSearchParams } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function StudentList() {

  const [studentsList, setStudentsList] = useState([]);
  const [inviteStudentModalVisible, setInviteStudentModalVisible] = useState(false);

  const { classroomId } = useGlobalSearchParams();

  async function getStudentsList() {
    try {
      const result = await api.get('/api/students', {
        headers: {
          'X-ClassroomId': classroomId
        }
      });
      if (result?.status == 200 && result.data) {
        setStudentsList(result.data);
      } else {
        console.log("can't get students list");
      }
    } catch (err) {
      console.log("getStudentsList", err.response?.data);
    }
  }

  useEffect(() => {
    getStudentsList();
  }, [])

  console.log(studentsList)

  return (
   <>
     <StatusBar translucent/>
    <SafeAreaView style={{ flex: 1 }}>
      <TobBar setInviteStudentModalVisible={setInviteStudentModalVisible} />
      {
        studentsList.length === 0 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
            <Text style={{ fontSize: 16, fontFamily: fonts.semibold }}>No students yet</Text>
          </View>
        ) : (
          <View style={styles.tableContainer}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableItem, styles.headerItem]}>S.No</Text>
              <Text style={[styles.tableItem, styles.headerItem]}>Name</Text>
              <Text style={[styles.tableItem, styles.headerItem]}>Email</Text>
              <Text style={[styles.tableItem, styles.headerItem]}>Enrolled Date</Text>
              <Text style={[styles.tableItem, styles.headerItem]}>View Activity</Text>
            </View>
            {studentsList.map((student, i) => (
              <View key={student.user.userId} style={styles.tableRow}>
                <Text style={styles.tableItem}>{i + 1}</Text>
                <Pressable
                  onPress={() => console.log('profile')}
                  style={{ flex: 1 }}
                >
                  <Text style={[styles.tableItem, styles.linkText]}>
                    {student.user.name}
                  </Text>
                </Pressable>
                <Text style={styles.tableItem}>{student.user.email}</Text>
                <Text style={styles.tableItem}>
                  {new Date(student.user.registeredAt * 1000).toLocaleDateString('en-GB', {day: 'numeric',month: 'short',year: 'numeric'})}
                </Text>
                <Pressable
                  onPress={() => console.log('Activity')}
                  style={{ flex: 1 }}>
                  <Text style={[styles.tableItem, styles.linkText]}>View Activity</Text>
                </Pressable>
              </View>
            ))}
          </View>

        )
      }

      <InviteStudentModal
        visible={inviteStudentModalVisible}
        onConfirm={async (link) => {
          await Clipboard.setStringAsync(link);
          setInviteStudentModalVisible(false);
        }}
        onCancel={() => setInviteStudentModalVisible(false)}
      />
    </SafeAreaView>
   </>
  )
}



function TobBar({ setInviteStudentModalVisible }) {

  const [searchText, setSearchText] = useState('');


  return (
    <View style={styles.topBar}>
      <TextInput
        placeholder="Search student..."
        value={searchText}
        onChangeText={setSearchText}
        style={styles.searchInput}
      />

      <Pressable
        style={styles.addButton}
        onPress={() => setInviteStudentModalVisible(true)}
      >
        <AntDesign name="plus" size={16} color={Colors.white} />
        <Text style={styles.addButtonText}>Invite</Text>
      </Pressable>
    </View>
  )
}


function InviteStudentModal({ visible, onConfirm, onCancel }) {

  const [link, setLink] = useState("Please refresh the link");
  const [refreshing, setRefreshing] = useState(false);
  const baseLink = "http://localhost:8081/join/classroom?code=";
  const { classroomId } = useGlobalSearchParams();

  const changeClassroomInviteLink = async () => {
    try {
      const result = await api.get('/api/classroom/updateInviteLink', {
        headers: {
          'X-ClassroomId': classroomId
        }
      });
      if (result?.status == 200 && result.data.code) {
        setLink(baseLink + result.data.code);
        return;
      } else {
        console.log("can't change invite link");
      }
    } catch (err) {
      console.log("changeClassroomInviteLink err ", err.response?.data);
    }
    setLink("Please refresh the link");
  }

  const getClassroomInviteLink = async () => {
    try {
      const result = await api.get('/api/classroom/inviteLink', {
        headers: {
          'X-ClassroomId': classroomId
        }
      });
      if (result?.status == 200 && result.data.code) {
        setLink(baseLink + result.data.code);
        return;
      } else {
        console.log("can't get invite link");
      }
    } catch (err) {
      console.log("getClassroomInviteLink err ", err.response?.data);
    }
    setLink("Please refresh the link");
  }


  useEffect(() => {
    if (!visible) return;
    getClassroomInviteLink();
  }, [visible, refreshing]);


  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onCancel}
        contentContainerStyle={styles.modalContent}
      >
        <View style={styles.inputBox}>
          <Text
            style={styles.linkText}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {link}
          </Text>
          <Pressable onPress={changeClassroomInviteLink}>
            <FontAwesome name='refresh' size={16} />
          </Pressable>
        </View>




        <View style={styles.options}>
          <Pressable
            style={[styles.optionBtn, styles.cancelBtn]}
            onPress={onCancel}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>

          <Pressable
            style={[styles.optionBtn, styles.confirmBtn]}
            onPress={() => {
              onConfirm(link);
            }}
          >
            <Text style={styles.confirmText}>CopyLink
            </Text>
          </Pressable>
        </View>
      </Modal>
    </Portal>
  )
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
    ...(Platform.OS === 'web' && {
      maxWidth: 900,
      alignSelf: 'center',
      width: '100%',
    })
  },

  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryColor,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 8,
  },
  addButtonText: {
    color: Colors.white,
    marginLeft: 6,
    fontSize: 14,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
    margin: 'auto',
  },
  inputBox: {
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  linkText: {
    flex: 1,
    marginRight: 8,
    color: '#1DA1F2'
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  optionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelBtn: {
    backgroundColor: '#ddd',
  },
  confirmBtn: {
    backgroundColor: Colors.primaryColor,
  },
  cancelText: {
    color: Colors.black,
    fontWeight: '500',
  },
  confirmText: {
    color: Colors.white,
    fontWeight: '500',
  },
  tableContainer: {
    margin: 16,
    borderWidth: 1,
    borderColor: Colors.thirdColor,
    borderRadius: 8,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: Colors.thirdColor,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',

  },
  tableHeader: {
    backgroundColor: Colors.thirdColor,
  },
  tableItem: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.regular,
    color: Colors.black,
  },
  headerItem: {
    color: '#000',
    fontFamily : fonts.bold,
    fontWeight: '600'
  },
  linkText: {
    color: Colors.primaryColor,
    textDecorationLine: 'underline',
  },

  progressBarContainer: {
    flex: 1,
    height: 10,
    backgroundColor: Colors.lightGray,
    borderRadius: 5,
    overflow: 'hidden',
    marginRight: 8
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primaryColor,
    borderRadius: 5
  },

})