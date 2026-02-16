import { StyleSheet, Text, View, FlatList, ScrollView, Dimensions } from "react-native";
import React, { useCallback, useState } from "react";
import api from "../../../../util/api";
import Colors from "../../../../styles/Colors";
import { useFocusEffect, useGlobalSearchParams } from "expo-router";
import Test from "../../../../src/components/Test";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LineChart, PieChart } from "react-native-chart-kit";
import { useWindowDimensions } from "react-native";
import { AppBoldText, AppRegularText } from "../../../../styles/fonts";
export default function Dashboard() {
  const { classroomId } = useGlobalSearchParams();
  const screenWidth = Dimensions.get("window").width;

  const [stats, setStats] = useState({
    classroomName: "",
    createdAt: 0,
    creatorName: "",
    totalStudents: 0,
  });


  const { width } = useWindowDimensions();
  const screenwidth = width;

  const isMobile = width <= 812;
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
      if (res.status === 200) {
        setStats(res.data);
      }
    } catch (err) { }
  }

  async function fetchDashboardCount() {
    try {
      const res = await api.get("/api/classroomcount", {
        headers: { "X-ClassroomId": classroomId },
      });
      if (res.status === 200) {
        setStates(res.data);
      }
    } catch (err) { }
  }
  { console.log(classroomId) }
  async function fetchDashboardTests() {
    try {
      const res = await api.get("/api/tests/get-created-tests?limit=5&status=published",
        { headers: { "X-ClassroomId": classroomId } }
      );
      if (res.status === 200) {
        setTests(res.data);
      }



    } catch (err) { }
  }

  const pieData = [
    { name: "Submitted", population: 35, color: "#4CAF50", legendFontColor: "#333", legendFontSize: 12 },
    { name: "Not Submitted", population: 15, color: "#F87171", legendFontColor: "#333", legendFontSize: 12 },
  ];

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [{ data: [25, 72, 69, 90, 70] }],
  };

  const array = [
    {
      id: 1,
      name: "Deepa",
      score: 95,
    },
    {
      id: 2,
      name: "Arun",
      score: 89,
    },
    {
      id: 3,
      name: "Priya",
      score: 92,
    },
    {
      id: 4,
      name: "Karthik",
      score: 88,
    },
    {
      id: 5,
      name: "Meena",
      score: 97,
    },
  ];


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>

        {isMobile ? (
          <>

            <View style={styles.cardRowMobile}>
              <View style={styles.smallCardMobile}>
                <MaterialIcons name="assignment" size={26} color={Colors.primaryColor} />
                <View>
                  <AppRegularText style={styles.cardTitleMobile}>Tests</AppRegularText>
                  <Text style={styles.cardNumberMobile}>{states.testCount}</Text>
                </View>
              </View>

              <View style={styles.smallCardMobile}>
                <MaterialIcons name="people" size={26} color={Colors.primaryColor} />
                <View>
                  <AppRegularText style={styles.cardTitleMobile}>Students</AppRegularText>
                  <Text style={styles.cardNumberMobile}>{stats.totalStudents}</Text>
                </View>
              </View>
            </View>

            <View style={styles.detailCardMobile}>
              <AppBoldText style={styles.titleMobile}>{stats.classroomName}</AppBoldText>
              <AppRegularText style={styles.subTextMobile}>
                Creator: {stats.creatorName}
              </AppRegularText>
              <AppRegularText style={styles.subTextMobile}>
                Created:{" "}
                {stats.createdAt
                  ? new Date(stats.createdAt * 1000).toLocaleDateString()
                  : "-"}
              </AppRegularText>
            </View>

            <View style={styles.chartCardMobile}>
              <AppBoldText style={styles.sectionTitle}>Monthly Progress</AppBoldText>
              <LineChart
                data={lineData}
                width={screenWidth - 32}
                height={220}
                chartConfig={chartConfig}
                bezier
              />
            </View>

            <View style={styles.chartCardMobile}>
              <AppBoldText style={styles.sectionTitle}>Submission</AppBoldText>
              <PieChart
                data={pieData}
                width={screenWidth - 32}
                height={200}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
              />
            </View>
            <View style={styles.sectionMobile}>
              <AppBoldText style={styles.sectionTitle}>Recently Published</AppBoldText>

              <View style={{ width: "100%" }}>
                <FlatList
                  data={tests}
                  scrollEnabled={false}
                  keyExtractor={(item, index) => index.toString()}
                  contentContainerStyle={{ gap: 12 }}
                  renderItem={({ item }) => (
                    <View style={{ width: "100%" }}>
                      <Test data={item} isDashboard />
                    </View>
                  )}
                />
              </View>

            </View>
            <View style={styles.sectionMobile}>
              <AppBoldText style={styles.sectionTitle}>Top Performing</AppBoldText>
              {array.map((item, index) => (
                <View key={index} style={styles.topperCardMobile}>
                  <View style={styles.avatar}>
                    <AppRegularText style={styles.avatarText}>
                      {item.name.substring(0, 2).toUpperCase()}
                    </AppRegularText>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.topperName}>{item.name}</Text>
                    <Text style={styles.topperScore}>
                      Score: {item.score}
                    </Text>
                  </View>

                  <MaterialIcons name="trending-up" size={20} color="green" />
                </View>
              ))}
            </View>
          </>
        ) : (
          <>

            <View style={styles.Cards}>
              <View style={styles.smallCardRow}>
                <View style={styles.smallCard}>
                  <MaterialIcons name="assignment" size={34} color={Colors.primaryColor} />
                  <View style={styles.Count}>
                    <AppRegularText style={styles.cardTitle}>Total Tests</AppRegularText>
                    <Text style={styles.cardNumber}>{states.testCount}</Text>
                  </View>
                </View>

                <View style={styles.smallCard}>
                  <MaterialIcons name="people" size={34} color={Colors.primaryColor} />
                  <View style={styles.Count}>
                    <AppRegularText style={styles.cardTitle}>Total Students</AppRegularText>
                    <Text style={styles.cardNumber}>{stats.totalStudents}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.detailCard}>
                <View style={styles.classroomDeatilTop} />
                <View style={styles.classRoomDetailCard}>
                  <AppRegularText style={styles.title}>{stats.classroomName}</AppRegularText>
                  <View style={styles.creatorCard}>
                    <AppRegularText style={styles.subText}>Creator:</AppRegularText>
                    <Text style={styles.creatorName}>{stats.creatorName}</Text>
                  </View>
                  <View style={styles.creatorCard}>
                    <Text style={styles.subText}>Created:</Text>
                    <Text style={styles.createdAt}>
                      {stats.createdAt
                        ? new Date(stats.createdAt * 1000).toLocaleDateString()
                        : "-"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.graph1}>
              <View style={styles.LineCard}>
                <AppRegularText style={styles.sectionTitle}>Monthly Progress</AppRegularText>
                <LineChart
                  data={lineData}
                  width={960}
                  height={400}
                  chartConfig={chartConfig}
                  bezier
                />
              </View>

              <View style={styles.chartCard}>
                <AppRegularText style={styles.sectionTitle}>Submission Status</AppRegularText>
                <PieChart
                  data={pieData}
                  width={400}
                  height={220}
                  chartConfig={chartConfig}
                  accessor="population"
                  backgroundColor="transparent"
                />
              </View>
            </View>

            <View style={styles.bottom}>
              <View style={styles.section}>
                <AppRegularText style={styles.sectionTitle}>Recently Published</AppRegularText>
                <FlatList
                  data={tests}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <Test data={item} isDashboard={false} />
                  )}
                />
              </View>

              <View style={styles.sectionTopPeform}>
                <AppRegularText style={styles.sectionTitle}>Top Performing</AppRegularText>
                <View style={styles.topperContainerDesktop}>
                  {array.map((item, index) => (
                    <View key={index} style={styles.topperCardDesktop}>
                      <View style={styles.nameProfile}>
                        <AppRegularText style={styles.profileText}>
                          {item.name.substring(0, 2).toUpperCase()}
                        </AppRegularText>
                      </View>

                      <View>
                        <AppRegularText style={styles.topperNameDesktop}>
                          {item.name}
                        </AppRegularText>
                        <AppRegularText style={styles.topperScoreDesktop}>
                          Score: {item.score}
                        </AppRegularText>
                      </View>

                      <View style={styles.progressIcon}>
                        <MaterialIcons name="trending-up" size={20} color="green" />
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </>
        )}
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


  cardRowMobile: {
    flexDirection: "row",
    gap: 12,
  },

  smallCardMobile: {
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

  cardTitleMobile: {
    fontSize: 13,
    color: "#666",
  },

  creatorName: {
    fontSize: 14,
    marginLeft: 5,
    color: '#555',
    marginBottom: 4
  },
  createdAt: {
    fontSize: 14,
    marginLeft: 5,
    color: '#555',
    marginBottom: 4
  },

  cardNumberMobile: {
    fontSize: 18,
    fontWeight: "bold",
  },

  detailCardMobile: {
    marginTop: 16,
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },

  titleMobile: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },

  subTextMobile: {
    fontSize: 13,
    color: "#555",
  },

  chartCardMobile: {
    marginTop: 16,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },

  sectionMobile: {
    marginTop: 18,
  },

  topperCardMobile: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F6F8",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
    marginTop: 8,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  avatarText: {
    fontWeight: "bold",
    fontSize: 14,
  },

  topperName: {
    fontSize: 14,
    fontWeight: "bold",
  },

  topperScore: {
    fontSize: 12,
    color: "#555",
  },


  Cards: {
    width: "100%",
    gap: 20,
    flexDirection: "row",
    height: 150,
  },

  smallCardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
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

  Count: {
    paddingLeft: 30,
  },

  cardTitle: {
    fontSize: 26,
    marginTop: 8,
  },

  cardNumber: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 4,
  },

  detailCard: {
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    width: 560,
    height: 400,
  },

  classroomDeatilTop: {
    height: 120,
    backgroundColor: "#DFE8FB",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },

  classRoomDetailCard: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 100,
  },

  creatorCard: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5
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

  graph1: {
    flexDirection: "row",
  },

  LineCard: {
    marginTop: 50,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    width: 980,
    alignItems: "center",
    justifyContent: "center",
  },

  chartCard: {
    marginTop: 280,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    width: 560,
    height: 300,
    marginLeft: 25,
  },

  bottom: {
    flexDirection: "row",
    gap: 20,

  },

  section: {
    width: 980,
    marginTop: 25,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },

  topperContainerDesktop: {
    marginTop: 10,
    backgroundColor: Colors.white,
    padding: 20,
  },

  topperCardDesktop: {
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
    width: 540,
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
  },

  progressIcon: {

    marginHorizontal: 250
  }
  ,
  sectionTopPeform: {
    width: 580,
    marginTop: 25,
  }

});

