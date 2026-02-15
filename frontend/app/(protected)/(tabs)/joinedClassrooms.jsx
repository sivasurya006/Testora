import { View, Text, StyleSheet, FlatList, Pressable, useWindowDimensions, TextInput, Platform, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import api from '../../../util/api';
import EmptyClassroom from '../../../src/components/EmptyClassroom';
import Classroom from '../../../src/components/Classroom';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Colors from '../../../styles/Colors';
import { fonts } from '../../../styles/fonts';
import { useRouter } from 'expo-router';
import LoadingScreen from '../../../src/components/LoadingScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const classroom_width = 340;
const { width } = Dimensions.get('window');


export default function JoinedClassrooms() {

  const [allJoinedClassrooms, setAllJoinedClassrooms] = useState([]);
  const [selectedClassroomId, setSelectedClassroomId] = useState(null);
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 821;
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const numColumns = Math.floor((width - 300) / classroom_width);

  useEffect(() => {
    setLoading(true)
    getAllJoinedClassrooms(setAllJoinedClassrooms);
    setLoading(false)
  }, [])

  const router = useRouter();
  useEffect(() => {
    setSelectedClassroomId(null);  // reset
    setTimeout(() => setSelectedClassroomId(selectedClassroomId), 0);
    if (!selectedClassroomId) return;
    console.log(selectedClassroomId);
    router.push(`/student/${selectedClassroomId}/`)
  }, [selectedClassroomId])


  return (
    <>
      <StatusBar backgroundColor={Colors.bgColor} />
      <SafeAreaView style={{ flex: 1 }} edges={['top']} >

        {/* <Header /> */}
        <View style={{ flex: 1, backgroundColor: Colors.bgColor }}>

          <LoadingScreen visible={isLoading} />
          <TopBar setCreateModalVisible={setCreateModalVisible} isLargeScreen={isLargeScreen} />
          {allJoinedClassrooms.length == 0 ? (
            <EmptyClassroom message="No Joined classrooms\nAvailable" />
          ) : <FlatList
            numColumns={numColumns}
            data={allJoinedClassrooms}
            key={numColumns}
            keyExtractor={item => item.classroomId.toString()}
            renderItem={({ item }) => (
              <Classroom id={item.classroomId} name={item.classroomName}
                createdAt={item.createdAt} createdBy={item.createdBy}
                setClassroomID={setSelectedClassroomId}
                setCreatedClassrooms={setAllJoinedClassrooms}
                createdClassrooms={allJoinedClassrooms}
                isMenuNeed={false} />
            )}
            contentContainerStyle={
              numColumns > 1 ? { justifyContent: 'center' } : null
            }
          />
          }
          {createModalVisible ?
            <InputModal placeholder={"Class name"}
              visible={createModalVisible}
              onValueChange={setClassroomName}
              onConfirm={onConfirmCreateClassModal}
              onCancel={onCancelCreateClassModal} />
            : null}

        </View >
      </SafeAreaView>
    </>
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


function TopBar({ setCreateModalVisible, isLargeScreen }) {

  const [isHovered, setIsHovered] = useState(false);
  return (
    <>
      {/* <StatusBar backgroundColor={Colors.bgColor} /> */}
      <View style={styles.topBar}>
        <Text style={styles.topBarHeader}>Joined Classrooms</Text>
        <View style={styles.rightSection} >
          <View style={styles.searchContainer}>

            <Ionicons name="search" size={18} color={Colors.dimBg} />

            <TextInput
              placeholder="Search classrooms..."
              placeholderTextColor={Colors.dimBg}
              style={styles.searchInput}
            />
          </View>
          <Pressable
            style={[
              styles.joinBtn,
              isHovered && styles.hoveredButton
            ]}
            onHoverIn={() => setIsHovered(true)}
            onHoverOut={() => setIsHovered(false)}
            onPress={() => setCreateModalVisible(true)}
          >
            <View style={styles.joinBtnContent}>
              <MaterialIcons
                name="input"
                size={16}
                color={Colors.white}
              />
              <Text style={styles.joinBtnText}>Join</Text>
            </View>
          </Pressable>
          {
            isLargeScreen ? (
              <Pressable>
                <MaterialIcons
                  name='account-circle'
                  size={34}
                  color={Colors.secondaryColor}
                />
              </Pressable>
            ) : null
          }
        </View>
      </View>
    </>
  );
}


const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    margin: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    ...(width < 800 ? {
      flexDirection: 'column',
      gap: 20,
      alignItems: 'flex-start',
      marginHorizontal: 10
    } : {})
  },

  topBarHeader: {
    fontSize: 22,
    fontFamily: fonts.bold,
  },
  joinBtn: {
    backgroundColor: Colors.primaryColor,
    // width: 90,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  joinBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  },

  joinBtnText: {
    color: Colors.white,
    fontSize: 15,
    marginRight: 6,
    fontWeight: 500,
    fontFamily: fonts.regular
  },
  hoveredButton: {
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 38,
    width: '58%',
    borderWidth: 1,
    borderColor: Colors.primaryColor + '30',
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: Colors.secondaryColor,
    outlineWidth: 0
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
