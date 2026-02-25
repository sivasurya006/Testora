import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '../../../../../../styles/Colors'
import SubmissionsHeader from '../../../../../../src/components/submissions/SubmissionsHeader'
import { ActivityIndicator } from 'react-native-paper';
import api from '../../../../../../util/api';
import { useGlobalSearchParams } from 'expo-router';
import AttemptCard from '../../../../../../src/components/submissions/AttemptCard';
import { FlatList } from 'react-native-gesture-handler';
import GradeScreen from '../../../../../../src/screens/GradeScreen';
import DetailedTestReport from '../../../../../../src/components/DetailedTestReport';

export default function StudentSubmissions() {




  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const params = useGlobalSearchParams();
  const [selected, setSelected] = useState('SUBMITTED');

  const [performanceChartData, setPerformanceChartData] = useState({});
  const [isGradeScreenOpen, setGradeScreenOpen] = useState(false);
  const [answerSheet, setAnswerSheet] = useState([]);
  const [isResultPageOpen, setResultPageOpen] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [ attemptId , setAttemptId ] = useState(null);

  console.log(params)

  const { classroomId, testId } = useGlobalSearchParams();

  async function handleGrade(attemptId) {
    const answer = await getAnswerSheet(classroomId, testId, attemptId);
    setAnswerSheet(answer);
    setAttemptId(attemptId)
    setGradeScreenOpen(true)
  }

  async function handleShowReport(attemptId) {
    const report = await getTestReport(classroomId, testId, attemptId);
    setReportData(report);
    setAttemptId(attemptId)
    setResultPageOpen(true)
  }

  useEffect(() => {
    const get = async () => {
      setIsLoading(true);
      const data = await getStudentAttempts(params.classroomId, params.testId, params.student);

      console.log(data)

      setData(data);
      setIsLoading(false);
    };

    get();
  }, [params.student, params.classroomId, params.testId]);



  useEffect(() => {
    if (!data) return;

    const filtered = data?.attempts?.filter(attempt => attempt.status === selected);
    setFilteredData(filtered);
  }, [selected, data]);

  useEffect(() => {

    if (!data || !data.attempts) return;

    const labels = [];
    const markData = [];


    // data.attempts?.reverse().forEach((attempt, i) => {
    //   if (attempt.status == 'EVALUATED' && i < 25) {
    //     labels.push(i+1);
    //     markData.push(attempt.marks);
    //   }
    // })


    for (let i = data.attempts.length - 1; i >= 0; i--) {
      if (data.attempts[i].status == 'EVALUATED') {
        labels.push(i + 1);
        markData.push(data.attempts[i].marks);
      }
      // if(labels.length > 24) break;
    }

    setPerformanceChartData({ labels: labels.reverse(), markData: markData.reverse() });

  }, [data])


  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size={'large'} />
      </View>
    )
  }


  function onExit() {
    if (isGradeScreenOpen) {
      setGradeScreenOpen(false)
    }
    if (isResultPageOpen) {
      setResultPageOpen(false);
    }
  }


  if (isGradeScreenOpen) {
    return <GradeScreen attemptId={attemptId} setAttempts={setData} attempts={data.attempts}  questions={answerSheet.questions} onExit={onExit} isGradeScreenOpen={isGradeScreenOpen} />
  }

  if (isResultPageOpen) {
    return <DetailedTestReport noModal={true}  totalMarks={reportData.totalMarks} onExit={onExit} isResultPageOpen={isResultPageOpen} questions={reportData.questions} />

  }

  // console.log(data)

  return (
    <View style={styles.container}>
      <SubmissionsHeader data={{ email: data?.userEmail, name: data?.userName }} selected={selected} setSelected={setSelected}
        performanceChartData={performanceChartData}
      />
      <FlatList
        data={filteredData}
        keyExtractor={item => item.attemptId + ""}
        renderItem={({ item }) => (
          <AttemptCard attempt={item} setFilteredData={setFilteredData} handleGrade={handleGrade} handleShowReport={handleShowReport} />
        )}
      />
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgColor
  }
})


async function getStudentAttempts(classroomId, testId, studentId) {
  try {
    const result = await api.get(`/api/tests/testAttempt?student=${studentId}`, {
      headers: {
        'X-ClassroomId': classroomId,
        'X-TestId': testId
      }
    });

    if (result.status == 200 && result.data) {
      return result.data
    }

  } catch (err) {
    console.log("can't get attempts", err.response?.data)
  }

  return [];
}



async function getAnswerSheet(classroomId, testId, attemptId) {
  try {
    const result = await api.get(`/api/tests/answerSheet?attempt=${attemptId}`, {
      headers: {
        'X-ClassroomId': classroomId,
        'X-TestId': testId
      }
    });

    if (result.status == 200 && result.data) {
      return result.data
    }

  } catch (err) {
    console.log("can't get report", err.response?.data)
  }

  return [];
}

async function getTestReport(classroomId, testId, attemptId) {
    try {
        const result = await api.get(`/api/tests/testReport?attempt=${attemptId}`, {
            headers: {
                'X-ClassroomId': classroomId,
                'X-TestId': testId
            }
        });

        if (result.status == 200 && result.data) {
            return result.data
        }

    } catch (err) {
        console.log("can't get report", err.response?.data)
    }

    return [];
}

