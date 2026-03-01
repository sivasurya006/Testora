import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useGlobalSearchParams } from 'expo-router';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { MaterialIcons } from '@expo/vector-icons';

import api from '../../../../util/api';
import Colors from '../../../../styles/Colors';
import Test from '../../../../src/components/Test';
import LoadingScreen from '../../../../src/components/LoadingScreen';
import { AppBoldText, AppRegularText } from '../../../../styles/fonts';

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
  labelColor: () => '#333',
  decimalPlaces: 0,
};

export default function Dashboard() {
  const { classroomId } = useGlobalSearchParams();
  const { width: screenWidth } = useWindowDimensions();

  const [stats, setStats] = useState({
    classroomName: '',
    createdAt: 0,
    creatorName: '',
    totalStudents: 0,
    totalTests: 0,
  });
  const [tests, setTests] = useState([]);
  const [topPerformance, setTopPerformance] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const isMobile = screenWidth < 900;

  const lineData = useMemo(() => {
    const labels = analytics.slice(0, 5).map((item) => item.testTitle || 'Test');
    const values = analytics.slice(0, 5).map((item) => Number(item.attemptCount) || 0);

    return {
      labels,
      datasets: [{ data: values.length > 0 ? values : [0] }],
    };
  }, [analytics]);

  const lineValues = lineData.datasets?.[0]?.data || [];
  const hasLineData = lineValues.some((value) => value > 0);
  const lineSegments = Math.max(...lineValues, 1);

  const pieData = useMemo(() => {
    const studentsCount = Number(stats.totalStudents) || 0;
    const submittedCount = analytics.reduce((total, item) => {
      const perTestSubmitted = Number(item.submittedTestCount ?? item.totalSubmissionCount ?? 0) || 0;
      return total + Math.min(Math.max(perTestSubmitted, 0), studentsCount);
    }, 0);
    const totalExpectedSubmissions = studentsCount * analytics.length;
    const notSubmittedCount = Math.max(totalExpectedSubmissions - submittedCount, 0);

    return [
      {
        name: 'Submitted',
        population: submittedCount,
        color: '#4CAF50',
        legendFontColor: '#333',
        legendFontSize: 12,
      },
      {
        name: 'Not Submitted',
        population: notSubmittedCount,
        color: '#F44336',
        legendFontColor: '#333',
        legendFontSize: 12,
      },
    ];
  }, [analytics, stats.totalStudents, stats.totalTests]);

  const hasPieData = pieData.some((item) => item.population > 0);

  const loadDashboard = useCallback(
    async () => {
      try {
        setIsLoading(true);

        const [statsRes, testsRes, topRes, analyticsRes] = await Promise.all([
          api.get('/api/api/classroomdetails', { headers: { 'X-ClassroomId': classroomId } }),
          api.get('/api/tests/get-created-tests?limit=5&status=published', {
            headers: { 'X-ClassroomId': classroomId },
          }),
          api.get('/api/api/getTopPerfomanceStudent', {
            headers: { 'X-ClassroomId': classroomId },
          }),
          api.get('/api/tests/getclassroomAnalitics', {
            headers: { 'X-ClassroomId': classroomId },
          }),
        ]);

        const statsData = {
          classroomName: statsRes?.data?.classroomName ?? '',
          createdAt: statsRes?.data?.createdAt ?? 0,
          creatorName: statsRes?.data?.creatorName ?? '',
          totalStudents: statsRes?.data?.totalStudents ?? 0,
          totalTests: statsRes?.data?.totalTests ?? 0,
        };
        const testsData = Array.isArray(testsRes?.data) ? testsRes.data : [];
        const topData = Array.isArray(topRes?.data) ? topRes.data : [];
        const analyticsData = Array.isArray(analyticsRes?.data) ? analyticsRes.data : [];

        setStats(statsData);
        setTests(testsData);
        setTopPerformance(topData);
        setAnalytics(analyticsData);
      } catch (err) {
        console.log('Dashboard fetch error:', err?.response?.data || err.message);
      } finally {
        setIsLoading(false);
      }
    },
    [classroomId]
  );

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [loadDashboard])
  );

  const wideChartWidth = isMobile ? screenWidth - 56 : Math.max(420, Math.min(screenWidth * 0.55, 820));
  const pieChartWidth = isMobile ? screenWidth - 56 : Math.max(320, Math.min(screenWidth * 0.28, 420));

  return (
    <>
      <StatusBar style="dark" backgroundColor={Colors.bgColor} />
      <SafeAreaView style={styles.safeArea} edges={[]}> 
        <LoadingScreen visible={isLoading} />

        <ScrollView contentContainerStyle={[styles.container, isMobile && styles.containerMobile]}>
          <View style={[styles.topRow, isMobile && styles.topRowMobile]}>
            <AppBoldText style={styles.pageTitle}>Classroom Dashboard</AppBoldText>
          </View>

          <View style={[styles.summaryRow, isMobile && styles.summaryRowMobile]}>
            <View style={styles.smallCard}>
              <MaterialIcons name="assignment" size={24} color={Colors.primaryColor} />
              <View style={styles.countWrap}>
                <AppRegularText style={styles.cardLabel}>Total Tests</AppRegularText>
                <AppBoldText style={styles.cardValue}>{stats.totalTests}</AppBoldText>
              </View>
            </View>

            <View style={styles.smallCard}>
              <MaterialIcons name="people" size={24} color={Colors.primaryColor} />
              <View style={styles.countWrap}>
                <AppRegularText style={styles.cardLabel}>Total Students</AppRegularText>
                <AppBoldText style={styles.cardValue}>{stats.totalStudents}</AppBoldText>
              </View>
            </View>
          </View>

          <View style={styles.classroomCard}>
            <AppBoldText style={styles.classroomTitle}>{stats.classroomName || 'Classroom'}</AppBoldText>
            <AppRegularText style={styles.classroomMeta}>Creator: {stats.creatorName || '-'}</AppRegularText>
            <AppRegularText style={styles.classroomMeta}>
              Created: {stats.createdAt ? new Date(stats.createdAt * 1000).toLocaleDateString() : '-'}
            </AppRegularText>
          </View>

          <View style={[styles.chartRow, isMobile && styles.chartRowMobile]}>
            <View style={[styles.chartCard, isMobile ? styles.mobileFullCard : styles.lineCard]}>
              <AppBoldText style={styles.sectionTitle}>Progress by Test</AppBoldText>
              {hasLineData ? (
                <LineChart
                  data={lineData}
                  width={wideChartWidth}
                  height={260}
                  chartConfig={chartConfig}
                  segments={lineSegments}
                  bezier
                  fromZero
                />
              ) : (
                <AppRegularText style={styles.emptyText}>
                  No attempts yet. Students need to submit tests to show progress.
                </AppRegularText>
              )}
            </View>

            <View style={[styles.chartCard, isMobile ? styles.mobileFullCard : styles.pieCard]}>
              <AppBoldText style={styles.sectionTitle}>Submission Status</AppBoldText>
              {hasPieData ? (
                <PieChart
                  data={pieData}
                  width={pieChartWidth}
                  height={220}
                  chartConfig={chartConfig}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft={isMobile ? '10' : '0'}
                />
              ) : (
                <AppRegularText style={styles.emptyText}>
                  No submission data available yet.
                </AppRegularText>
              )}
            </View>
          </View>

          {isMobile ? (
            <>
              <View style={[styles.sectionCard, styles.mobileSectionCard]}>
                <AppBoldText style={styles.sectionTitle}>Top Performing Students</AppBoldText>
                {topPerformance.length === 0 ? (
                  <AppRegularText style={styles.emptyText}>No performance records yet.</AppRegularText>
                ) : (
                  topPerformance.map((item, index) => (
                    <View key={`${item?.topPerformerName || 'top'}-${index}`} style={styles.topperCard}>
                      <View style={styles.avatar}>
                        <AppBoldText style={styles.avatarText}>
                          {(item?.topPerformerName || 'NA').slice(0, 2).toUpperCase()}
                        </AppBoldText>
                      </View>

                      <View style={{ flex: 1 }}>
                        <AppBoldText style={styles.topperName}>{item?.topPerformerName || '-'}</AppBoldText>
                        <AppRegularText style={styles.topperScore}>Score: {item?.score ?? 0}</AppRegularText>
                      </View>

                      <MaterialIcons name="trending-up" size={20} color={Colors.green} />
                    </View>
                  ))
                )}
              </View>

              <View style={[styles.sectionCard, styles.mobileSectionCard]}>
                <AppBoldText style={styles.sectionTitle}>Recently Published</AppBoldText>
                {tests.length === 0 ? (
                  <AppRegularText style={styles.emptyText}>No published tests yet.</AppRegularText>
                ) : (
                  tests.map((item, index) => <Test key={`${item?.testId || index}`} data={item} isDashboard={false} />)
                )}
              </View>
            </>
          ) : (
            <View style={styles.bottomRow}>
              <View style={styles.sectionCard}>
                <AppBoldText style={styles.sectionTitle}>Recently Published</AppBoldText>
                {tests.length === 0 ? (
                  <AppRegularText style={styles.emptyText}>No published tests yet.</AppRegularText>
                ) : (
                  tests.map((item, index) => <Test key={`${item?.testId || index}`} data={item} isDashboard={false} />)
                )}
              </View>

              <View style={styles.sectionCard}>
                <AppBoldText style={styles.sectionTitle}>Top Performing Students</AppBoldText>
                {topPerformance.length === 0 ? (
                  <AppRegularText style={styles.emptyText}>No performance records yet.</AppRegularText>
                ) : (
                  topPerformance.map((item, index) => (
                    <View key={`${item?.topPerformerName || 'top'}-${index}`} style={styles.topperCard}>
                      <View style={styles.avatar}>
                        <AppBoldText style={styles.avatarText}>
                          {(item?.topPerformerName || 'NA').slice(0, 2).toUpperCase()}
                        </AppBoldText>
                      </View>

                      <View style={{ flex: 1 }}>
                        <AppBoldText style={styles.topperName}>{item?.topPerformerName || '-'}</AppBoldText>
                        <AppRegularText style={styles.topperScore}>Score: {item?.score ?? 0}</AppRegularText>
                      </View>

                      <MaterialIcons name="trending-up" size={20} color={Colors.green} />
                    </View>
                  ))
                )}
              </View>
            </View>
          )}
        </ScrollView>

      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bgColor,
  },
  container: {
    padding: 16,
    backgroundColor: Colors.bgColor,
    gap: 14,
  },
  containerMobile: {
    gap: 12,
    paddingBottom: 90,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topRowMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 10,
  },
  pageTitle: {
    fontSize: 22,
    color: Colors.secondaryColor,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryRowMobile: {
    flexDirection: 'column',
  },
  smallCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.thirdColor,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  countWrap: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 13,
    color: Colors.lightFont,
  },
  cardValue: {
    fontSize: 20,
    color: Colors.secondaryColor,
  },
  classroomCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.thirdColor,
    padding: 16,
  },
  classroomTitle: {
    fontSize: 20,
    color: Colors.secondaryColor,
    marginBottom: 6,
  },
  classroomMeta: {
    color: Colors.lightFont,
    fontSize: 14,
  },
  chartRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'stretch',
  },
  chartRowMobile: {
    flexDirection: 'column',
  },
  mobileFullCard: {
    width: '100%',
    flex: 0,
  },
  chartCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.thirdColor,
    padding: 12,
    minHeight: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lineCard: {
    flex: 2,
  },
  pieCard: {
    flex: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  mobileSectionCard: {
    width: '100%',
    flex: 0,
  },
  sectionCard: {
    flex: 1,
    minWidth: 0,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.thirdColor,
    padding: 14,
    minHeight: 220,
  },
  sectionTitle: {
    fontSize: 16,
    color: Colors.secondaryColor,
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.lightFont,
    paddingVertical: 12,
  },
  topperCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F8',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
    marginTop: 8,
    gap: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Colors.secondaryColor,
    fontSize: 12,
  },
  topperName: {
    color: Colors.secondaryColor,
    fontSize: 14,
  },
  topperScore: {
    color: Colors.lightFont,
    fontSize: 12,
  },
});
