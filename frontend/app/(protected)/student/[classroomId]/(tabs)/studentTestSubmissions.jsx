import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '../../../../../styles/Colors';
import SubmissionsHeader from '../../../../../src/components/submissions/SubmissionsHeader';
import { ActivityIndicator } from 'react-native-paper';
import api from '../../../../../util/api';
import { useGlobalSearchParams } from 'expo-router';

import { FlatList } from 'react-native-gesture-handler';
import GradeScreen from '../../../../../src/screens/GradeScreen';
import { AppSemiBoldText } from '../../../../../styles/fonts';
import DetailedTestReport from '../../../../../src/components/DetailedTestReport';
import StudentTest from '../../../../../src/components/StudentTest';
import StudentTestLists from './tests';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
export default function StudentSubmissions() {


  const [SubmittedTest, setSubmittedTest] = useState([]);
  const { classroomId, testId } = useGlobalSearchParams();
  const [Loading, setLoading] = useState();
  const [searchText, setSearchText] = useState("");
  // useFocusEffect(
  //   useCallback(() => {
  //     setLoading(true);
  //     const get = async () => await getSubmittedTests(setSubmittedTest, classroomId);
  //     get();
  //     setLoading(false);
  //   }, [classroomId])
  // );

  const { width } = Dimensions.get('window');
  
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        await getSubmittedTests();
        setLoading(false);
      };

      fetchData();
    }, [classroomId])
  );

  if (Loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  // const filteredTests = SubmittedTest?.filter((item) => {
  //   if (!searchText) return true;

  //   return item.tesTitle
  //     ?.toLowerCase()
  //     .includes(searchText.toLowerCase());
  // });


  const filteredTests = SubmittedTest.filter((item) =>
    item?.testTitle
      ?.toLowerCase()
      .includes(searchText.toLowerCase())
  );
  async function getSubmittedTests() {
    try {
      const result = await api.get(`/studenttest/getStudentSubmittedTests`, {

        headers: {
          'X-ClassroomId': classroomId

        }
      });
      if (result?.status == 200) {
        setSubmittedTest(result.data.reverse());
        console.log("submitted ", result.data);
        console.log("FIRST OBJECT:", result.data[0]);
      } else {

        console.log(`can't fetch created classrooms`);
      }
    } catch (err) {



      console.log(err)
    }
  }

  console.log("check if it pass", SubmittedTest)
  return (
    <View style={{ flex: 1 }}>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={Colors.dimBg} />

        <TextInput
          placeholder="Search by test name"
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={filteredTests}
        keyExtractor={(item) => item.testId.toString()}
        renderItem={({ item }) => (
          <StudentTest data={item} isStudentTest={false} />
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  // searchContainer: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   paddingHorizontal: 16,
  //   paddingVertical: 12,
  //   backgroundColor: Colors.white,
  // },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 38,
        width: '50%',
        // margin: 20,
        marginLeft: 'auto',
        marginRight: 20,
        borderWidth: 2,
        marginTop:20,
        borderColor: Colors.secondaryColor + '30',
        // ...(width < 1110 ? {
        //     width: '90%',
        //     marginTop: 20,
        // } : {}
        // )
    },
  searchInput: {
    // backgroundColor: "#F3F4F6",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    fontSize: 14,
  },
})