import { Pressable, StyleSheet, Text, View, TextInput, FlatList, Platform, Dimensions, useWindowDimensions } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import Colors from "../../styles/Colors"
import { AntDesign } from "react-native-vector-icons"
import InputModal from "../components/modals/InputModal"
import api from "../../util/api";
import { router, useGlobalSearchParams } from 'expo-router'
import Test from '../components/Test'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { AppBoldText, AppMediumText } from '../../styles/fonts'
import TestBanner from '../components/TestComponentBanner'
import LoadingScreen from '../components/LoadingScreen'



const classroom_width = 360;
const { width } = Dimensions.get('window')

export default function CreatedTestList({ filter, search, isCreateTestModalVisible, setCreateTestModalVisible }) {

  if (!filter) return

  const [isLoading, setLoading] = useState(false);
  const [allCreatedTests, setCreatedTest] = useState([]);
  const [testName, setTestName] = useState("");
  const { width } = useWindowDimensions();
  const numColumns = Math.floor((width - 300) / classroom_width);

  const filteredTests = useMemo(() => {
    let filtered = allCreatedTests;

    if (filter === 'published') {
      filtered = filtered.filter(test => test.status === 'PUBLISHED');
    } else if (filter === 'drafts') {
      filtered = filtered.filter(test => test.status === 'DRAFT');
    }

    if (search && search.trim() !== '') {
      filtered = filtered.filter(test =>
        test.testTitle?.toLowerCase().includes(search.toLowerCase())
      );
    }

    return filtered;
  }, [allCreatedTests, search, filter]);

  const { classroomId } = useGlobalSearchParams();

  useEffect(() => {
    (async () => {
      setLoading(true);
      await getAllCreatedTests(setCreatedTest, classroomId, 'all');
      setLoading(false);
    })();
  }, []);

  const onCreateTest = async () => {
    if (testName.trim().length === 0) return;
    setCreateTestModalVisible(false);
    setLoading(true);
    const result = await handleCreateTest(classroomId, testName);
    if (result && filter != 'published') {
      router.push({
        pathname: '/[classroomId]/test/[testId]/edit',
        params: {
          classroomId: result.classroomId,
          testId: result.testId,
          title: result.testTitle,
          preview: 1,
        },
      })
      setLoading(false);

      setCreatedTest([result, ...allCreatedTests]);
    }
    onCancelTest();
  }

  const onCancelTest = () => {
    setCreateTestModalVisible(false);
  }

  // if (allCreatedTests.length == 0) {
  //   return (
  //     <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' , margin : 'auto' }]}>
  //       <Pressable
  //         style={styles.addButton}
  //         onPress={() =>{setCreateTestModalVisible(true); console.log('called') }}
  //       >
  //         <AntDesign name="plus" size={16} color={Colors.white} />
  //         <Text style={styles.addButtonText}>Create your first Test</Text>
  //       </Pressable>
  //     </View>
  //   )
  // }

  // if(filteredTests.length == 0){
  //   return (
  //     <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' , flex:1 }]}>
  //       <AppBoldText style={styles.emptyText}>No Tests</AppBoldText>
  //     </View>
  //   )
  // } 

  return (

    <>

      {/* <SafeAreaView style={styles.container} edges={['top']}> */}


      <LoadingScreen visible={isLoading} />

      <FlatList
        data={filteredTests}
        numColumns={numColumns}
        key={numColumns}
        keyExtractor={(item, index) => item.testId.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TestBanner allTests={allCreatedTests} setAllTests={setCreatedTest} data={item} />
        )}
      //   columnWrapperStyle={
      //     numColumns > 1 ? { justifyContent: 'center' , gap : 25 } : null
      // }
      />

      {
        filter == 'published' && filteredTests.length == 0 ? (
          <View style={{ position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -100 }, { translateY: -20 }] }}>
            <AppMediumText>No Published Tests</AppMediumText>
          </View>
        ) : (filter == 'drafts' && filteredTests.length == 0) ? (
          <View style={{ position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -100 }, { translateY: -20 }] }}>
            <AppMediumText>No Draft Tests</AppMediumText>
          </View>
        ) : (
          (filteredTests.length == 0 && !isLoading) && (
            <View style={{ position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -100 }, { translateY: -20 }] }}>
              <Pressable
                style={styles.addButton}
                onPress={() => setCreateTestModalVisible(true)}
              >
                <AntDesign name="plus" size={16} color={Colors.white} />
                <Text style={styles.addButtonText}>Create your first Test</Text>
              </Pressable>
            </View>
          )
        )
      }

      {
        isCreateTestModalVisible &&
        <InputModal
          placeholder={"Test name"}
          onCancel={onCancelTest}
          onValueChange={setTestName}
          onConfirm={onCreateTest}
        />
      }

      {/* </SafeAreaView> */}
    </>
  )
}


async function handleCreateTest(classroomId, testTitle) {
  try {
    const result = await api.post('/api/tests/create-test', { testTitle }, {
      headers: {
        "Content-Type": 'application/json',
        'X-ClassroomId': classroomId
      }
    });

    if (result.status == 200) {
      return result.data;
    }

    return null;
  } catch (err) {
    console.log(err);
  }
}


async function getAllCreatedTests(setCreatedTests, classroomId, filter) {
  console.log("called", filter)
  let status;
  switch (filter) {
    case 'published':
      status = 'published';
      break;
    case 'drafts':
      status = 'draft';
      break;
    default:
      status = '';
      break;
  }
  try {
    const result = await api.get(`/api/tests/get-created-tests?status=${status}`, {
      headers: {
        'X-ClassroomId': classroomId
      }
    });
    if (result?.status == 200) {
      setCreatedTests(result.data);
    } else {
      console.log(`can't fetch created Tests`);
    }
  } catch (err) {
    console.log(err)
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 16,
    backgroundColor: Colors.bgColor
  },

  topBar: {
    // flexDirection: 'row',
    // alignItems: 'center',
    paddingHorizontal: 16,
    // paddingTop: 10,
    gap: 10,
    paddingBottom: 10,
    ...(Platform.OS === 'web' && {
      // maxWidth: 900,
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


  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: Colors.gray,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryColor,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: Colors.white,
    marginLeft: 5,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 10,
    paddingHorizontal: 16,
    ...(Platform.OS === 'web' && {
      // maxWidth: 900,
      alignSelf: 'center',
      width: '100%',
    })
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
  },
  activeFilterButton: {
    backgroundColor: Colors.primaryColor,
  },
  filterButtonText: {
    color: Colors.gray,
    fontSize: 14,
  },
  activeFilterButtonText: {
    color: Colors.white,
  },

});
