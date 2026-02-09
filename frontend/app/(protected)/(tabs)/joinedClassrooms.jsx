import { View, Text, StyleSheet, FlatList, Pressable, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import api from '../../../util/api';
import EmptyClassroom from '../../../src/components/EmptyClassroom';
import Classroom from '../../../src/components/Classroom';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../../styles/Colors';

const classroom_width = 320;

export default function JoinedClassrooms() {

  const [allJoinedClassrooms, setAllJoinedClassrooms] = useState([]);
  const [selectedClassroomId, setSelectedClassroomId] = useState(null);
  const { width } = useWindowDimensions();
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const numColumns = Math.floor(width / classroom_width);

  useEffect(() => {
    getAllJoinedClassrooms(setAllJoinedClassrooms);
  }, [])

  useEffect(() => {
    console.log(selectedClassroomId);
  }, [selectedClassroomId])

  return (
    <React.Fragment>
      <TopBar setCreateModalVisible={setCreateModalVisible}/>
      {allJoinedClassrooms.length == 0 ? (
        <EmptyClassroom message={"No classrooms available"} />
      ) : <FlatList
        numColumns={numColumns}
        data={allJoinedClassrooms}
        keyExtractor={item => item.classroomId}
        key={numColumns}
        renderItem={({ item }) => (
          <Classroom id={item.classroomId} name={item.classroomName}
            createdAt={item.createdAt} createdBy={item.createdBy}
            setClassroomID={setSelectedClassroomId}
            setCreatedClassrooms={setAllJoinedClassrooms}
            createdClassrooms={JoinedClassrooms}
            isMenuNeed={false} />
        )}

      />
      }
    </React.Fragment>
  )
}

async function getAllJoinedClassrooms(setAllJoinedClassrooms) {
  try {
    const result = await api.get('/api/joined-classrooms');
    if (result.status == 200) {
      setAllJoinedClassrooms(result.data)
    } else {
      throw new Error(`can't fetch created classrooms`);
    }
  } catch (err) {
    console.log(err);
  }
}


function TopBar({ setCreateModalVisible }) {
  return (
    <View style={styles.topBar}>
      <Text style={styles.topBarHeader}>Joined Classrooms</Text>

      <Pressable
        style={styles.joinBtn}
        onPress={() => setCreateModalVisible(true)}
      >
        <View style={styles.joinBtnContent}>
          <Text style={styles.joinBtnText}>Join</Text>
          <MaterialIcons
            name="input"
            size={16}
            color={Colors.white}
          />
        </View>
      </Pressable>
    </View>
  );
}


const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    margin: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  topBarHeader: {
    fontSize: 18,
  },

  joinBtn: {
    backgroundColor: Colors.primaryColor,
    width: 90,
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  joinBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  joinBtnText: {
    color: Colors.white,
    fontSize: 15,
    marginRight: 6,
  },

});
