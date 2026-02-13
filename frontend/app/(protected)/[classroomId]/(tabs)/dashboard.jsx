import { StyleSheet, Text, View, FlatList, ScrollView } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import api from "../../../../util/api";
import Colors from "../../../../styles/Colors";
import { useFocusEffect, useGlobalSearchParams, usePathname } from "expo-router";
import Test from "../../../../src/components/Test";
import Fontisto from '@expo/vector-icons/Fontisto';
import { Ionicons, MaterialCommunityIcons, Feather, Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { ScrollView } from "react-native-gesture-handler";
// import { SafeAreaView } from "react-native-safe-area-context";
export default function Dashboard() {
  const { classroomId } = useGlobalSearchParams();
  const path = usePathname();
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
  const [stests, setsTests] = useState([]);

  const recentlyPublished = tests;
  const recentlySubmitted = stests;

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
      fetchDashboardDatas();
      fetchDashboardTests();
    }, [])
  );

  async function fetchDashboardData() {
    try {
      const res = await api.get("/api/classroomdetails", {
        headers: { "X-ClassroomId": classroomId },
      });
      if (res.status === 200) {
        setStats(res.data);
        console.log(res.data, "details")
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function fetchDashboardDatas() {
    try {
      const res = await api.get("/api/classroomcount", {
        headers: { "X-ClassroomId": classroomId },
      });
      if (res.status === 200) {
        setStates(res.data);
        console.log(res.data, "testcount")

      }
    } catch (err) {
      console.log(err);
    }
  }

  async function fetchDashboardTests() {
    try {
      const res = await api.get("/api/tests/get-created-tests?limit=5&status=published", {
        headers: { "X-ClassroomId": classroomId },
      });
      if (res.status === 200) {
        setTests(res.data);
        console.log(res.data, "rendertest")
      }
    } catch (err) {
      console.log(err);

    }
  }

  const { width } = useWindowDimensions();
  const iconSize = width <= 200 ? 24 : width <= 812 ? 20 : 28;
  const icon = width <= 200 ? 24 : width <= 812 ? 20 : 38;
  return (

    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>

        <View
          style={[styles.top, width <= 812 && { flexDirection: "column", gap: 20 }]}>
          <View style={styles.detailCard}>
            <Text style={styles.title}>{stats.classroomName}</Text>
            <Text style={styles.subText}>Creator: {stats.creatorName}</Text>

            <Text style={styles.subText}>
              Created At: {stats.createdAt ? new Date(stats.createdAt * 1000).toLocaleDateString() : "-"}
            </Text>
          </View>

          <View style={[styles.sCard, width <= 812 && { flexDirection: "row", gap: 12, width: 180, height: 100 }]}>

            <View style={styles.smallCard}>
              <View style={[{ flexDirection: 'column', alignItems: 'center', gap: 20 }, width <= 812 && { gap: 0 }]}>
                <View style={styles.width}>
                  <MaterialIcons name="assignment" size={iconSize} color={Colors.primaryColor} />
                  <Text style={[{ marginLeft: 8, fontSize: 24 }, width <= 812 && { marginLeft: 8, fontSize: 20 }]}>Tests</Text>
                </View>
                <View>
                  <Text style={styles.cardNumber}>{states.testCount}</Text>
                </View>

              </View>

            </View>

            <View style={[styles.smallCard]}>
              <View style={[{ flexDirection: 'column', alignItems: 'center', gap: 20 }, width <= 812 && { gap: 0 }]}>
                <View style={styles.width}>
                  <MaterialIcons name="people" size={icon} color={Colors.primaryColor} />
                  <Text style={[{ marginLeft: 8, fontSize: 24 }, width <= 812 && { marginLeft: 8, fontSize: 20 }]}>Students </Text>
                </View>
                <View>
                  <Text style={styles.cardNumber}>{stats.totalStudents}</Text>
                </View>

              </View>
            </View>

          </View>
        </View>
        <View style={[styles.testContainer, width <= 812 && { flexDirection: "column" }]}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recently Published</Text>
            {recentlyPublished.length > 0 ? (
              <FlatList
                data={recentlyPublished}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => <Test allTests={tests} setAllTests={setTests} data={item} />}
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
              <View style={styles.centerContainer}>
                <Text style={styles.submitted}>No submitted tests yet</Text>

              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView >
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.bgColor,
  },
  width: {
    width: 300,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

  },
  testContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 20
  },

  sCard: {
    flexDirection: "row",
    gap: 12,
    width: 420
  },

  top: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },

  studenticon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },

  topRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitted: {
    fontSize: 16,
    color: '#777',
  },

  detailCard: {
    width: "100%",
    maxWidth: 800,
    padding: 24,
    borderRadius: 12,
    height: 200,
    justifyContent: "center",
    backgroundColor: "#fff",

  },
  submitted: {

  },

  smallCard: {
    width: "100%",

    maxWidth: 450,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",

  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 30,
    // width:10
  },

  subText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 4,
  },

  cardNumber: {
    fontSize: 28,
    fontWeight: "bold",
    // color: "#fff",
  },

  cardLabel: {
    fontSize: 10,
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