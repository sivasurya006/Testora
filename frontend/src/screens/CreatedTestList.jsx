import { Pressable, StyleSheet, Text, View, TextInput, FlatList, Platform, Dimensions, useWindowDimensions } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Colors from "../../styles/Colors"
import { AntDesign } from "react-native-vector-icons"
import InputModal from "../components/modals/InputModal"
import api from "../../util/api";
import { router, useFocusEffect, useGlobalSearchParams } from 'expo-router'
import Test from '../components/Test'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { AppMediumText } from '../../styles/fonts'
import TestBanner from '../components/TestComponentBanner'



const classroom_width = 360;
const { width } = Dimensions.get('window')

export default function CreatedTestList({ filter }) {

  if (!filter) return

  const [allCreatedTests, setCreatedTest] = useState([]);
  const [isCreateTestModalVisible, setCreateTestModalVisible] = useState(false);
  const [testName, setTestName] = useState("");
  const [searchText, setSearchText] = useState("");
  const { width } = useWindowDimensions();
  const numColumns = Math.floor((width - 300) / classroom_width);
  console.log(numColumns)

  

  const { classroomId } = useGlobalSearchParams();

  useFocusEffect(
    useCallback(() => {
      getAllCreatedTests(setCreatedTest, classroomId, filter);
    }, [classroomId, filter])
  );

  const onCreateTest = async () => {
    if (testName.trim().length === 0) return;
    const result = await handleCreateTest(classroomId, testName);
    console.log("result ", result)
    if (result && filter != 'published') {
      console.log('/[classroomId]/(tabs)/tests/[testId]/edit')
      router.push({
        pathname: '/[classroomId]/(tabs)/tests/[testId]/edit',
        params: {
          classroomId: result.classroomId,
          testId: result.testId,
          title: result.testTitle,
        },
      })
      setCreatedTest([result, ...allCreatedTests]);
    }
    onCancelTest();
  }

  const onCancelTest = () => {
    setCreateTestModalVisible(false);
  }

  return (

    <>
      <StatusBar style="light" translucent />
      <SafeAreaView style={styles.container}>


        <View style={styles.topBar}>
          <Pressable
            style={styles.addButton}
            onPress={() => setCreateTestModalVisible(true)}
          >
            <AntDesign name="plus" size={16} color={Colors.white} />
            <Text style={styles.addButtonText}>Create</Text>
          </Pressable>
        </View>

        {
          allCreatedTests.length == 0 ? (
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
              <AppMediumText style={styles.emptyText}>No tests found</AppMediumText>
            </View>
          ) : (
            <FlatList
              data={allCreatedTests}
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

      </SafeAreaView>
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
  console.log("called")
  let status;
  switch (filter) {
    case 'published':
      status = 'published';
      break;
    case 'draft':
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
      console.log("createed tst data", result.data)
    } else {
      console.log(`can't fetch created classrooms`);
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
    paddingTop: 10,
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

  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryColor,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 8,
    alignSelf: 'flex-end'
  },

  addButtonText: {
    color: Colors.white,
    marginLeft: 6,
    fontSize: 14,
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: Colors.gray,
  }
});
