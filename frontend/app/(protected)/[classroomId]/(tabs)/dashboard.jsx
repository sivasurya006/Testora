import { StyleSheet, Text, View, FlatList, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import api from "../../../../util/api";
import Colors from "../../../../styles/Colors";
import { useGlobalSearchParams } from "expo-router";

export default function Dashboard() {
  const [stats, setStats] = useState({
    classroomName: "",
    createdAt: 0,
    creatorName: "",

    // totalTests: 0,
    // totalStudents: 0,
    // recentPublished: [],
    // recentSubmitted: [],
  });
  const { classroomId } = useGlobalSearchParams();


  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      const res = await api.get("api/classroom-details", {
        headers: {
          "X-Classroomid": classroomId
        }
      });
      if (res.status === 200) {
        setStats(res.data);
        { console.log(res.data) }
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    
    <View style={styles.container}>
      <Text>Classroom Name</Text>
      <Text style={styles.title}>{stats.classroomName}</Text>
      <Text >{stats.createdAt}</Text>
      <Text>{stats.creatorName}</Text>

      <View style={styles.cardRow}>
        <View style={styles.card}>
          <Text style={styles.cardNumber}>{stats.totalTests}</Text>
          <Text style={styles.cardLabel}>Total Tests</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardNumber}>{stats.totalStudents}</Text>
          <Text style={styles.cardLabel}>Total Students</Text>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.bottomBox}>
          <Text style={styles.boxTitle}>Recently Published Tests</Text>
          {stats.recentPublished && stats.recentPublished.length > 0 ? (
            <FlatList
              data={stats.recentPublished}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <Text style={styles.listItem}> {item.testName}</Text>
              )}
            />
          ) : (<Text>No students yet</Text>
          )}
        </View>

        <View style={styles.bottomBox}>
          <Text style={styles.boxTitle}>Recently Submitted Tests</Text>
          {stats.recentSubmitted && stats.recentPublished.length > 0 ? (
            <FlatList
              data={stats.recentSubmitted}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <Text style={styles.listItem}>{item.studentName}</Text>
              )}
            />
          ) : (<Text>No tests yet</Text>)
          }
        </View>
      </View>
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 156,
  },

  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  card: {
    flex: 1,
    backgroundColor: Colors.primaryColor,
    // marginRight: 10,
    padding: 20,
    // borderRadius: 10,
    // alignItems: "center",
    marginHorizontal: 200
  },

  cardNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },

  cardLabel: {
    fontSize: 14,
    color: "#fff",
    marginTop: 4,
  },

  bottomRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  bottomBox: {
    flex: 1,
    backgroundColor: "lightpink",
    padding: 12,
    // borderRadius: 10,
    marginRight: 10,
  },

  boxTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },

  listItem: {
    fontSize: 14,
    marginBottom: 4,
  },
});

