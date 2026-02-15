import { StyleSheet, Text, View, FlatList, ScrollView, Dimensions } from "react-native";
import React, { useCallback, useState } from "react";
import api from "../../../../util/api";
import Colors from "../../../../styles/Colors";
import { useFocusEffect, useGlobalSearchParams } from "expo-router";
import Test from "../../../../src/components/Test";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LineChart, PieChart } from "react-native-chart-kit";

export default function Dashboard() {
  const { classroomId } = useGlobalSearchParams();
  const screenWidth = Dimensions.get("window").width;

  const [stats, setStats] = useState({
    classroomName: "",
    createdAt: 0,
    creatorName: "",
    totalStudents: 0,
  });

  const [states, setStates] = useState({ testCount: 0 });
  const [tests, setTests] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
      fetchDashboardCount();
      fetchDashboardTests();
    }, [])
  );

  async function fetchDashboardData() {
    try {
      const res = await api.get("/api/classroomdetails", {
        headers: { "X-ClassroomId": classroomId },
      });
      if (res.status === 200) setStats(res.data);
    } catch (err) {}
  }

  async function fetchDashboardCount() {
    try {
      const res = await api.get("/api/classroomcount", {
        headers: { "X-ClassroomId": classroomId },
      });
      if (res.status === 200) setStates(res.data);
    } catch (err) {}
  }

  async function fetchDashboardTests() {
    try {
      const res = await api.get(
        "/api/tests/get-created-tests?limit=5&status=published",
        { headers: { "X-ClassroomId": classroomId } }
      );
      if (res.status === 200) setTests(res.data);
    } catch (err) {}
  }

  const pieData = [
    { name: "Submitted", population: 35, color: "#4CAF50", legendFontColor: "#333", legendFontSize: 12 },
    { name: "Not Submitted", population: 15, color: "#F87171", legendFontColor: "#333", legendFontSize: 12 },
  ];

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [{ data: [25, 72, 69, 90, 70] }],
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>

        <View style={styles.cardRow}>
          <View style={styles.smallCard}>
            <MaterialIcons name="assignment" size={28} color={Colors.primaryColor} />
            <View>
              <Text style={styles.cardTitle}>Tests</Text>
              <Text style={styles.cardNumber}>{states.testCount}</Text>
            </View>
          </View>

          <View style={styles.smallCard}>
            <MaterialIcons name="people" size={28} color={Colors.primaryColor} />
            <View>
              <Text style={styles.cardTitle}>Students</Text>
              <Text style={styles.cardNumber}>{stats.totalStudents}</Text>
            </View>
          </View>
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.title}>{stats.classroomName}</Text>
          <Text style={styles.subText}>Creator: {stats.creatorName}</Text>
          <Text style={styles.subText}>
            Created: {stats.createdAt ? new Date(stats.createdAt * 1000).toLocaleDateString() : "-"}
          </Text>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Monthly Progress</Text>
          <LineChart
            data={lineData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
          />
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Submission</Text>
          <PieChart
            data={pieData}
            width={screenWidth - 40}
            height={200}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recently Published</Text>
          {tests.length > 0 ? (
            <FlatList
              data={tests}
              scrollEnabled={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => <Test data={item} isDashboard />}
            />
          ) : (
            <Text>No tests yet</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(33,150,243,${opacity})`,
  labelColor: () => "#333",
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.bgColor,
  },

  cardRow: {
    flexDirection: "row",
    gap: 12,
  },

  smallCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },

  cardTitle: {
    fontSize: 14,
    color: "#555",
  },

  cardNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },

  detailCard: {
    marginTop: 16,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },

  subText: {
    fontSize: 14,
    color: "#555",
  },

  chartCard: {
    marginTop: 16,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },

  section: {
    marginTop: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
});