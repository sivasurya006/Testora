import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import Colors from '../../../../../styles/Colors';
import { ActivityIndicator } from 'react-native-paper';
import api from '../../../../../util/api';
import { useGlobalSearchParams, useFocusEffect } from 'expo-router';
import { FlatList } from 'react-native-gesture-handler';
import StudentTest from '../../../../../src/components/StudentTest';
import { TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StudentSubmissions() {

  const [SubmittedTest, setSubmittedTest] = useState([]);
  const { classroomId } = useGlobalSearchParams();
  const [Loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

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
      }
    } catch (err) {
      console.log(err)
    }
  }

  if (Loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      {/* Search Bar */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#9CA3AF" />
          <TextInput
            placeholder="Search by test name"
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={setSearchText}
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* List */}
      <FlatList
        data={filteredTests}
        keyExtractor={(item) => item.testId.toString()}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <StudentTest data={item} isStudentTest={false} />
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No submissions found</Text>
          </View>
        }
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchWrapper: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
    backgroundColor: Colors.white,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#111827",
  },

  listContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },

  cardWrapper: {
    marginBottom: 12,
  },

  emptyContainer: {
    marginTop: 60,
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 14,
    color: "#6B7280",
  },
});