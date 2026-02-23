import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '../../../../../../styles/Colors'
import SubmissionsHeader from '../../../../../../src/components/submissions/SubmissionsHeader'
import { ActivityIndicator } from 'react-native-paper';
import api from '../../../../../../util/api';
import { useGlobalSearchParams } from 'expo-router';
import AttemptCard from '../../../../../../src/components/submissions/AttemptCard';
import { FlatList } from 'react-native-gesture-handler';

export default function StudentSubmissions() {




  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const params = useGlobalSearchParams();
  const [selected, setSelected] = useState('SUBMITTED');

  const [performanceChartData, setPerformanceChartData] = useState({});

  console.log(params)



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

    setPerformanceChartData({ labels : labels.reverse(), markData : markData })

  }, [data])


  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size={'large'} />
      </View>
    )
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
          <AttemptCard attempt={item} />
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
