import { View, Text, StyleSheet, FlatList, Pressable, useWindowDimensions, TextInput, Platform, Dimensions, Modal, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import api from '../../../util/api';
import Classroom from '../../../src/components/Classroom';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Colors from '../../../styles/Colors';
import { AppBoldText, AppSemiBoldText, fonts } from '../../../styles/fonts';
import { useRouter } from 'expo-router';
import LoadingScreen from '../../../src/components/LoadingScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthContext } from '../../../util/AuthContext';
import { ActivityIndicator } from 'react-native-paper';


const { width } = Dimensions.get('window');
const classroom_width = width > 400 ? 380 : 340;

export default function JoinedClassrooms() {

  const [allJoinedClassrooms, setAllJoinedClassrooms] = useState([]);
  const [selectedClassroomId, setSelectedClassroomId] = useState(null);
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 821;
  const [isLoading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const numColumns = width < 600 ? 1 : Math.max(1, Math.floor(width / classroom_width));

  useEffect(() => {
    const get = async () => {
      setLoading(true);
      await getAllJoinedClassrooms(setAllJoinedClassrooms);
      setLoading(false);
    };
    get();
  }, [])

  const router = useRouter();
  useEffect(() => {
    setSelectedClassroomId(null);  // reset
    setTimeout(() => setSelectedClassroomId(selectedClassroomId), 0);
    if (!selectedClassroomId) return;
    console.log(selectedClassroomId);
    router.push(`/student/${selectedClassroomId}/`)
  }, [selectedClassroomId]);

  const filteredJoinedClassrooms = allJoinedClassrooms.filter(item =>
    item.classroomName.toLowerCase().includes(search.toLowerCase())
  );


  return (
    <>
      <StatusBar backgroundColor={Colors.bgColor} />
      <SafeAreaView style={{ flex: 1 }} edges={['top']} >

        {/* <Header /> */}
        <View style={{ flex: 1, backgroundColor: Colors.bgColor }}>

         
          <TopBar
            isLargeScreen={isLargeScreen}
            search={search}
            setSearch={setSearch}
          />
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primaryColor} />
            </View>
          ) : allJoinedClassrooms.length != 0 ? (
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyStateCard}>
                <AppBoldText style={styles.emptyStateTitle}>No Joined Classrooms</AppBoldText>
                {/* <AppSemiBoldText style={styles.emptyStateMessage}>
                  Classroom joining is not available yet.
                </AppSemiBoldText> */}
              </View>
            </View>
          ) : <FlatList
            numColumns={numColumns}
            data={filteredJoinedClassrooms}
            key={numColumns}
            keyExtractor={item => item.classroomId.toString()}
            renderItem={({ item }) => (
              <Classroom id={item.classroomId} name={item.classroomName}
                createdAt={item.createdAt} createdBy={item.createdBy}
                setClassroomID={setSelectedClassroomId}
                setCreatedClassrooms={setAllJoinedClassrooms}
                createdClassrooms={allJoinedClassrooms}
                totalTests={item.totalTests}
                totalAttempted={item.totalAttempted}
                isMenuNeed={false} />
            )}
          />
          }
          {/* {createModalVisible ?
            <InputModal placeholder={"Class name"}
              visible={createModalVisible}
              onValueChange={setClassroomName}
              onConfirm={onConfirmCreateClassModal}
              onCancel={onCancelCreateClassModal} />
            : null} */}

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

function TopBar({ isLargeScreen, search, setSearch }) {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const { signOut } = useContext(AuthContext);
  const { width } = useWindowDimensions();
  const isMobile = width < 600;

  return (
    <>
      <View style={styles.topBar}>
        <View style={[styles.leftSection, isMobile && { flex: 0 }]}>
          <AppBoldText style={styles.topBarHeader}>Joined Classrooms</AppBoldText>
          <AppSemiBoldText style={styles.topBarSubText}>
            Learn together and stay on track with your active classes.
          </AppSemiBoldText>
        </View>

        <View style={[styles.rightSection, isMobile && {
          flex: 1,
          width: '100%'
        }]}>

          <View style={[styles.searchContainer,
          isMobile && {
            flex: 1
          }
          ]}>
            <Ionicons name="search" size={18} color={Colors.dimBg} />

            <TextInput
              placeholder="Search classrooms..."
              placeholderTextColor={Colors.dimBg}
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
            />
          </View>
          {/* <TouchableOpacity
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
          </TouchableOpacity> */}
          {
            isLargeScreen && (
              <TouchableOpacity
                onPress={() => {
                  setTooltipVisible(true);
                }}
              >
                <MaterialIcons name='account-circle' size={34} color={Colors.secondaryColor} />
              </TouchableOpacity>
            )
          }
          <Modal transparent visible={tooltipVisible} animationType="fade">
            <Pressable
              style={{ flex: 1 }}
              onPress={() => setTooltipVisible(false)}
            >
              <View
                style={{
                  position: 'absolute',
                  top: 65,
                  right: 50,
                  backgroundColor: 'white',
                  borderRadius: 8,
                  padding: 4,
                  elevation: 10,
                  shadowColor: Colors.shadowColor,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.25,
                  shadowRadius: 6,
                  minWidth: 140,
                }}
              >
                <Pressable
                  style={({ pressed }) => [
                    {
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                      paddingVertical: 10,
                      paddingHorizontal: 12,
                      borderRadius: 6,
                      backgroundColor: pressed ? '#ffe6e6' : 'white',
                    },
                  ]}
                  onPress={() => {

                    console.log('Logging out...');
                    setTooltipVisible(false);
                    signOut();
                  }}
                >
                  <MaterialIcons name="logout" size={20} color="#d32f2f" />
                  <AppSemiBoldText style={{ color: '#d32f2f', fontSize: 16 }}>
                    Log out
                  </AppSemiBoldText>
                </Pressable>
              </View>
            </Pressable>
          </Modal>
        </View>
      </View>
    </>
  );
}


const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  emptyStateCard: {
    width: '100%',
    maxWidth: width > 400 ? 380 : 340,
    minHeight: 250,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 26,
    rowGap: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dotted',
    borderColor: Colors.primaryColor + '66',
    backgroundColor: Colors.white,
    marginVertical: 8,
    marginHorizontal: 10,
    boxShadow: Colors.blackBoxShadow,
    elevation: 6,
  },
  emptyStateTitle: {
    color: Colors.secondaryColor,
    fontSize: 18,
  },
  emptyStateMessage: {
    color: Colors.lightFont,
    textAlign: 'center',
    fontSize: 14,
  },
  topBar: {
    flexDirection: 'row',
    margin: 20,
    alignItems: 'center',
    justifyContent: 'space-between',

    ...(width < 800 ? {
      flexDirection: 'column',
      gap: 20,
      alignItems: 'flex-start',
      marginHorizontal: 10,
      width: '100%',
      margin: 10,
      paddingRight: 20,
    } : {})
  },

  topBarHeader: {
    fontSize: 22,
    fontFamily: fonts.bold,
  },
  leftSection: {
    flex: 2,
  },
  topBarSubText: {
    fontSize: 13,
    color: Colors.lightFont,
    marginTop: 4,
    marginBottom: 2,
  },
  joinBtn: {
    backgroundColor: Colors.primaryColor,
    width: 105,
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: 8,
    // marginRight: 10,
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
    // marginRight: 6,
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 38,
    width: 'auto',
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
    justifyContent: 'flex-end',
    gap: 12,
    marginRight: 30,
    width: '100%',
    flex: 1
  },
  tooltip: {
    position: 'absolute',
    top: 30,
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,

    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,

    zIndex: 2000,

    width: 100,
    height: 100,

    elevation: 5,
  }
});
