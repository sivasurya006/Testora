import { View, Text, StyleSheet, TextInput, Platform, Pressable } from 'react-native'
import { useState } from 'react'
import Colors from '../../../../styles/Colors';
import { AntDesign } from '@expo/vector-icons';
import { fonts } from '../../../../styles/fonts';
import { Modal, Portal } from 'react-native-paper';
import { text } from 'node:stream/consumers';

export default function StudentList() {

  const [ studentsList, setSTudentsList] = useState([]);
  const [ inviteStudentModalVisible, setInviteStudentModalVisible] = useState(false);

  return (
    <View style={{flex:1}}>
      <TobBar setInviteStudentModalVisible={setInviteStudentModalVisible} />
      {
        studentsList.length === 0 ? (
          <View style={{flex:1,alignItems:'center',justifyContent:'center'}} >
            <Text style={{fontSize:16,fontFamily:fonts.semibold}}>No students yet</Text>
          </View>
        ) : (
          <View>
            
          </View>
        )
      }
      <InviteStudentModal 
        visible={inviteStudentModalVisible} 
        onConfirm={() => {
          setInviteStudentModalVisible(false);
          // TODO : handle invite student
        }} 
        onCancel={() => setInviteStudentModalVisible(false)}
      />
    </View>
  )
}


 
function TobBar( { setInviteStudentModalVisible } ) {

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


function InviteStudentModal({visible , onConfirm, onCancel}) {

    const [email, setEmail] = useState("");

  return ( 
    <Portal>
    <Modal
      visible={visible}
      onDismiss={onCancel}
      contentContainerStyle={styles.modalContent}
    >
      <TextInput
        style={styles.inputBox}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter student email"
        placeholderTextColor={Colors.shadeGray}
      />

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
            onConfirm(email);
            setEmail('');
          }}
        >
          <Text style={styles.confirmText}>Get Invite Link</Text>
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
    backgroundColor: Colors.formBg,
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
    margin : 'auto'
  },
  inputBox: {
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12 ,
    marginBottom: 20,
    color: Colors.black,
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
})