import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import api from "../../../../util/api";
import Colors from "../../../../styles/Colors";
import { useGlobalSearchParams } from "expo-router";
import Test from "../../../../src/components/Test";
import Fontisto from '@expo/vector-icons/Fontisto';
import { Ionicons, MaterialCommunityIcons, Feather, Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';


export default function Dashboard() {
  const { classroomId } = useGlobalSearchParams();

  const [stats, setStats] = useState({
    classroomName: "",
    createdAt: 0,
    creatorName: "",
    totalStudents: 0,
  });

  const [states, setStates] = useState({
    testCount: 0,
  });

  const [tests, setTests] = useState([]);

  const recentlyPublished = tests;
  const recentlySubmitted = tests;

  useEffect(() => {
    fetchDashboardData();
    fetchDashboardDatas();
    fetchDashboardTests();
  }, []);

  async function fetchDashboardData() {
    try {
      const res = await api.get("api/classroomdetails", {
        headers: { "X-Classroomid": classroomId },
      });
      if (res.status === 200) {
        setStats(res.data);
        console.log(res.data)
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function fetchDashboardDatas() {
    try {
      const res = await api.get("api/classroomdetail", {
        headers: { "X-Classroomid": classroomId },
      });
      if (res.status === 200) {
        setStates(res.data);
        console.log(res.data)

      }
    } catch (err) {
      console.log(err);
    }
  }

  async function fetchDashboardTests() {
    try {
      const res = await api.get("/api/tests/get-created-tests", {
        headers: { "X-ClassroomId": classroomId },
      });
      if (res.status === 200) {
        setTests(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (


    <View style={styles.container}>

      <View style={styles.topRow}>
        <View style={styles.detailCard}>
          <Text style={styles.title}>{stats.classroomName}</Text>
          <Text style={styles.subText}>
            Created At: {stats.createdAt ? new Date(stats.createdAt * 1000).toLocaleDateString() : "-"}
          </Text>
          <Text style={styles.subText}>Creator: {stats.creatorName}</Text>
        </View>

        <View style={styles.smallCard}>
          <Text style={styles.cardLabel}>Total Tests</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialIcons name="assignment" size={24} color={Colors.primaryColor} />
            <Text style={{ marginLeft: 8 }}>Tests: {states.testCount}</Text>
          </View>

        </View>

        <View style={styles.smallCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialIcons name="people" size={24} color={Colors.primaryColor} />
            <Text style={{ marginLeft: 8 }}>Students:{stats.totalStudents} </Text>

          </View>
        </View>

      </View>
      <View style={styles.testContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recently Published</Text>
          {recentlyPublished.length > 0 ? (
            <FlatList
              data={recentlyPublished}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => <Test data={item} />}
            />
          ) : (
            <Text>No published tests yet</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recently Submitted</Text>
          {recentlySubmitted.length > 0 ? (
            <FlatList
              data={recentlySubmitted}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => <Test data={item} />}
            />
          ) : (
            <Text>No submitted tests yet</Text>
          )}
        </View>
      </View>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f6fa",
  },

  testContainer: {
    flex: 1,
    flexDirection: "row"
  },
  studenticon: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  }
  ,
  topRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },

  detailCard: {
    flex: 2,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    height: 200,
    boxShadow: Colors.blackBoxShadow,

  },

  smallCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    boxShadow: Colors.blackBoxShadow,

  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },

  subText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },

  cardNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },

  cardLabel: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 6,
  },

  section: {
    flex: 1,
    marginTop: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },


});