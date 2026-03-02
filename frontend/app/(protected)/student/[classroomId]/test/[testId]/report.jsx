import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useGlobalSearchParams, router } from "expo-router";
import api from "../../../../../../util/api";
import DetailedTestReport from "../../../../../../src/components/DetailedTestReport";
export default function ReportScreen() {
  const { classroomId, testId, attemptId } = useGlobalSearchParams();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, []);

  async function fetchReport() {
    try {
      const result = await api.get(
        `/api/tests/TraineeTestReport?attempt=${attemptId}`,
        {
          headers: {
            "X-ClassroomId": classroomId,
            "X-TestId": testId,
          },
        }
      );

      if (result.status === 200) {
        setReportData(result.data);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }

  function handleExit() {
    router.back();
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <DetailedTestReport
      noModal={true}  
      totalMarks={reportData?.totalMarks}
      questions={reportData?.questions}
      onExit={handleExit}
    />
  );
}