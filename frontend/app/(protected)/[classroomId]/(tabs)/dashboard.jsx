import { StyleSheet, Text, View, FlatList, ScrollView, Dimensions } from "react-native";
import React, { useCallback, useState } from "react";
import api from "../../../../util/api";
import Colors from "../../../../styles/Colors";
import { useFocusEffect, useGlobalSearchParams } from "expo-router";
import Test from "../../../../src/components/Test";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LineChart, PieChart } from "react-native-chart-kit";
import { fonts } from "../../../../styles/fonts";
import { StatusBar } from "expo-status-bar";

export default function Dashboard({ }) {
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
    } catch (err) {
      console.log(err);
    }
  }

  async function fetchDashboardCount() {
    try {
      const res = await api.get("/api/classroomcount", {
        headers: { "X-ClassroomId": classroomId },
      });
      if (res.status === 200) setStates(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  async function fetchDashboardTests() {
    try {
      const res = await api.get(
        "/api/tests/get-created-tests?limit=5&status=published",
        { headers: { "X-ClassroomId": classroomId } }
      );
      if (res.status === 200) setTests(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  const screenWidth = Dimensions.get("window").width;

  const pieData = [
    {
      name: "Submitted",
      population: 35,
      color: "#4CAF50",
      legendFontColor: "#333",
      legendFontSize: 14,
    },
    {
      name: "Not Submitted",
      population: 15,
      color: "#F44336",
      legendFontColor: "#333",
      legendFontSize: 14,
    },
  ];
  const array = [
    { name: "Pirthika", score: 95 },
    { name: "Arun", score: 90 },
    { name: "Divya", score: 88 },
    { name: "Divya", score: 88 },

    { name: "Divya", score: 88 },

  ];
  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [{ data: [25, 72, 69, 90, 70] }],
  };
  return (
    <>
      <StatusBar translucent />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.Cards}>
            <View style={styles.smallCardRow}>
              <View style={styles.smallCard}>
                <View>
                  <MaterialIcons name="assignment" size={34} color={Colors.primaryColor} />

                </View>
                <View style={styles.Count}>
                  <Text style={styles.cardTitle}>Total Tests</Text>
                  <Text style={styles.cardNumber}>{states.testCount}</Text>
                </View>

              </View>

              <View style={styles.smallCard}>
                <View>
                  <MaterialIcons name="people" size={34} color={Colors.primaryColor} />
                </View>
                <View style={styles.Count}>
                  <Text style={styles.cardTitle}>Total Students</Text>
                  <Text style={styles.cardNumber}>{stats.totalStudents}</Text>
                </View>
              </View>
            </View>

            <View style={styles.detailCard}>
              <View style={styles.classroomDeatilTop}></View>
              <View style={styles.ClassRoomCard}></View>
              <View style={styles.classRoomDetailCard}>
                <Text style={styles.title}>{stats.classroomName}</Text>
                <View style={styles.creatorCard}>
                  <Text style={styles.subText}>
                    Creator: </Text>
                  <Text style={styles.createdetail}>{stats.creatorName}</Text>
                </View>
                <View style={styles.creatorCard}>

                  <Text style={styles.subText}>
                    Created At:{" "}</Text>
                  <Text>

                    {stats.createdAt
                      ? new Date(stats.createdAt * 1000).toLocaleDateString()
                      : "-"}</Text>


                </View>
              </View>

            </View>
          </View>

          <View style={styles.graph1}>

            <View style={styles.LineCard}>
              <Text style={styles.sectionTitle}>Monthly Progress</Text>
              <LineChart
                data={lineData}
                width={960}
                height={400}
                yAxisSuffix="%"
                chartConfig={LineConfig}
                bezier
              />
            </View>
            <View style={styles.chartCard}>
              <Text style={styles.sectionTitle}>Submission Status</Text>
              <PieChart
                data={pieData}
                width={400}
                height={220}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
              />
            </View>
          </View>


          <View style={styles.bottom}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recently Published</Text>
              {tests.length > 0 ? (
                <FlatList
                  data={tests}
                  contentContainerStyle={{ backgroundColor: Colors.bgColor }}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => <Test data={item} isDashboard={false} />}
                />
              ) : (
                <Text>No published tests yet</Text>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}> Toppers</Text>

              <View style={styles.topperContainer}>
                {array.map((item, index) => (
                  <View key={index} style={styles.topperCard}>
                    <View style={styles.nameProfile}>
                      <Text style={styles.profileText}>
                        {item.name.substring(0, 2).toUpperCase()}
                      </Text>
                    </View>

                    <View>
                      <Text style={styles.topperName}>{item.name}</Text>
                      <Text style={styles.topperScore}>Score: {item.score}</Text>

                    </View>
                    <View style={styles.progressIcon}>
                      <MaterialIcons name="trending-up" size={20} color="green" />

                    </View>

                  </View>
                ))}


              </View>


            </View>



          </View>



        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const chartConfig = {
  backgroundColor: "#fff",
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
  labelColor: () => "#333",
};
const LineConfig = {
  backgroundColor: "#fff",
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
  labelColor: () => "#333",
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.bgColor,
  },
  bottom: {
    flexDirection: "row",

  },
  creatorCard: {
    flexDirection: "row",
    alignItems: "center",

  },

  classRoomDetailCard: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 100
  },
  classroomDeatilTop: {
    height: 120,
    backgroundColor: "#DFE8FB",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,


  },
  topperContainer: {
    marginTop: 10,
    backgroundColor: Colors.white,
    padding: 20
  },
  progressIcon: {
    paddingHorizontal: 200
  },
  smallCardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  Count: {
    paddingLeft: 30
  },

  smallCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 36,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
    width: 485,
    height: 150,
    marginTop: 30,
    flexDirection: "row",
  },

  topperCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F6F8",
    padding: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    marginTop: 10,
    height: 100,
    gap: 20,
    width: 560
  },

  nameProfile: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },

  profileText: {
    fontWeight: "bold",
    fontSize: 16,
    fontStyle: fonts.regular
  },

  topperInfo: {
    paddingVertical: 4,
  },

  topperName: {
    fontSize: 20,
    fontWeight: "bold",
  },

  topperScore: {
    fontSize: 14,
    marginTop: 10,

  },


  cardTitle: {
    fontSize: 16,
    marginTop: 8,

  },

  Cards: {
    width: "100%",
    gap: 20,
    flexDirection: "row",
    height: 150

  },
  graph1: {
    flexDirection: "row",

  },
  cardNumber: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 4,
  },

  detailCard: {
    marginTop: 20,
    backgroundColor: "#fff",
    // padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    width: 560,
    height: 400
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },

  subText: {
    fontSize: 20,
    color: "#555",
    marginBottom: 4,
  },

  section: {
    width: "100%",
    marginTop: 25,
    width: 1000,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 22,
  },

  chartCard: {
    marginTop: 280,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    // alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
    width: 560,
    height: 300,
    // marginTop:
    marginLeft: 25
  },
  LineCard: {
    marginTop: 50,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    width: 980,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  ClassRoomCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F6F8",
    justifyContent: "center",
    padding: 46,
    borderRadius: "50%",
    borderWidth: 1,
    borderColor: "#eee",
    marginTop: 10,
    height: 100,
    gap: 20,
    width: 100
  },

});
