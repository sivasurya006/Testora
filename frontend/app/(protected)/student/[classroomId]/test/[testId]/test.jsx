import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import TestHeader from '../../../../../../src/components/testComponents/TestHeader'
import TestFooter from '../../../../../../src/components/testComponents/TestFooter'
import QuestionView from '../../../../../../src/components/testComponents/QuestionView'
import Colors from '../../../../../../styles/Colors'
import api from '../../../../../../util/api'
import { error } from 'console'
import { useGlobalSearchParams } from 'expo-router'


export default function Test() {
  

  const [data, setData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [ message , setMessage ] = useState("Loading....")


  const { classroomId , testId } = useGlobalSearchParams();

  async function startNewTest() {
    try {
      const result = await api.get('/timedtest/start',{
        headers : {
          'X-ClassroomId' : classroomId,
          'X-TestId' : testId
        }
      })
      setData(result.data)
      console.log(result.data)
    } catch (err) {
      if(err.response.status == 403){
        setMessage('Maximum Attempts reached');
      }
      console.log(err.response?.data);

    }
  }

  useEffect(() => {
    startNewTest();
  }, [classroomId,testId])

  if (!data || !data.test) {
    return <Text style={{ textAlign: 'center', marginTop: 50 }}>{message}</Text>
  }

  const questions = data.test.questions;
  const currentQuestion = questions[currentIndex];
  const havePrevious = currentIndex > 0;
  const haveNext = currentIndex < questions.length - 1;

  function nextQuestion() {
    if (haveNext) {
      setCurrentIndex(currentIndex+1);
    }
  }

  function previousQuestion() {
    if (havePrevious) {
      setCurrentIndex(currentIndex- 1);
    }
  }


  return (
    <View style={{ flex: 1 }}>
      <TestHeader data={data.test} />
      <View style={{ maxWidth: 380, width: '100%', height: 13, borderRadius: 30, backgroundColor: '#ddd', margin: 'auto', marginTop: 40 }}>
        <View style={{
          width: ((currentIndex + 1) / data.test.questions.length) * 380,
          borderRadius: 30, height: '100%', backgroundColor: Colors.primaryColor
        }} >
        </View>
      </View>
      <Text style={styles.quesNumber} >{currentIndex + 1}{' / '}{data.test.questions.length}</Text>
      <View style={styles.content}>
        <QuestionView question={currentQuestion} />
      </View>
      <TestFooter havePrevious={havePrevious} haveNext={haveNext} onNext={nextQuestion} onPrevious={previousQuestion} />
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 35,
    paddingVertical: 20,
  },
  quesNumber: {
    fontSize: 28,
    textAlign: 'center',
    paddingTop: 15
  }
})